// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Send, Zap, Landmark, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';
import { formatMoney } from '../utils/helpers';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAED, toggleCurrency, fxRate } = useAppStore();
  
  // We will wire these up to the backend calculations shortly
  const [metrics, setMetrics] = useState({
    netWorth: 142500,
    monthlyIncome: 25000,
    monthlyExpense: 8450,
  });

  const netSavings = metrics.monthlyIncome - metrics.monthlyExpense;
  const savingsRate = ((netSavings / metrics.monthlyIncome) * 100).toFixed(1);

  return (
    <div className="px-5 pt-8 pb-6 space-y-8 animate-in fade-in duration-300">
      
      {/* TOP: Net Worth & Currency Toggle */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Total Net Worth</h1>
          <div className="text-4xl font-bold tracking-tight mt-1 text-white">
            {formatMoney(metrics.netWorth, isAED, fxRate, 'AED')}
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
        <span className="text-emerald-400 font-mono font-bold">1 AED = {fxRate} INR</span>
      </div>

      {/* MONTHLY CASH FLOW (Income, Expense, Savings) */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">This Month</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <ArrowDownRight size={16} />
              <span className="text-xs font-semibold">Income</span>
            </div>
            <div className="text-lg font-bold">{formatMoney(metrics.monthlyIncome, isAED, fxRate, 'AED')}</div>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-rose-400 mb-2">
              <ArrowUpRight size={16} />
              <span className="text-xs font-semibold">Expenses</span>
            </div>
            <div className="text-lg font-bold">{formatMoney(metrics.monthlyExpense, isAED, fxRate, 'AED')}</div>
          </div>
        </div>

        {/* Net Savings Bar */}
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

      {/* QUICK ACTIONS (Per Spec) */}
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

          <button onClick={() => navigate('/add-remittance')} className="flex flex-col items-center space-y-2 group">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-indigo-400 group-active:scale-95 transition-all">
              <Send size={20} className="ml-1" />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium text-center leading-tight">Send<br/>Remit</span>
          </button>

          <button onClick={() => navigate('/loans')} className="flex flex-col items-center space-y-2 group">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-yellow-500 group-active:scale-95 transition-all">
              <Landmark size={20} />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium text-center leading-tight">Pay<br/>EMI</span>
          </button>

        </div>
      </div>

    </div>
  );
}