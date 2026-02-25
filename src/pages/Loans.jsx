// src/pages/Loans.jsx
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { 
  Landmark, Plus, Clock, CreditCard, ChevronRight, 
  AlertCircle, TrendingUp, CalendarDays, CheckCircle2 
} from 'lucide-react';

export default function Loans() {
  const navigate = useNavigate();
  const { loans, fetchLoans, isAED, fxRate, isLoading } = useAppStore();

  useEffect(() => { fetchLoans(); }, [fetchLoans]);

  const { activeLoans, closedLoans, totalDebtAED, monthlyInterestAED } = useMemo(() => {
    let debt = 0; let interest = 0;
    const active = []; const closed = [];
    
    loans.forEach(loan => {
      if (loan.status === 'closed' || loan.principal <= 0) {
        closed.push(loan);
      } else {
        active.push(loan);
        const amount = loan.currency === 'INR' ? Number(loan.principal) / fxRate : Number(loan.principal);
        debt += amount;
        interest += (amount * (Number(loan.interestPerMonth) / 100));
      }
    });
    return { activeLoans: active, closedLoans: closed, totalDebtAED: debt, monthlyInterestAED: interest };
  }, [loans, fxRate]);

  const LoanCard = ({ loan, isActive }) => {
    const daysLeft = Math.ceil((new Date(loan.closeDate) - new Date()) / (1000 * 60 * 60 * 24));
    return (
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {isActive ? <Landmark size={20} /> : <CheckCircle2 size={20} />}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{loan.name}</h3>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                  {isActive ? `${daysLeft} days left` : 'Fully Repaid'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-white">
                {formatMoney(loan.principal, loan.currency === 'AED', fxRate, loan.currency)}
              </div>
              {isActive && <div className="text-[10px] text-rose-400/80 font-bold uppercase mt-0.5">@{loan.interestPerMonth}% Int.</div>}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-neutral-800/40">
            {isActive && (
              <button 
                onClick={() => navigate(`/pay-loan/${loan.id || loan._id}`)}
                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 py-3 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all"
              >
                <CreditCard size={14} /> Pay
              </button>
            )}
            <button 
              onClick={() => navigate(`/loan/${loan.id || loan._id}`)}
              className={`py-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center ${isActive ? 'bg-neutral-800 text-neutral-300 px-4' : 'w-full bg-neutral-800 text-neutral-400 text-[11px] font-bold gap-2'}`}
            >
              {isActive ? <ChevronRight size={18} /> : <>View Details <ChevronRight size={14} /></>}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 space-y-6 pb-28 min-h-screen bg-neutral-950 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2"><Landmark className="text-rose-500" size={24} /> Loans</h1>
        <button onClick={() => navigate('/add-loan')} className="bg-rose-600 w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg"><Plus size={24} /></button>
      </div>

      {/* SUMMARY CARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-5 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full"></div>
        <div>
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Outstanding</div>
          <div className="text-4xl font-black text-white">{formatMoney(totalDebtAED, isAED, fxRate, 'AED')}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-800/50">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold block">Monthly Int.</span>
            <span className="font-bold text-rose-400 flex items-center gap-1.5 text-sm"><TrendingUp size={14} /> {formatMoney(monthlyInterestAED, isAED, fxRate, 'AED')}</span>
          </div>
        </div>
      </div>

      {/* ACTIVE LIST */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Active Liabilities</h2>
        {activeLoans.length === 0 ? <p className="text-sm text-neutral-600 text-center py-4">No active loans.</p> : activeLoans.map(loan => <LoanCard key={loan.id || loan._id} loan={loan} isActive={true} />)}
      </div>

      {/* HISTORY LIST */}
      {closedLoans.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-neutral-900">
          <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Loan History (Paid)</h2>
          {closedLoans.map(loan => <LoanCard key={loan.id || loan._id} loan={loan} isActive={false} />)}
        </div>
      )}
    </div>
  );
}