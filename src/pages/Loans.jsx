// src/pages/Loans.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Calendar, ArrowRight, Plus, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';

export default function Loans() {
  const navigate = useNavigate();
  const { isAED, fxRate } = useAppStore();
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    // Fetch all wealth items and filter only the liabilities (loans)
    api.getWealth()
      .then(items => setLoans(items.filter(i => i.class_type === 'liability')))
      .catch(console.error);
  }, []);

  // Calculate Total Outstanding Debt in AED
  const totalDebtAED = loans.reduce((total, loan) => {
    if (loan.unit === 'AED') return total + loan.balance_or_quantity;
    if (loan.unit === 'INR') return total + (loan.balance_or_quantity / fxRate);
    return total;
  }, 0);

  return (
    <div className="p-5 space-y-6 animate-in fade-in duration-300 pb-24">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Landmark className="text-yellow-500" /> Active Loans
        </h1>
        <button 
          onClick={() => navigate('/wealth')} // Quick link to the wealth/assets form to add a loan
          className="bg-neutral-900 border border-neutral-800 p-2 rounded-full text-yellow-500 hover:bg-neutral-800 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* TOTAL DEBT DASHBOARD */}
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mb-1">Total Outstanding Debt</div>
          <div className="text-3xl font-bold text-rose-500">
            {formatMoney(totalDebtAED, isAED, fxRate, 'AED')}
          </div>
        </div>
        
        {/* Upcoming EMI Alert (Mock data for UI) */}
        <div className="mt-4 bg-neutral-950/50 rounded-xl p-3 flex items-center justify-between border border-rose-500/10 relative z-10">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-rose-400" />
            <span className="text-xs text-neutral-300">Next EMI Due</span>
          </div>
          <span className="text-xs font-bold text-white">5th Mar</span>
        </div>
      </div>

      {/* LOAN LIST */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Loan Details</h2>
        
        {loans.length === 0 ? (
          <div className="text-center text-neutral-500 py-10 text-sm">You are completely debt-free! 🎉</div>
        ) : (
          loans.map(loan => (
            <div 
              key={loan._id} 
              // Navigate to a placeholder loan detail screen if you decide to build it later
              onClick={() => navigate(`/loan/${loan._id}`)} 
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-neutral-950 p-2 rounded-full border border-neutral-800">
                    <Landmark size={18} className="text-rose-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-200">{loan.name}</div>
                    <div className="text-[10px] text-neutral-500 uppercase">{loan.category.replace('_', ' ')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Remaining</div>
                  <div className="font-bold text-rose-400">
                    {formatMoney(loan.balance_or_quantity, isAED, fxRate, loan.unit)}
                  </div>
                </div>
              </div>

              {/* Progress Bar (Visual flair) */}
              <div className="w-full bg-neutral-950 rounded-full h-1.5 mb-1">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex justify-between text-[9px] text-neutral-500">
                <span>Paid: 25%</span>
                <span>Debt-Free: 2028</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}