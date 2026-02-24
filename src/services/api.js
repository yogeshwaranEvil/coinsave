// src/services/api.js
const API_URL = 'https://coinsave-backend.onrender.com/api';

export const api = {

// Add these inside your exported `api` object:
  createRemittance: async (data) => {
    const res = await fetch(`${API_URL}/remittances/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create remittance');
    return res.json();
  },

  createWealthItem: async (data) => {
    const res = await fetch(`${API_URL}/wealth/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create wealth item');
    return res.json();
  },

  // TRANSACTIONS
  getTransactions: async () => {
    const res = await fetch(`${API_URL}/transactions/`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },
  
  createTransaction: async (data) => {
    const res = await fetch(`${API_URL}/transactions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return res.json();
  },

  // WEALTH
  getWealth: async () => {
    const res = await fetch(`${API_URL}/wealth/`);
    if (!res.ok) throw new Error('Failed to fetch wealth');
    return res.json();
  },

  // REMITTANCES
  getRemittances: async () => {
    const res = await fetch(`${API_URL}/remittances/`);
    if (!res.ok) throw new Error('Failed to fetch remittances');
    return res.json();
  }
};  

