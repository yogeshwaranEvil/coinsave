// src/pages/Dashboard.jsx
import { useEffect, useMemo } from 'react';
import { 
  ArrowDownRight, ArrowUpRight, Send, Zap, 
  Landmark, Plus, Minus, CalendarClock, CheckCircle2,
  TrendingDown, TrendingUp, Coins
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
    metalRates,       // New
    fetchMetalRates    // New
  } = useAppStore();

  useEffect(() => {
    fetchLiveFxRate();
    fetchTransactions();
    fetchUpcoming();
    fetchLoans();
    fetchAssets();
    fetchMetalRates(); // Sync gold/silver on mount
  }, [fetchLiveFxRate, fetchTransactions, fetchUpcoming, fetchLoans, fetchAssets, fetchMetalRates]);

  // Calculations for Monthly Cash Flow
  const { monthlyIncome, monthlyExpense, netSavings, savingsRate } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let incomeAED = 0;
    let expenseAED = 0;

    transactions.forEach(tx => {
      const safeFxRate = fxRate > 0 ? fxRate : 22.85; 
      const amountInAED = tx.currency === 'INR' ? Number(tx.amount) / safeFxRate : Number(tx.amount);
      
      const txDate = new Date(tx.date);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        if (tx.type === 'income') incomeAED += amountInAED;
        if (tx.type === 'expense') expenseAED += amountInAED;
      }
    });

    const net = incomeAED - expenseAED;
    const rate = incomeAED > 0 ? ((net / incomeAED) * 100).toFixed(1) : 0;

    return { monthlyIncome: incomeAED, monthlyExpense: expenseAED, netSavings: net, savingsRate: rate };
  }, [transactions, fxRate]);

  // Global Intelligence
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

      {/* METAL RATES WIDGET */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-[32px] p-6 space-y-5 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500"><Coins size={18} /></div>
            <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Commodity Pulse</h2>
          </div>
          <button 
            onClick={fetchMetalRates}
            className="text-[10px] font-black text-indigo-400 uppercase tracking-widest active:scale-90 transition-all"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Dubai (AED) */}
          <div className="space-y-3 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-800/40">
            <p className="text-[9px] font-black text-neutral-600 uppercase tracking-tighter">🇦🇪 Dubai (AED/g)</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-400">Gold 24K</span>
              <span className="text-xs font-black text-white">{metalRates.gold_aed.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-400">Silver</span>
              <span className="text-xs font-black text-white">{metalRates.silver_aed.toFixed(2)}</span>
            </div>
          </div>

          {/* India (INR) */}
          <div className="space-y-3 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-800/40">
            <p className="text-[9px] font-black text-neutral-600 uppercase tracking-tighter">🇮🇳 India (INR/g)</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-400">Gold 24K</span>
              <span className="text-xs font-black text-white">₹{metalRates.gold_inr.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-400">Silver</span>
              <span className="text-xs font-black text-white">₹{metalRates.silver_inr.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MONTHLY STATUS CARD */}
      <div className={`relative overflow-hidden rounded-[32px] p-6 transition-all duration-700 border ${
        netSavings < 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
      }`}>
        <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full opacity-40 ${
          netSavings < 0 ? 'bg-rose-500' : 'bg-emerald-500'
        }`}></div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${
              netSavings < 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {netSavings < 0 ? 'Monthly shortfall' : 'Net Savings'}
            </p>
            <h2 className="text-3xl font-black text-white">
              {formatMoney(netSavings, isAED, fxRate, 'AED')}
            </h2>
          </div>
          <div className={`p-3 rounded-2xl ${
            netSavings < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {netSavings < 0 ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between relative z-10">
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
             netSavings < 0 ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-neutral-950'
          }`}>
            Efficiency: {savingsRate}%
          </div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight">
            {netSavings < 0 ? 'Spending exceeds income' : 'Positive Momentum'}
          </p>
        </div>
      </div>

      {/* INCOME / EXPENSE SPLIT */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-5">
          <div className="flex items-center gap-2 text-emerald-500 mb-3">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg"><ArrowDownRight size={14} /></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Inflow</span>
          </div>
          <div className="text-xl font-bold text-white">{formatMoney(monthlyIncome, isAED, fxRate, 'AED')}</div>
        </div>
        
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-5">
          <div className="flex items-center gap-2 text-rose-500 mb-3">
            <div className="p-1.5 bg-rose-500/10 rounded-lg"><ArrowUpRight size={14} /></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Outflow</span>
          </div>
          <div className="text-xl font-bold text-white">{formatMoney(monthlyExpense, isAED, fxRate, 'AED')}</div>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Expense', icon: Minus, color: 'text-rose-400', path: '/add-expense' },
          { label: 'Income', icon: Plus, color: 'text-emerald-400', path: '/add-income' },
          { label: 'Bill', icon: CalendarClock, color: 'text-indigo-400', path: '/add-upcoming' },
          { label: 'Remit', icon: Send, color: 'text-indigo-400', path: '/add-remittance' }
        ].map((action, i) => (
          <button 
            key={i}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-[24px] flex items-center justify-center transition-all group-active:scale-90 group-active:bg-neutral-800 shadow-xl">
              <action.icon size={22} className={action.color} />
            </div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight">{action.label}</span>
          </button>
        ))}
      </div>

      {/* UPCOMING OBLIGATIONS */}
      {upcomingBills.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Upcoming</h2>
            <button onClick={() => navigate('/upcoming-bills')} className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">View All</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:hidden">
            {upcomingBills.map((bill) => (
              <div key={bill.id} className="min-w-[280px] snap-center bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                    <CalendarClock size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-white">{formatMoney(bill.amount, bill.currency === 'AED', fxRate, bill.currency)}</div>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Due {new Date(bill.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <button 
                  onClick={() => markUpcomingAsPaid(bill)}
                  className="w-full bg-white text-neutral-950 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg"
                >
                  Quick Pay
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}