// src/services/api.js

const STORAGE_KEYS = {
  TRANSACTIONS: 'coinsave_transactions',
  WEALTH: 'coinsave_wealth',
  REMITTANCES: 'coinsave_remittances',
  UPCOMING: 'coinsave_upcoming',
  LOANS: 'coinsave_loans',
};

// --- HELPERS ---
const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const generateId = () => {
  return typeof crypto.randomUUID === 'function' 
    ? crypto.randomUUID() 
    : Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const simulateNetwork = () => new Promise(resolve => setTimeout(resolve, 150));

// --- API EXPORT ---
export const api = {
  // --- TRANSACTIONS ---
  getTransactions: async () => {
    await simulateNetwork();
    return getData(STORAGE_KEYS.TRANSACTIONS);
  },
  
  createTransaction: async (data) => {
    await simulateNetwork();
    const transactions = getData(STORAGE_KEYS.TRANSACTIONS);
    // Fix: Respect provided ID (important for remit and loan-repay sync)
    const newItem = { 
      ...data, 
      id: data.id || generateId(), 
      createdAt: new Date().toISOString() 
    };
    transactions.push(newItem);
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);
    return newItem;
  },

  updateTransaction: async (id, data) => {
    await simulateNetwork();
    const transactions = getData(STORAGE_KEYS.TRANSACTIONS);
    const index = transactions.findIndex(t => t.id === id || t._id === id);
    if (index === -1) return null;
    transactions[index] = { 
      ...transactions[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);
    return transactions[index];
  },

  deleteTransaction: async (id) => {
    await simulateNetwork();
    const transactions = getData(STORAGE_KEYS.TRANSACTIONS);
    const filtered = transactions.filter(t => t.id !== id && t._id !== id);
    saveData(STORAGE_KEYS.TRANSACTIONS, filtered);
    return true;
  },

  // --- UPCOMING BILLS ---
  getUpcoming: async () => {
    await simulateNetwork();
    return getData(STORAGE_KEYS.UPCOMING);
  },

  createUpcoming: async (data) => {
    await simulateNetwork();
    const upcoming = getData(STORAGE_KEYS.UPCOMING);
    const newItem = { 
      ...data, 
      id: generateId(), 
      createdAt: new Date().toISOString(),
      status: 'pending' 
    };
    upcoming.push(newItem);
    saveData(STORAGE_KEYS.UPCOMING, upcoming);
    return newItem;
  },

  updateUpcoming: async (id, data) => {
    await simulateNetwork();
    const upcoming = getData(STORAGE_KEYS.UPCOMING);
    const index = upcoming.findIndex(u => u.id === id || u._id === id);
    if (index === -1) throw new Error('Upcoming bill not found');
    upcoming[index] = { 
      ...upcoming[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    saveData(STORAGE_KEYS.UPCOMING, upcoming);
    return upcoming[index];
  },

  deleteUpcoming: async (id) => {
    await simulateNetwork();
    const upcoming = getData(STORAGE_KEYS.UPCOMING);
    const filtered = upcoming.filter(u => u.id !== id && u._id !== id);
    saveData(STORAGE_KEYS.UPCOMING, filtered);
    return true;
  },

  // --- LOANS ---
  getLoans: async () => {
    await simulateNetwork();
    return getData(STORAGE_KEYS.LOANS);
  },

  createLoan: async (data) => {
    await simulateNetwork();
    const loans = getData(STORAGE_KEYS.LOANS);
    const newItem = { 
      ...data, 
      id: generateId(), 
      createdAt: new Date().toISOString() 
    };
    loans.push(newItem);
    saveData(STORAGE_KEYS.LOANS, loans);
    return newItem;
  },

  updateLoan: async (id, data) => {
    await simulateNetwork();
    const loans = getData(STORAGE_KEYS.LOANS);
    const index = loans.findIndex(l => l.id === id || l._id === id);
    if (index === -1) throw new Error('Loan not found');
    loans[index] = { 
      ...loans[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    saveData(STORAGE_KEYS.LOANS, loans);
    return loans[index];
  },

  deleteLoan: async (id) => {
    await simulateNetwork();
    const loans = getData(STORAGE_KEYS.LOANS);
    const filtered = loans.filter(l => l.id !== id && l._id !== id);
    saveData(STORAGE_KEYS.LOANS, filtered);
    return true;
  },

  // --- REMITTANCES ---
  getRemittances: async () => {
    await simulateNetwork();
    return getData(STORAGE_KEYS.REMITTANCES);
  },

  createRemittance: async (data) => {
    await simulateNetwork();
    const remittances = getData(STORAGE_KEYS.REMITTANCES);
    const newItem = { 
      ...data, 
      id: generateId(), 
      createdAt: new Date().toISOString() 
    };
    remittances.push(newItem);
    saveData(STORAGE_KEYS.REMITTANCES, remittances);
    return newItem;
  },

  updateRemittance: async (id, data) => {
    await simulateNetwork();
    const remittances = getData(STORAGE_KEYS.REMITTANCES);
    const index = remittances.findIndex(r => r.id === id || r._id === id);
    if (index === -1) throw new Error('Remittance record not found');
    remittances[index] = { 
      ...remittances[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    saveData(STORAGE_KEYS.REMITTANCES, remittances);
    return remittances[index];
  },

  deleteRemittance: async (id) => {
    await simulateNetwork();
    const remittances = getData(STORAGE_KEYS.REMITTANCES);
    const filtered = remittances.filter(r => r.id !== id && r._id !== id);
    saveData(STORAGE_KEYS.REMITTANCES, filtered);
    return true;
  },

  // --- ASSETS / WEALTH ---
  getAssets: async () => {
    await simulateNetwork();
    return getData(STORAGE_KEYS.WEALTH);
  },

  createAsset: async (data) => {
    await simulateNetwork();
    const assets = getData(STORAGE_KEYS.WEALTH);
    const newItem = { 
      ...data, 
      id: generateId(), 
      createdAt: new Date().toISOString() 
    };
    assets.push(newItem);
    saveData(STORAGE_KEYS.WEALTH, assets);
    return newItem;
  },

  updateAsset: async (id, data) => {
    await simulateNetwork();
    const assets = getData(STORAGE_KEYS.WEALTH);
    const index = assets.findIndex(a => a.id === id || a._id === id);
    if (index === -1) throw new Error('Asset not found');
    assets[index] = { 
      ...assets[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    saveData(STORAGE_KEYS.WEALTH, assets);
    return assets[index];
  },

  deleteAsset: async (id) => {
    await simulateNetwork();
    const assets = getData(STORAGE_KEYS.WEALTH);
    const filtered = assets.filter(a => a.id !== id && a._id !== id);
    saveData(STORAGE_KEYS.WEALTH, filtered);
    return true;
  }
};