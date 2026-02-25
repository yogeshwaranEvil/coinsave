// src/pages/Dashboard.jsx
import { useEffect, useMemo } from 'react';
import { 
  ArrowDownRight, ArrowUpRight, Send, Zap, 
  Landmark, Plus, Minus, CalendarClock, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const { 
    isAED, 
    toggleCurrency, 
    fxRate, 
    fetchLiveFxRate, 
    transactions, 
    fetchTransactions,
    upcomingBills,
    fetchUpcoming,
    markUpcomingAsPaid
  } = useAppStore();

  useEffect(() => {
    fetchLiveFxRate();
    fetchTransactions();
    fetchUpcoming(); // Load scheduled bills on mount
  }, [fetchLiveFxRate, fetchTransactions, fetchUpcoming]);

  // Calculations for Cash Flow
  const { monthlyIncome, monthlyExpense, netSavings, savingsRate, totalNetWorth } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let incomeAED = 0;
    let expenseAED = 0;
    let netWorthAED = 0;

    transactions.forEach(tx => {
      const safeFxRate = fxRate > 0 ? fxRate : 22.85; 
      const amountInAED = tx.currency === 'INR' ? Number(tx.amount) / safeFxRate : Number(tx.amount);
      
      if (tx.type === 'income') netWorthAED += amountInAED;
      if (tx.type === 'expense') netWorthAED -= amountInAED;

      const txDate = new Date(tx.date);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        if (tx.type === 'income') incomeAED += amountInAED;
        if (tx.type === 'expense') expenseAED += amountInAED;
      }
    });

    const net = incomeAED - expenseAED;
    const rate = incomeAED > 0 ? ((net / incomeAED) * 100).toFixed(1) : 0;

    return {
      monthlyIncome: incomeAED,
      monthlyExpense: expenseAED,
      netSavings: net,
      savingsRate: rate,
      totalNetWorth: netWorthAED
    };
  }, [transactions, fxRate]);

  return (
    <div className="px-5 pt-8 pb-6 space-y-8 animate-in fade-in duration-300 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* TOP: Net Worth & Currency Toggle */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Total Net Worth</h1>
          <div className="text-4xl font-bold tracking-tight mt-1 text-white">
            {formatMoney(totalNetWorth, isAED, fxRate, 'AED')}
          </div>
        </div>
        
        <button 
          onClick={toggleCurrency}
          className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-full text-xs font-bold text-neutral-200 shadow-sm active:scale-95 transition-all flex items-center gap-2"
        >
          {isAED ? 'AED' : 'INR'} <Zap size={12} className="text-yellow-500" />
        </button>
      </div>

      {/* QUICK FX WIDGET */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex justify-between items-center text-xs">
        <span className="text-neutral-400">Live Exchange Rate</span>
        <span className="text-emerald-400 font-mono font-bold">
          1 AED = ₹{fxRate ? fxRate.toFixed(2) : '...'}
        </span>
      </div>

      {/* UPCOMING BILLS SECTION - NEW */}
      {upcomingBills.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Upcoming Bills</h2>
            <button onClick={() => navigate('/upcoming-bills')} className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">View All</button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {upcomingBills.map((bill) => (
              <div 
                key={bill.id} 
                className="min-w-[240px] bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                    <CalendarClock size={20} />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      {formatMoney(bill.amount, bill.currency === 'AED', fxRate, bill.currency)}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-medium mt-1">
                      Due: {new Date(bill.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-neutral-300 truncate max-w-[120px]">{bill.category}</span>
                  <button 
                    onClick={() => markUpcomingAsPaid(bill)}
                    className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95"
                  >
                    <CheckCircle2 size={12} /> Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MONTHLY CASH FLOW */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">This Month</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <ArrowDownRight size={16} />
              <span className="text-xs font-semibold">Income</span>
            </div>
            <div className="text-lg font-bold">{formatMoney(monthlyIncome, isAED, fxRate, 'AED')}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-rose-400 mb-2">
              <ArrowUpRight size={16} />
              <span className="text-xs font-semibold">Expenses</span>
            </div>
            <div className="text-lg font-bold">{formatMoney(monthlyExpense, isAED, fxRate, 'AED')}</div>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-emerald-400 font-semibold mb-1">Net Savings</div>
            <div className="text-xl font-bold text-emerald-300">{formatMoney(netSavings, isAED, fxRate, 'AED')}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-emerald-500 font-medium">Savings Rate</div>
            <div className="text-sm font-bold text-emerald-400">{savingsRate}%</div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Actions</h2>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => navigate('/add-expense')} className="flex flex-col items-center space-y-2 group">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-rose-400 group-active:scale-95 transition-all">
              <Minus size={22} />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium text-center leading-tight">Add<br/>Expense</span>
          </button>

          <button onClick={() => navigate('/add-income')} className="flex flex-col items-center space-y-2 group">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-emerald-400 group-active:scale-95 transition-all">
              <Plus size={22} />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium text-center leading-tight">Add<br/>Income</span>
          </button>

          <button onClick={() => navigate('/add-upcoming')} className="flex flex-col items-center space-y-2 group">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-indigo-400 group-active:scale-95 transition-all">
              <CalendarClock size={20} />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium text-center leading-tight">Schedule<br/>Bill</span>
          </button>

          <button onClick={() => navigate('/add-remittance')} className="flex flex-col items-center space-y-2 group">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-indigo-400 group-active:scale-95 transition-all">
              <Send size={20} className="ml-1" />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium text-center leading-tight">Send<br/>Remit</span>
          </button>
        </div>
      </div>
    </div>
  );
}