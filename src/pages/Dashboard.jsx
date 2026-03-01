// src/pages/Dashboard.jsx
import { useEffect, useMemo } from 'react';
import { 
  ArrowDownRight, ArrowUpRight, Send, Zap, 
  Plus, Minus, CalendarClock,
  TrendingDown, TrendingUp, Coins, CreditCard, AlertCircle, CheckCircle2
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
    markUpcomingAsPaid,
    getGlobalNetWorth,
    fetchLoans,
    fetchAssets,
    metalRates,
    fetchMetalRates,
    cards,
    fetchCards
  } = useAppStore();

  useEffect(() => {
    fetchLiveFxRate();
    fetchTransactions();
    fetchUpcoming();
    fetchLoans();
    fetchAssets();
    fetchMetalRates();
    fetchCards();
  }, [fetchLiveFxRate, fetchTransactions, fetchUpcoming, fetchLoans, fetchAssets, fetchMetalRates, fetchCards]);

  const { monthlyIncome, monthlyExpense, creditSpending, netSavings, savingsRate } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let incomeAED = 0;
    let cashExpenseAED = 0; 
    let creditSpendAED = 0; 

    transactions.forEach(tx => {
      if (tx.category === 'Card Repayment' || tx.isInternalTransfer) return;

      const safeFxRate = fxRate > 0 ? fxRate : 22.85; 
      const amountInAED = tx.currency === 'INR' ? Number(tx.amount) / safeFxRate : Number(tx.amount);
      
      const txDate = new Date(tx.date);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        if (tx.type === 'income') {
          incomeAED += amountInAED;
        } else if (tx.type === 'expense') {
          if (tx.paymentMethod === 'credit_card') {
            creditSpendAED += amountInAED;
          } else {
            cashExpenseAED += amountInAED;
          }
        }
      }
    });

    const net = incomeAED - cashExpenseAED;
    const rate = incomeAED > 0 ? ((net / incomeAED) * 100).toFixed(1) : 0;

    return { 
      monthlyIncome: incomeAED, 
      monthlyExpense: cashExpenseAED, 
      creditSpending: creditSpendAED, 
      netSavings: net, 
      savingsRate: rate 
    };
  }, [transactions, fxRate]);

  // --- CREDIT SUMMARY MATH ---
  const creditSummary = useMemo(() => {
    const safeFx = fxRate || 22.85;
    const totalOutstandingAED = transactions
      .filter(tx => tx.paymentMethod === 'credit_card')
      .reduce((acc, tx) => {
        const amt = tx.currency === 'INR' ? Number(tx.amount) / safeFx : Number(tx.amount);
        return tx.type === 'expense' ? acc + amt : acc - amt;
      }, 0);

    const nextDue = cards.length > 0 ? Math.min(...cards.map(c => parseInt(c.dueDate))) : null;

    return { totalOutstandingAED, nextDue };
  }, [transactions, cards, fxRate]);

  const totalNetWorth = getGlobalNetWorth();
  const isNegativeWorth = totalNetWorth < 0;

  return (
    <div className="px-5 pt-8 pb-6 space-y-8 animate-in fade-in duration-500 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* TOP: Net Worth & Currency Toggle */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em]">Global Net Worth</h1>
          <div className={`text-4xl font-black tracking-tighter transition-colors duration-500 ${isNegativeWorth ? 'text-rose-500' : 'text-white'}`}>
            {formatMoney(totalNetWorth, isAED, fxRate, 'AED')}
          </div>
          {isNegativeWorth && (
            <div className="flex items-center gap-1.5 text-rose-500/80 animate-pulse">
              <TrendingDown size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">Deficit Warning</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={toggleCurrency}
          className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl shadow-lg active:scale-90 transition-all"
        >
          <Zap size={16} className={isAED ? "text-yellow-500" : "text-indigo-400"} />
        </button>
      </div>

      {/* QUICK FX WIDGET */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 flex justify-between items-center text-[10px] font-bold tracking-[0.1em]">
        <span className="text-neutral-500 uppercase">Live Pulse</span>
        <span className="text-emerald-500 font-mono text-xs">1 AED = ₹{fxRate ? fxRate.toFixed(2) : '...'}</span>
      </div>

      {/* CREDIT PULSE WIDGET */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-[32px] p-6 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5"><CreditCard size={80} /></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500"><AlertCircle size={18} /></div>
            <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Credit Debt Pulse</h2>
          </div>
          <button onClick={() => navigate('/manage-cards')} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Manage All</button>
        </div>

        <div className="flex justify-between items-end relative z-10">
          <div>
            <p className="text-[9px] font-bold text-neutral-500 uppercase mb-1">Total Outstanding</p>
            <h3 className="text-2xl font-black text-white">
              {formatMoney(creditSummary.totalOutstandingAED, isAED, fxRate, 'AED')}
            </h3>
          </div>
          {creditSummary.nextDue && (
            <div className="text-right">
              <p className="text-[9px] font-bold text-rose-500 uppercase mb-1 tracking-tighter">Next Due: {creditSummary.nextDue}th</p>
              <div className="h-1 w-20 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-2/3"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* METAL RATES WIDGET */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-[32px] p-6 space-y-5 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500"><Coins size={18} /></div>
            <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Commodity Pulse</h2>
          </div>
          <button onClick={fetchMetalRates} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest active:scale-90 transition-all">Refresh</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-800/40">
            <p className="text-[9px] font-black text-neutral-600 uppercase tracking-tighter">🇦🇪 Dubai (AED/g)</p>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400 font-bold">Gold 24K</span>
              <span className="font-black text-white">{metalRates?.gold_aed?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          <div className="space-y-3 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-800/40">
            <p className="text-[9px] font-black text-neutral-600 uppercase tracking-tighter">🇮🇳 India (INR/g)</p>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400 font-bold">Gold 24K</span>
              <span className="font-black text-white">₹{metalRates?.gold_inr?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MONTHLY STATUS CARD */}
      <div className={`relative overflow-hidden rounded-[32px] p-6 transition-all duration-700 border ${
        netSavings < 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
      }`}>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${netSavings < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {netSavings < 0 ? 'Monthly shortfall' : 'Net Savings'}
            </p>
            <h2 className="text-3xl font-black text-white">{formatMoney(netSavings, isAED, fxRate, 'AED')}</h2>
          </div>
          <div className={`p-3 rounded-2xl ${netSavings < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {netSavings < 0 ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between relative z-10">
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${netSavings < 0 ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-neutral-950'}`}>
            Efficiency: {savingsRate}%
          </div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight">
            {netSavings < 0 ? 'Overspending Detected' : 'Healthy Cash Flow'}
          </p>
        </div>
      </div>

      {/* INCOME / EXPENSE SPLIT */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-5">
          <div className="flex items-center gap-2 text-emerald-500 mb-3 text-[10px] font-black uppercase tracking-widest">
            <ArrowDownRight size={14} /> Cash In
          </div>
          <div className="text-xl font-bold text-white">{formatMoney(monthlyIncome, isAED, fxRate, 'AED')}</div>
        </div>
        
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-rose-500 mb-3 text-[10px] font-black uppercase tracking-widest">
            <ArrowUpRight size={14} /> Cash Out
          </div>
          <div className="text-xl font-bold text-white">{formatMoney(monthlyExpense, isAED, fxRate, 'AED')}</div>
          {creditSpending > 0 && (
            <p className="text-[8px] text-amber-500 font-black uppercase mt-2 tracking-tighter">
              + {formatMoney(creditSpending, isAED, fxRate, 'AED')} on Credit
            </p>
          )}
        </div>
      </div>

      {/* --- RESTORED: UPCOMING BILLS WIDGET --- */}
      {upcomingBills && upcomingBills.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <CalendarClock size={12} /> Upcoming Bills
            </h2>
          </div>
          
          <div className="space-y-3">
            {upcomingBills.slice(0, 3).map(bill => {
              const billDate = new Date(bill.date);
              const isLate = billDate < new Date() && !bill.isPaid;
              
              return (
                <div key={bill.id || bill._id} className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${isLate ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      <CalendarClock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{bill.category}</p>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5 tracking-tighter line-clamp-1">
                        {billDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {bill.notes || 'Scheduled'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">
                      {formatMoney(bill.amount, bill.currency === 'AED' ? isAED : !isAED, fxRate, bill.currency)}
                    </p>
                    <button 
                      onClick={() => {
                        if(window.confirm(`Process payment for ${bill.category}?`)) {
                          markUpcomingAsPaid(bill);
                        }
                      }}
                      className="mt-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1 ml-auto hover:text-emerald-300 active:scale-95 transition-all"
                    >
                      <CheckCircle2 size={12} /> Mark Paid
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK ACTIONS GRID */}
      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-4 gap-y-6 gap-x-4 pb-2">
        {[
          { label: 'Expense', icon: Minus, color: 'text-rose-400', path: '/add-expense' },
          { label: 'Income', icon: Plus, color: 'text-emerald-400', path: '/add-income' },
          { label: 'Cards', icon: CreditCard, color: 'text-amber-400', path: '/manage-cards' },
          { label: 'Remit', icon: Send, color: 'text-indigo-400', path: '/add-remittance' },
          { label: 'Bills', icon: CalendarClock, color: 'text-sky-400', path: '/upcoming-bills' },
          { label: 'Wealth', icon: Coins, color: 'text-amber-400', path: '/assets' }
        ].map((action, i) => (
          <button key={i} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center transition-all group-active:scale-90 group-active:bg-neutral-800 shadow-xl">
              <action.icon size={22} className={action.color} />
            </div>
            <span className="text-[9px] font-black text-neutral-500 uppercase tracking-tighter text-center leading-none">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}