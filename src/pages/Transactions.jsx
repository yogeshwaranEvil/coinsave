// src/pages/Transactions.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';
import { formatMoney } from '../utils/helpers';
import { ArrowDownRight, ArrowUpRight, Search, Filter } from 'lucide-react';

export default function Transactions() {
  const navigate = useNavigate();
  const { isAED, fxRate } = useAppStore();
  const [transactions, setTransactions] = useState([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Income, Expense
  const [filterCurrency, setFilterCurrency] = useState('All'); // All, AED, INR

  useEffect(() => {
    api.getTransactions().then(setTransactions).catch(console.error);
  }, []);

  // Apply Search and Filters
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || tx.type.toLowerCase() === filterType.toLowerCase();
    const matchesCurrency = filterCurrency === 'All' || tx.currency === filterCurrency;
    
    return matchesSearch && matchesType && matchesCurrency;
  });

  return (
    <div className="p-5 space-y-6 animate-in fade-in duration-300 pb-24">
      <h1 className="text-xl font-bold text-white flex items-center justify-between">
        Transaction History
        <Filter size={20} className="text-neutral-400" />
      </h1>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 text-neutral-500" size={18} />
        <input 
          type="text" 
          placeholder="Search categories or notes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600 transition-colors"
        />
      </div>

      {/* QUICK FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Income', 'Expense'].map(type => (
          <button 
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterType === type ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'}`}
          >
            {type}
          </button>
        ))}
        <div className="w-px bg-neutral-800 mx-1"></div>
        {['All', 'AED', 'INR'].map(cur => (
          <button 
            key={cur}
            onClick={() => setFilterCurrency(cur)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterCurrency === cur ? 'bg-indigo-500 text-white' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'}`}
          >
            {cur}
          </button>
        ))}
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-neutral-500 py-10 text-sm">No transactions found.</div>
        ) : (
          filteredTransactions.map((tx) => (
            <div 
              key={tx._id} 
              onClick={() => navigate(`/transaction/${tx._id}`)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {tx.type === 'income' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-200">{tx.category}</p>
                  <p className="text-[10px] text-neutral-500">{new Date(tx.date).toLocaleDateString()} • {tx.currency}</p>
                </div>
              </div>
              <div className={`font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-neutral-100'}`}>
                {tx.type === 'expense' ? '-' : '+'}{formatMoney(tx.amount, isAED, fxRate, tx.currency)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}