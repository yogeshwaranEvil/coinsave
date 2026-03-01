// src/pages/Transactions.jsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { 
  ArrowDownRight, ArrowUpRight, Search, Filter, X, 
  Receipt, CalendarClock, CreditCard, Wallet 
} from 'lucide-react';

export default function Transactions() {
  const navigate = useNavigate();
  
  const { isAED, fxRate, transactions, fetchTransactions, isLoading } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); 
  const [filterCurrency, setFilterCurrency] = useState('All');
  const [filterMethod, setFilterMethod] = useState('All'); // New: Method Filter

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
      
      // NEW: Payment Method logic
      const matchesMethod = filterMethod === 'All' || 
        (filterMethod === 'Credit' && tx.paymentMethod === 'credit_card') ||
        (filterMethod === 'Cash' && tx.paymentMethod !== 'credit_card');
      
      return matchesSearch && matchesType && matchesCurrency && matchesMethod;
    });
  }, [transactions, searchTerm, filterType, filterCurrency, filterMethod]);

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
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">History</h1>
          <p className="text-[10px] text-neutral-500 mt-1 font-bold uppercase tracking-widest">
            Net Value: <span className="text-white">{formatMoney(filteredTotal, isAED, fxRate, 'AED')}</span>
          </p>
        </div>
        <button className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400">
          <Filter size={18} />
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-4 top-3.5 text-neutral-600" size={18} />
        <input 
          type="text" 
          placeholder="Search items..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl py-4 pl-12 pr-10 text-sm text-white outline-none placeholder:text-neutral-700 focus:border-indigo-500/30 transition-all font-bold"
        />
      </div>

      {/* CHIP FILTERS */}
      <div className="flex flex-col gap-4">
        {/* PAYMENT SOURCE FILTERS */}
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {['All', 'Cash', 'Credit'].map(method => (
            <button 
              key={method}
              onClick={() => setFilterMethod(method)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                filterMethod === method 
                  ? 'bg-amber-500 text-neutral-950 shadow-lg' 
                  : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
              }`}
            >
              {method === 'Credit' && <CreditCard size={12} />}
              {method === 'Cash' && <Wallet size={12} />}
              {method}
            </button>
          ))}
        </div>

        {/* TYPE FILTERS */}
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {['All', 'Income', 'Expense'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterType === type 
                  ? 'bg-white text-neutral-950 shadow-lg' 
                  : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-20 text-neutral-600 font-black uppercase text-[10px] tracking-widest animate-pulse">Syncing...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-20 opacity-20">
            <Receipt size={48} className="mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">No Records Found</p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date} className="space-y-3">
              <h3 className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] pl-1">{date}</h3>
              
              <div className="space-y-3">
                {dayTransactions.map((tx) => (
                  <div 
                    key={tx.id || tx._id}
                    onClick={() => navigate(`/transaction/${tx.id || tx._id}`)}
                    className="bg-neutral-900/40 border border-neutral-800/60 rounded-[2rem] p-5 flex justify-between items-center active:bg-neutral-900 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {tx.type === 'income' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white">{tx.category}</p>
                          {tx.paymentMethod === 'credit_card' && (
                            <div className="p-1 bg-amber-500/10 text-amber-500 rounded-md">
                              <CreditCard size={10} />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-500 font-medium mt-0.5 line-clamp-1 uppercase tracking-tighter">
                          {tx.notes || 'Uncategorized Entry'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.type === 'expense' ? '-' : '+'}{formatMoney(tx.amount, isAED, fxRate, tx.currency)}
                      </p>
                      <p className="text-[9px] text-neutral-600 font-bold uppercase mt-1">
                        {tx.paymentMethod === 'credit_card' ? 'Credit' : 'Cash'}
                      </p>
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