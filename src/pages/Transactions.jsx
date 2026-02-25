// src/pages/Transactions.jsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { ArrowDownRight, ArrowUpRight, Search, Filter, X, Receipt, CalendarClock } from 'lucide-react';

export default function Transactions() {
  const navigate = useNavigate();
  
  const { isAED, fxRate, transactions, fetchTransactions, isLoading } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); 
  const [filterCurrency, setFilterCurrency] = useState('All'); 

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const category = tx.category || '';
      const notes = tx.notes || '';
      
      const matchesSearch = 
        category.toLowerCase().includes(searchTerm.toLowerCase()) || 
        notes.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesType = filterType === 'All' || tx.type.toLowerCase() === filterType.toLowerCase();
      const matchesCurrency = filterCurrency === 'All' || tx.currency === filterCurrency;
      
      return matchesSearch && matchesType && matchesCurrency;
    });
  }, [transactions, searchTerm, filterType, filterCurrency]);

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((groups, tx) => {
      const date = new Date(tx.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(tx);
      return groups;
    }, {});
  }, [filteredTransactions]);

  const filteredTotal = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => {
      const amountInAED = tx.currency === 'INR' ? Number(tx.amount) / (fxRate || 22.85) : Number(tx.amount);
      return tx.type === 'income' ? sum + amountInAED : sum - amountInAED;
    }, 0);
  }, [filteredTransactions, fxRate]);

  return (
    <div className="p-5 space-y-6 animate-in fade-in duration-300 pb-28 min-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Filtered Balance: <span className="text-white font-medium">{formatMoney(filteredTotal, isAED, fxRate, 'AED')}</span>
          </p>
        </div>
        <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <Filter size={18} />
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-4 top-3.5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search categories, notes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl py-3.5 pl-11 pr-10 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-indigo-500/50 focus:bg-neutral-900 transition-all shadow-sm"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute right-4 top-3.5 text-neutral-500 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      {/* QUICK FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* NEW: Button to view Scheduled/Upcoming Bills */}
        <button 
          onClick={() => navigate('/upcoming-bills')}
          className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <CalendarClock size={14} /> Upcoming
        </button>

        <div className="w-px bg-neutral-800 mx-1 shrink-0"></div>

        {['All', 'Income', 'Expense'].map(type => (
          <button 
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === type 
                ? 'bg-white text-black shadow-md scale-100' 
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 scale-95 hover:scale-100'
            }`}
          >
            {type}
          </button>
        ))}
        <div className="w-px bg-neutral-800 mx-1 shrink-0"></div>
        {['All', 'AED', 'INR'].map(cur => (
          <button 
            key={cur}
            onClick={() => setFilterCurrency(cur)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              filterCurrency === cur 
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 scale-100' 
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 scale-95 hover:scale-100'
            }`}
          >
            {cur}
          </button>
        ))}
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center text-neutral-500 py-10 text-sm animate-pulse">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500 space-y-4">
            <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center">
              <Receipt size={24} className="text-neutral-700" />
            </div>
            <p className="text-sm font-medium text-neutral-400">No transactions found</p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date} className="space-y-3">
              <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider pl-1">{date}</h3>
              
              <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl overflow-hidden">
                {dayTransactions.map((tx, index) => (
                  <div 
                    key={tx.id || tx._id}
                    onClick={() => navigate(`/transaction/${tx.id || tx._id}`)}
                    className={`p-4 flex justify-between items-center active:bg-neutral-800/50 transition-colors cursor-pointer ${
                      index !== dayTransactions.length - 1 ? 'border-b border-neutral-800/50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`p-2.5 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {tx.type === 'income' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-200">{tx.category}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                          {tx.notes ? tx.notes : tx.type === 'income' ? 'Income entry' : 'Expense entry'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-neutral-100'}`}>
                        {tx.type === 'expense' ? '-' : '+'}{formatMoney(tx.amount, isAED, fxRate, tx.currency)}
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5 font-medium tracking-wide">
                        {tx.currency}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}