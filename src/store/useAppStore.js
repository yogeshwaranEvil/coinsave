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
  loans: [],
  cards: [],
  isLoading: false,
  metalRates: { gold_aed: 620, silver_aed: 12, gold_inr: 16200, silver_inr: 300, lastUpdated: null },
  pin: localStorage.getItem('coinsave_pin') || null,
  isLocked: !!localStorage.getItem('coinsave_pin'),

  // --- TRANSACTION ACTIONS ---
  fetchTransactions: async () => {
    set({ isLoading: true });
    const data = await api.getTransactions();
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    set({ transactions: sortedData, isLoading: false });
  },

  addTransaction: async (transactionData) => {
    const newTx = await api.createTransaction(transactionData);
    set((state) => ({ transactions: [newTx, ...state.transactions] }));
    return newTx;
  },

  updateTransaction: async (id, updatedData) => {
    const updatedTx = await api.updateTransaction(id, updatedData);
    if (!updatedTx) return null;
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

  // --- CREDIT CARD ACTIONS ---
  fetchCards: async () => {
    const data = await api.getCards();
    set({ cards: data });
  },

  addCard: async (cardData) => {
    const newCard = await api.createCard(cardData);
    set((state) => ({ cards: [...state.cards, newCard] }));
    return newCard;
  },

  deleteCard: async (id) => {
    const { transactions, deleteTransaction } = get();
    const linkedTransactions = transactions.filter(tx => String(tx.cardId) === String(id));
    for (const tx of linkedTransactions) {
      await deleteTransaction(tx.id || tx._id);
    }
    await api.deleteCard(id);
    set((state) => ({ cards: state.cards.filter(c => c.id !== id && c._id !== id) }));
  },

  // --- 🔴 FIXED: CARD OUTSTANDING MATH ---
  getCardOutstanding: (cardId) => {
    const { transactions } = get();
    return transactions
      .filter(tx => 
        String(tx.cardId) === String(cardId) && 
        tx.paymentMethod === 'credit_card' // MUST ONLY COUNT CARD SIDE
      )
      .reduce((acc, tx) => {
        const amt = Number(tx.amount) || 0;
        // Expenses add to debt, Income (Repayments) subtract from debt
        return tx.type === 'expense' ? acc + amt : acc - amt;
      }, 0);
  },

  payCardBill: async (cardId, amount, note = '') => {
    const { cards, addTransaction } = get();
    const card = cards.find(c => c.id === cardId || c._id === cardId);
    if (!card) return;

    const timestamp = Date.now();

    // 1. CASH OUTFLOW
    await addTransaction({
      id: `pay-out-${cardId}-${timestamp}`,
      type: 'expense',
      paymentMethod: 'cash',
      cardId: cardId, 
      amount: amount,
      currency: card.currency,
      category: 'Bill Payment',
      date: new Date().toISOString(),
      notes: `Bank Transfer to ${card.bankName}. ${note}`
    });

    // 2. CREDIT INFLOW
    await addTransaction({
      id: `pay-in-${cardId}-${timestamp}`,
      type: 'income', 
      paymentMethod: 'credit_card',
      cardId: cardId,
      amount: amount,
      currency: card.currency,
      category: 'Card Repayment',
      isInternalTransfer: true, 
      date: new Date().toISOString(),
      notes: `Settlement for ****${card.lastFour}`
    });
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

  // --- REMITTANCE ACTIONS ---
  fetchRemittances: async () => {
    const data = await api.getRemittances();
    set({ remittances: data.sort((a, b) => new Date(b.date) - new Date(a.date)) });
  },

  addRemittance: async (remitData) => {
    const { addTransaction } = get();
    const newRemit = await api.createRemittance(remitData);
    await addTransaction({
      id: `remit-${newRemit.id}`, 
      type: 'expense',
      amount: newRemit.aed_sent + newRemit.transfer_fee_aed,
      currency: 'AED',
      category: 'Remittance',
      date: newRemit.date,
      notes: `Sent to ${newRemit.destination_account}`
    });
    set((state) => ({ remittances: [newRemit, ...state.remittances] }));
    return newRemit;
  },

  updateRemittance: async (id, updatedData) => {
    const { transactions, updateTransaction } = get();
    const updatedRemit = await api.updateRemittance(id, updatedData);
    set((state) => ({
      remittances: state.remittances.map(r => (r.id === id || r._id === id) ? updatedRemit : r)
    }));
    const twinId = `remit-${id}`;
    const twinExists = transactions.some(tx => tx.id === twinId || tx._id === twinId);
    const twinPayload = {
      amount: updatedRemit.aed_sent + updatedRemit.transfer_fee_aed,
      date: updatedRemit.date,
      notes: `Sent to ${updatedRemit.destination_account}`,
      category: 'Remittance',
      type: 'expense',
      currency: 'AED'
    };
    if (twinExists) {
      const updatedTwin = await api.updateTransaction(twinId, twinPayload);
      set((state) => ({
        transactions: state.transactions.map(tx => (tx.id === twinId || tx._id === twinId) ? updatedTwin : tx)
      }));
    } else {
      const newTwin = await api.createTransaction({ ...twinPayload, id: twinId });
      set((state) => ({ transactions: [newTwin, ...state.transactions] }));
    }
    return updatedRemit;
  },

  deleteRemittance: async (id) => {
    const { deleteTransaction } = get();
    await api.deleteRemittance(id);
    await deleteTransaction(`remit-${id}`);
    set((state) => ({
      remittances: state.remittances.filter(r => r.id !== id && r._id !== id)
    }));
  },

  // --- LOAN ACTIONS ---
  fetchLoans: async () => {
    const data = await api.getLoans();
    const sorted = data.sort((a, b) => new Date(a.closeDate) - new Date(b.closeDate));
    set({ loans: sorted });
  },

  addLoan: async (loanData) => {
    const newLoan = await api.createLoan(loanData);
    set((state) => ({
      loans: [...state.loans, newLoan].sort((a, b) => new Date(a.closeDate) - new Date(b.closeDate))
    }));
    return newLoan;
  },

  updateLoan: async (id, updatedData) => {
    const updated = await api.updateLoan(id, updatedData);
    set((state) => ({
      loans: state.loans.map(l => (l.id === id || l._id === id) ? updated : l)
        .sort((a, b) => new Date(a.closeDate) - new Date(b.closeDate))
    }));
  },

  deleteLoan: async (id) => {
    const { transactions, deleteTransaction } = get();
    await api.deleteLoan(id);
    const linkedRepayments = transactions.filter(tx => 
      tx.category === 'Loan Repayment' && 
      (tx.notes.includes(id) || tx.id.startsWith(`repay-${id}`))
    );
    for (const repayTx of linkedRepayments) {
      await deleteTransaction(repayTx.id || repayTx._id);
    }
    set((state) => ({
      loans: state.loans.filter(l => l.id !== id && l._id !== id)
    }));
  },

  // --- ASSET & WEALTH ACTIONS ---
  fetchAssets: async () => {
    const data = await api.getAssets();
    set({ wealth: data });
  },

  addAsset: async (assetData) => {
    const newAsset = await api.createAsset(assetData);
    set((state) => ({ wealth: [...state.wealth, newAsset] }));
  },

  updateAsset: async (id, data) => {
    const updated = await api.updateAsset(id, data);
    set((state) => ({
      wealth: state.wealth.map(a => (a.id === id || a._id === id) ? updated : a)
    }));
  },

  fetchMetalRates: async () => {
    const { metalRates } = get();
    const oneHour = 60 * 60 * 1000;
    const isFresh = metalRates.lastUpdated && (new Date() - new Date(metalRates.lastUpdated) < oneHour);
    if (isFresh) return;
    const rates = await api.getLiveMetalRates();
    if (rates) set({ metalRates: rates });
  },

  // --- 🔴 FIXED: GLOBAL NET WORTH MATH ---
  getGlobalNetWorth: () => {
    const { wealth, loans, fxRate, metalRates, isAED, transactions } = get();
    const safeFx = fxRate || 22.85;
    const rates = metalRates || { gold_aed: 310, silver_aed: 3.5, gold_inr: 7200, silver_inr: 95 };

    const assetsAED = wealth.reduce((acc, asset) => {
      let assetValueAED = 0;
      if (asset.category === 'commodity') {
        const isGold = asset.metalType === 'gold';
        const baseRate = isGold ? rates.gold_aed : rates.silver_aed;
        let purityFactor = 1;
        if (isGold) {
          const caratValue = parseInt(asset.purity) || 24;
          purityFactor = caratValue / 24;
        } else {
          purityFactor = asset.purity === '925' ? 0.925 : 1;
        }
        assetValueAED = (Number(asset.grams) || 0) * baseRate * purityFactor;
      } 
      else if (asset.category === 'market') {
        const totalVal = (Number(asset.quantity) || 0) * (Number(asset.currentPrice) || 0);
        assetValueAED = asset.currency === 'INR' ? totalVal / safeFx : totalVal;
      } 
      else {
        const val = Number(asset.value) || Number(asset.totalValue) || 0;
        assetValueAED = asset.currency === 'INR' ? val / safeFx : val;
      }
      return acc + assetValueAED;
    }, 0);

    const loanDebtsAED = loans.reduce((acc, loan) => {
      const loanVal = Number(loan.principal) || 0;
      return acc + (loan.currency === 'INR' ? loanVal / safeFx : loanVal);
    }, 0);

    // CRITICAL MATH FIX: Subtract repayments, add expenses
    const creditDebtsAED = transactions
      .filter(tx => tx.paymentMethod === 'credit_card')
      .reduce((acc, tx) => {
        const amt = Number(tx.amount) || 0;
        const convertedAmt = tx.currency === 'INR' ? amt / safeFx : amt;
        return tx.type === 'expense' ? acc + convertedAmt : acc - convertedAmt;
      }, 0);

    const finalNetWorthAED = assetsAED - loanDebtsAED - creditDebtsAED;
    return isAED ? finalNetWorthAED : finalNetWorthAED * safeFx;
  },

  // --- SECURITY ---
  setPin: (newPin) => {
    localStorage.setItem('coinsave_pin', newPin);
    set({ pin: newPin, isLocked: false });
  },

  removePin: () => {
    localStorage.removeItem('coinsave_pin');
    set({ pin: null, isLocked: false });
  },

  unlock: () => set({ isLocked: false }),
  lock: () => set({ isLocked: true }),
  // Add this under the --- ASSET & WEALTH ACTIONS --- section in useAppStore.js

  // Add this inside src/store/useAppStore.js under the ASSET actions

  // --- ADD THIS TO src/store/useAppStore.js ---
// Inside src/store/useAppStore.js
  
 deleteAsset: async (id) => {
    await api.deleteAsset(id);
    
    set((state) => ({
      wealth: state.wealth.filter(a => String(a.id) !== String(id) && String(a._id) !== String(id))
    }));
  },
}));