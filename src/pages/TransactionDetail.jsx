// src/pages/TransactionDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { ArrowLeft, Trash2, Edit3, Calendar, Tag, FileText, Globe, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { transactions, fetchTransactions, deleteTransaction, fxRate } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (transactions.length === 0) {
        await fetchTransactions();
      }
      setIsLoading(false);
    };
    loadData();
  }, [transactions.length, fetchTransactions]);

  // Find transaction safely using either id format
  const tx = transactions.find((t) => t.id === id || t._id === id);

  // Helper to identify if this is a remittance twin
  const isRemit = tx?.category === 'Remittance' || (tx?.id && String(tx.id).startsWith('remit-'));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-500 animate-pulse text-sm font-medium">Loading details...</div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-5 space-y-4">
        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center text-neutral-600 mb-2">
          <FileText size={24} />
        </div>
        <p className="text-neutral-400 text-sm">Transaction not found or deleted.</p>
        <button 
          onClick={() => navigate('/transactions', { replace: true })} 
          className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 transition-colors border border-neutral-800 rounded-xl text-white font-medium text-sm mt-4"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (confirmDelete) {
      await deleteTransaction(tx.id || tx._id);
      navigate('/transactions', { replace: true });
    }
  };

  const handleEdit = () => {
    // Normal transaction edit (Logic for remits removed here since button is hidden)
    navigate(`/edit-transaction/${tx.id || tx._id}`);
  };

  const safeFxRate = fxRate > 0 ? fxRate : 22.85;
  const convertedAmount = tx.currency === 'AED' 
    ? Number(tx.amount) * safeFxRate 
    : Number(tx.amount) / safeFxRate;
  
  const convertedCurrency = tx.currency === 'AED' ? 'INR' : 'AED';
  const isIncome = tx.type === 'income';

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-right-4 duration-300 pb-24">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold text-neutral-300 tracking-wider uppercase">Receipt</h1>
        <div className="w-10"></div>
      </div>

      {/* BIG AMOUNT DISPLAY */}
      <div className="flex flex-col items-center justify-center py-6 mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {isIncome ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
        </div>
        
        <span className={`text-xs font-bold tracking-wider uppercase mb-2 ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isIncome ? 'Income' : 'Expense'}
        </span>
        
        <div className={`text-5xl font-bold tracking-tighter ${isIncome ? 'text-emerald-400' : 'text-white'}`}>
          {!isIncome && '-'}{formatMoney(tx.amount, tx.currency === 'AED', safeFxRate, tx.currency)}
        </div>
        
        <div className="text-neutral-400 mt-3 font-medium flex items-center gap-1.5 bg-neutral-900/80 border border-neutral-800 px-4 py-1.5 rounded-full text-xs shadow-sm">
          <Globe size={12} className={isIncome ? 'text-emerald-500' : 'text-indigo-400'} />
          ≈ {formatMoney(convertedAmount, convertedCurrency === 'AED', safeFxRate, convertedCurrency)}
        </div>
      </div>

      {/* RECEIPT CARD */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 space-y-6 relative overflow-hidden shadow-xl shadow-black/20">
        
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-800/80 flex items-center justify-center text-neutral-400 shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Date</p>
            <p className="text-sm font-medium text-neutral-200 mt-0.5">
              {new Date(tx.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-800/50"></div>

        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-800/80 flex items-center justify-center text-neutral-400 shrink-0">
            <Tag size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Category</p>
            <p className="text-sm font-medium text-neutral-200 mt-0.5">{tx.category}</p>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-800/50"></div>

        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-800/80 flex items-center justify-center text-neutral-400 shrink-0">
            <FileText size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Notes</p>
            <p className="text-sm font-medium text-neutral-300 mt-0.5 leading-relaxed">
              {tx.notes || <span className="text-neutral-600 italic">No notes provided.</span>}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS: Only shown if it is NOT a remittance */}
      {!isRemit && (
        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleEdit}
            className="flex-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 active:scale-[0.98] transition-all rounded-2xl py-4 flex items-center justify-center gap-2 text-white font-semibold text-sm shadow-sm"
          >
            <Edit3 size={16} /> Edit
          </button>
          <button 
            onClick={handleDelete}
            className="flex-1 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98] transition-all rounded-2xl py-4 flex items-center justify-center gap-2 text-rose-500 font-semibold text-sm shadow-sm"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}

      {/* FOOTER NOTE FOR REMITS */}
      {isRemit && (
        <p className="text-center text-neutral-600 text-[10px] mt-6 font-medium uppercase tracking-widest">
          Manage this record in the Remittance section
        </p>
      )}

    </div>
  );
}