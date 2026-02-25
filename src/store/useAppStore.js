// src/store/useAppStore.js
import { create } from 'zustand';
import { api } from '../services/api';

export const useAppStore = create((set, get) => ({
  // --- PREFERENCES & FX ---
  isAED: true,
  fxRate: 22.85, 
  toggleCurrency: () => set((state) => ({ isAED: !state.isAED })),
  
  fetchLiveFxRate: async () => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/AED');
      const data = await res.json();
      if (data && data.rates && data.rates.INR) {
        set({ fxRate: data.rates.INR });
      }
    } catch (error) {
      console.error("Failed to fetch live FX rate:", error);
    }
  },

  // --- GLOBAL DATA STATE ---
  transactions: [],
  remittances: [],
  wealth: [],
  upcomingBills: [],
  isLoading: false,

  // --- TRANSACTION ACTIONS ---
  fetchTransactions: async () => {
    set({ isLoading: true });
    const data = await api.getTransactions();
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    set({ transactions: sortedData, isLoading: false });
  },

  addTransaction: async (transactionData) => {
    const newTx = await api.createTransaction(transactionData);
    set((state) => ({ 
      transactions: [newTx, ...state.transactions] 
    }));
    return newTx;
  },

  updateTransaction: async (id, updatedData) => {
    const updatedTx = await api.updateTransaction(id, updatedData);
    set((state) => ({
      transactions: state.transactions.map(tx => (tx.id === id || tx._id === id) ? updatedTx : tx)
    }));
    return updatedTx;
  },

  deleteTransaction: async (id) => {
    await api.deleteTransaction(id);
    set((state) => ({
      transactions: state.transactions.filter(tx => tx.id !== id && tx._id !== id)
    }));
  },

  // --- UPCOMING EXPENSES ACTIONS ---
  fetchUpcoming: async () => {
    const data = await api.getUpcoming();
    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    set({ upcomingBills: sortedData });
  },

  addUpcoming: async (billData) => {
    const newBill = await api.createUpcoming(billData);
    set((state) => {
      const updated = [...state.upcomingBills, newBill];
      return { upcomingBills: updated.sort((a, b) => new Date(a.date) - new Date(b.date)) };
    });
    return newBill;
  },

  updateUpcoming: async (id, updatedData) => {
    const updatedBill = await api.updateUpcoming(id, updatedData);
    set((state) => ({
      upcomingBills: state.upcomingBills.map(bill => (bill.id === id || bill._id === id) ? updatedBill : bill)
    }));
    return updatedBill;
  },

  deleteUpcoming: async (id) => {
    await api.deleteUpcoming(id);
    set((state) => ({
      upcomingBills: state.upcomingBills.filter(bill => bill.id !== id && bill._id !== id)
    }));
  },

  markUpcomingAsPaid: async (bill) => {
    const { addTransaction, deleteUpcoming } = get();
    await addTransaction({
      type: 'expense',
      amount: bill.amount,
      currency: bill.currency,
      category: bill.category,
      date: new Date().toISOString(),
      notes: `[Auto-Paid] ${bill.notes || 'Scheduled Bill'}`
    });
    await deleteUpcoming(bill.id || bill._id);
  },

  // --- REMITTANCE ACTIONS (SYNCED WITH TRANSACTIONS) ---
  fetchRemittances: async () => {
    const data = await api.getRemittances();
    set({ remittances: data.sort((a, b) => new Date(b.date) - new Date(a.date)) });
  },

  addRemittance: async (remitData) => {
    const { addTransaction } = get();
    const newRemit = await api.createRemittance(remitData);
    
    // Automatically log this as an expense to impact Net Worth
    await addTransaction({
      id: `remit-${newRemit.id}`, // Custom ID to link them
      type: 'expense',
      amount: newRemit.aed_sent + newRemit.transfer_fee_aed,
      currency: 'AED',
      category: 'Remittance',
      date: newRemit.date,
      notes: `To: ${newRemit.destination_account} (Rate: ${newRemit.exchange_rate_secured})`
    });

    set((state) => ({ remittances: [newRemit, ...state.remittances] }));
    return newRemit;
  },

  updateRemittance: async (id, updatedData) => {
    const { updateTransaction } = get();
    const updatedRemit = await api.updateRemittance(id, updatedData);
    
    // Update the linked transaction entry
    await updateTransaction(`remit-${id}`, {
      amount: updatedRemit.aed_sent + updatedRemit.transfer_fee_aed,
      date: updatedRemit.date,
      notes: `To: ${updatedRemit.destination_account} (Rate: ${updatedRemit.exchange_rate_secured})`
    });

    set((state) => ({
      remittances: state.remittances.map(r => (r.id === id || r._id === id) ? updatedRemit : r)
    }));
    return updatedRemit;
  },

  deleteRemittance: async (id) => {
    const { deleteTransaction } = get();
    await api.deleteRemittance(id);
    
    // Remove the linked transaction to restore Net Worth
    await deleteTransaction(`remit-${id}`);
    
    set((state) => ({
      remittances: state.remittances.filter(r => r.id !== id && r._id !== id)
    }));
  }
}));