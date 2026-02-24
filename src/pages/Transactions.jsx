// src/pages/Transactions.jsx
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';
import { formatMoney } from '../utils/helpers';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function Transactions() {
  const { isAED, fxRate } = useAppStore();
  const [transactions, setTransactions] = useState([]);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [currency, setCurrency] = useState('AED');
  const [category, setCategory] = useState('');

  const loadData = () => {
    api.getTransactions().then(setTransactions).catch(console.error);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    try {
      await api.createTransaction({
        type,
        amount: parseFloat(amount),
        currency,
        category,
      });
      // Reset form and reload list
      setAmount(''); setCategory('');
      loadData();
    } catch (err) {
      alert("Error saving transaction");
    }
  };

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-xl font-bold">Log & History</h1>

      {/* Add Transaction Form */}
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className="bg-neutral-950 border border-neutral-800 text-sm rounded-lg p-2 text-white outline-none">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-neutral-950 border border-neutral-800 text-sm rounded-lg p-2 text-white outline-none">
            <option value="AED">AED</option>
            <option value="INR">INR</option>
          </select>
        </div>
        
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none"
        />
        <input 
          type="text" 
          placeholder="Category (e.g. Food, Salary)" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none"
        />
        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors">
          Save Record
        </button>
      </form>

      {/* History List */}
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx._id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {tx.type === 'income' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div>
                <p className="text-sm font-semibold">{tx.category}</p>
                <p className="text-[10px] text-neutral-500">{new Date(tx.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className={`font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-neutral-100'}`}>
              {tx.type === 'expense' ? '-' : '+'}{formatMoney(tx.amount, isAED, fxRate, tx.currency)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}