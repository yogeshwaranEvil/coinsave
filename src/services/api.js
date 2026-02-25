// // src/services/api.js
// // const API_URL = 'https://coinsave-backend.onrender.com/api';
// const API_URL = 'http://localhost:8000/api';

// export const api = {

//   // Add this right below createTransaction in src/services/api.js
//   updateTransaction: async (id, data) => {
//     const res = await fetch(`${API_URL}/transactions/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     if (!res.ok) throw new Error('Failed to update transaction');
//     return res.json();
//   },
// // Add this inside the api object in src/services/api.js
//   deleteTransaction: async (id) => {
//     const res = await fetch(`${API_URL}/transactions/${id}`, {
//       method: 'DELETE',
//     });
//     if (!res.ok) throw new Error('Failed to delete transaction');
//     return true;
//   },
// // Add these inside your exported `api` object:
//   createRemittance: async (data) => {
//     const res = await fetch(`${API_URL}/remittances/`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     if (!res.ok) throw new Error('Failed to create remittance');
//     return res.json();
//   },

//   createWealthItem: async (data) => {
//     const res = await fetch(`${API_URL}/wealth/`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     if (!res.ok) throw new Error('Failed to create wealth item');
//     return res.json();
//   },

//   // TRANSACTIONS
//   getTransactions: async () => {
//     const res = await fetch(`${API_URL}/transactions/`);
//     if (!res.ok) throw new Error('Failed to fetch transactions');
//     return res.json();
//   },
  
//   createTransaction: async (data) => {
//     const res = await fetch(`${API_URL}/transactions/`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     if (!res.ok) throw new Error('Failed to create transaction');
//     return res.json();
//   },

//   // WEALTH
//   getWealth: async () => {
//     const res = await fetch(`${API_URL}/wealth/`);
//     if (!res.ok) throw new Error('Failed to fetch wealth');
//     return res.json();
//   },

//   // REMITTANCES
//   getRemittances: async () => {
//     const res = await fetch(`${API_URL}/remittances/`);
//     if (!res.ok) throw new Error('Failed to fetch remittances');
//     return res.json();
//   }
// };  


// src/services/api.js
// src/services/api.js

const STORAGE_KEYS = {
  TRANSACTIONS: 'coinsave_transactions',
  WEALTH: 'coinsave_wealth',
  REMITTANCES: 'coinsave_remittances',
  UPCOMING: 'coinsave_upcoming',
};

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

export const api = {
  // --- TRANSACTIONS ---
  getTransactions: async () => {
    await simulateNetwork();
    return getData(STORAGE_KEYS.TRANSACTIONS);
  },
  
  createTransaction: async (data) => {
    await simulateNetwork();
    const transactions = getData(STORAGE_KEYS.TRANSACTIONS);
    // FIX: Respect provided ID (important for remit twins)
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
    
    if (index === -1) return null; // Store handles "Add if missing"
    
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

  // --- UPCOMING ---
  getUpcoming: async () => {
    await simulateNetwork();
    return getData(STORAGE_KEYS.UPCOMING);
  },

  createUpcoming: async (data) => {
    await simulateNetwork();
    const upcoming = getData(STORAGE_KEYS.UPCOMING);
    const newItem = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    upcoming.push(newItem);
    saveData(STORAGE_KEYS.UPCOMING, upcoming);
    return newItem;
  },

  updateUpcoming: async (id, data) => {
    await simulateNetwork();
    const upcoming = getData(STORAGE_KEYS.UPCOMING);
    const index = upcoming.findIndex(u => u.id === id || u._id === id);
    if (index === -1) throw new Error('Upcoming bill not found');
    upcoming[index] = { ...upcoming[index], ...data, updatedAt: new Date().toISOString() };
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

  // --- REMITTANCES ---
  getRemittances: async () => {
    await simulateNetwork();
    return getData(STORAGE_KEYS.REMITTANCES);
  },

  createRemittance: async (data) => {
    await simulateNetwork();
    const remittances = getData(STORAGE_KEYS.REMITTANCES);
    const newItem = { ...data, id: generateId(), createdAt: new Date().toISOString() };
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
  }
};