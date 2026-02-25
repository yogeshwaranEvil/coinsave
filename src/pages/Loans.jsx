// src/pages/Loans.jsx
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { 
  Landmark, 
  Plus, 
  Clock, 
  CreditCard, 
  ChevronRight, 
  AlertCircle,
  TrendingUp,
  CalendarDays
} from 'lucide-react';

export default function Loans() {
  const navigate = useNavigate();
  
  // Destructure state and actions from the global store
  const { 
    loans, 
    fetchLoans, 
    isAED, 
    fxRate, 
    isLoading 
  } = useAppStore();

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  // Calculations for the Summary Dashboard
  const { totalDebtAED, monthlyInterestAED, closingSoonCount } = useMemo(() => {
    let debt = 0;
    let interest = 0;
    let soon = 0;
    const now = new Date();

    loans.forEach(loan => {
      // Normalize currency to AED for the total display
      const amount = loan.currency === 'INR' ? Number(loan.principal) / fxRate : Number(loan.principal);
      debt += amount;
      
      // Calculate estimated monthly interest impact
      const monthlyInt = (amount * (Number(loan.interestPerMonth) / 100));
      interest += monthlyInt;

      // Check if loan closes in the next 90 days
      const daysLeft = Math.ceil((new Date(loan.closeDate) - now) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0 && daysLeft <= 90) soon++;
    });

    return { 
      totalDebtAED: debt, 
      monthlyInterestAED: interest,
      closingSoonCount: soon 
    };
  }, [loans, fxRate]);

  return (
    <div className="p-5 space-y-6 pb-28 min-h-screen bg-neutral-950 animate-in fade-in duration-300 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Landmark className="text-rose-500" size={24} /> Loans
          </h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-medium">Debt Management</p>
        </div>
        <button 
          onClick={() => navigate('/add-loan')}
          className="bg-rose-600 w-11 h-11 rounded-full text-white flex items-center justify-center hover:bg-rose-500 active:scale-90 transition-all shadow-lg shadow-rose-500/20"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* DEBT SUMMARY CARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-5 shadow-xl shadow-black/20 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full"></div>
        
        <div>
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Outstanding</div>
          <div className="text-4xl font-black text-white tracking-tighter">
            {formatMoney(totalDebtAED, isAED, fxRate, 'AED')}
          </div>
        </div>

        <div className="h-px w-full bg-neutral-800/50"></div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold block tracking-wider">Interest/Mo</span>
            <span className="font-bold text-rose-400 flex items-center gap-1.5 text-sm">
              <TrendingUp size={14} /> {formatMoney(monthlyInterestAED, isAED, fxRate, 'AED')}
            </span>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[10px] text-neutral-500 uppercase font-bold block tracking-wider">Closing Soon</span>
            <span className="font-bold text-indigo-400 flex items-center justify-end gap-1.5 text-sm">
              <CalendarDays size={14} /> {closingSoonCount} Loans
            </span>
          </div>
        </div>
      </div>

      {/* LOAN LIST */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Active Liabilities</h2>
        
        {isLoading ? (
          <div className="text-center py-10 text-neutral-600 text-sm animate-pulse">Syncing debts...</div>
        ) : loans.length === 0 ? (
          <div className="text-center bg-neutral-900/40 border border-dashed border-neutral-800 rounded-3xl py-12">
            <AlertCircle size={32} className="mx-auto text-neutral-800 mb-3" />
            <p className="text-sm text-neutral-600">No active loans found. You're debt-free!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {loans.map((loan) => {
              const daysLeft = Math.ceil((new Date(loan.closeDate) - new Date()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysLeft < 0;

              return (
                <div key={loan.id || loan._id} className="bg-neutral-900/60 border border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                          <Landmark size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">{loan.name}</h3>
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isOverdue ? 'text-rose-500' : 'text-neutral-500'}`}>
                            <Clock size={10} /> 
                            {isOverdue ? 'Closed/Expired' : `${daysLeft} days left`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">
                          {formatMoney(loan.principal, loan.currency === 'AED', fxRate, loan.currency)}
                        </div>
                        <div className="text-[10px] text-rose-400/80 font-bold uppercase mt-0.5">
                          @{loan.interestPerMonth}% Int.
                        </div>
                      </div>
                    </div>

                    {/* ACTION ROW */}
                    <div className="flex gap-2 pt-2 border-t border-neutral-800/40">
                      <button 
                        onClick={() => navigate(`/pay-loan/${loan.id || loan._id}`)}
                        className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 py-3 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                      >
                        <CreditCard size={14} /> Record Payment
                      </button>
                      <button 
                        onClick={() => navigate(`/add-loan?edit=${loan.id || loan._id}`)}
                        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-3 rounded-2xl transition-all active:scale-[0.98]"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}