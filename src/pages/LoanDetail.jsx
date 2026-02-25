// src/pages/LoanDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  Landmark, 
  Calendar, 
  Info, 
  TrendingUp,
  History,
  AlertTriangle
} from 'lucide-react';

export default function LoanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Pulling state and actions from the store
  const { loans, deleteLoan, fxRate, isAED } = useAppStore();

  // Flexible ID lookup
  const loan = loans.find(l => l.id === id || l._id === id);

  if (!loan) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-5 text-center">
        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center text-neutral-700 mb-4">
          <Landmark size={32} />
        </div>
        <p className="text-neutral-500 font-medium mb-6">This loan record could not be found.</p>
        <button 
          onClick={() => navigate('/loans')} 
          className="bg-neutral-900 px-6 py-2 rounded-xl text-white border border-neutral-800 font-bold"
        >
          Return to Loans
        </button>
      </div>
    );
  }

  const isCompleted = loan.principal <= 0 || loan.status === 'closed';

  const handleDelete = async () => {
    // Updated warning to reflect that repayments will also be synced/deleted
    const confirmMessage = "⚠️ WARNING: Deleting this loan will also remove ALL associated payment transactions from your history to keep your Net Worth accurate. This cannot be undone. Proceed?";
    
    if (window.confirm(confirmMessage)) {
      await deleteLoan(id);
      navigate('/loans');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-right-4 pb-24">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/loans')} 
          className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400 active:scale-90 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Loan Intelligence</h1>
        <div className="w-10"></div>
      </div>

      {/* BIG STATUS HEADER */}
      <div className="text-center mb-8">
        <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-5 shadow-2xl ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/5' : 'bg-rose-500/10 text-rose-500 shadow-rose-500/5'}`}>
          <Landmark size={40} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">{loan.name}</h2>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-3 border ${isCompleted ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/5 border-rose-500/20 text-rose-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isCompleted ? 'Fully Repaid' : 'Active Liability'}
          </span>
        </div>
      </div>

      {/* CORE DETAILS CARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-6 shadow-xl relative overflow-hidden">
        {/* Subtle Decorative Background */}
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <History size={120} />
        </div>

        <div className="flex justify-between items-center relative z-10">
          <span className="text-sm text-neutral-400 flex items-center gap-2 font-medium">
            <Info size={16} className="text-neutral-600" /> Outstanding
          </span>
          <span className={`text-xl font-black ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
            {formatMoney(loan.principal, loan.currency === 'AED', fxRate, loan.currency)}
          </span>
        </div>
        
        <div className="h-px bg-neutral-800/50 w-full"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <span className="text-sm text-neutral-400 flex items-center gap-2 font-medium">
            <TrendingUp size={16} className="text-neutral-600" /> Interest Rate
          </span>
          <span className="text-sm font-bold text-white">
            {loan.interestPerMonth}% <span className="text-[10px] text-neutral-500 font-bold uppercase ml-1">Monthly</span>
          </span>
        </div>
        
        <div className="h-px bg-neutral-800/50 w-full"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <span className="text-sm text-neutral-400 flex items-center gap-2 font-medium">
            <Calendar size={16} className="text-neutral-600" /> Close Date
          </span>
          <span className="text-sm font-bold text-white">
            {new Date(loan.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mt-8">
        <button 
          onClick={() => navigate(`/add-loan?edit=${loan.id || loan._id}`)}
          className="flex-1 bg-neutral-900 border border-neutral-800 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <Edit3 size={18} /> Edit Loan
        </button>
        <button 
          onClick={handleDelete}
          className="flex-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>

      {/* SYNC WARNING FOOTER */}
      <div className="mt-10 flex items-start gap-3 px-4 py-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
        <AlertTriangle className="text-rose-500 shrink-0" size={16} />
        <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">
          <span className="text-rose-400 font-bold uppercase tracking-wider block mb-1">System Note:</span>
          Deleting this record will automatically purge all "Loan Repayment" expenses linked to this entry to ensure your Net Worth remains synchronized.
        </p>
      </div>

    </div>
  );
}