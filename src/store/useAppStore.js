// src/store/useAppStore.js
import { create } from 'zustand';
import { api } from '../services/api';

export const useAppStore = create((set, get) => ({
  // --- PREFERENCES & FX ---
  isAED: true,
  fxRate: 22.85, // Fallback rate
  toggleCurrency: () => set((state) => ({ isAED: !state.isAED })),
  
  fetchLiveFxRate: async () => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/AED');
      const data = await res.json();
      if (data && data.rates && data.rates.INR) {
        set({ fxRate: data.rates.INR });
      }
    } catch (error) {
      console.error("Failed to fetch live FX rate, using fallback:", error);
    }
  },

  // --- GLOBAL DATA STATE ---
  transactions: [],
  remittances: [],
  wealth: [],
  upcomingBills: [], // <-- NEW: Array to hold upcoming expenses
  isLoading: false,

  // --- TRANSACTION ACTIONS ---
  fetchTransactions: async () => {
    set({ isLoading: true });
    const data = await api.getTransactions();
    // Sort newest first
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
    // Sort by closest due date first
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

  // THE MAGIC FUNCTION: Pay a bill and convert it to a real transaction
  markUpcomingAsPaid: async (bill) => {
    const { addTransaction, deleteUpcoming } = get();
    
    // 1. Create a real transaction from the upcoming bill data
    await addTransaction({
      type: 'expense',
      amount: bill.amount,
      currency: bill.currency,
      category: bill.category,
      date: new Date().toISOString(), // Automatically stamps today's date
      notes: `[Auto-Paid] ${bill.notes || 'Scheduled Bill'}`
    });

    // 2. Remove it from the upcoming list so it disappears from the Dashboard
    await deleteUpcoming(bill.id || bill._id);
  },

  // --- REMITTANCE ACTIONS ---
  fetchRemittances: async () => {
    const data = await api.getRemittances();
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    set({ remittances: sortedData });
  },

  addRemittance: async (remittanceData) => {
    const newRemit = await api.createRemittance(remittanceData);
    set((state) => ({ 
      remittances: [newRemit, ...state.remittances] 
    }));
    return newRemit;
  }
}));