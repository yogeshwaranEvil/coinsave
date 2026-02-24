// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Plus, Send, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';
import { formatMoney } from '../utils/helpers';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAED, toggleCurrency, fxRate } = useAppStore();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.getTransactions().then(setTransactions).catch(console.error);
  }, []);

  // Calculate this month's totals
  const totals = transactions.reduce((acc, tx) => {
    // Standardize everything to AED for the math payload
    const amountInAED = tx.currency === 'AED' ? tx.amount : tx.amount / fxRate;
    if (tx.type === 'income') acc.income += amountInAED;
    if (tx.type === 'expense') acc.expense += amountInAED;
    return acc;
  }, { income: 0, expense: 0 });

  return (
    <div className="px-5 pt-8 pb-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Global Toggle */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Cash Flow Balance</h1>
          <div className="text-4xl font-bold tracking-tight mt-1">
            {formatMoney(totals.income - totals.expense, isAED, fxRate, 'AED')}
          </div>
        </div>
        
        <button 
          onClick={toggleCurrency}
          className="bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-300 shadow-sm active:scale-95 transition-all"
        >
          {isAED ? 'AED' : 'INR'} ⇄
        </button>
      </div>

      {/* Live FX Ticker */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex justify-between items-center text-xs">
        <div className="flex items-center space-x-2 text-neutral-300">
          <Zap size={14} className="text-yellow-500" />
          <span>Live Rate: 1 AED = {fxRate} INR</span>
        </div>
      </div>

      {/* Income & Expense Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <ArrowDownRight size={16} />
            <span className="text-xs font-semibold">In</span>
          </div>
          <div className="text-lg font-bold">{formatMoney(totals.income, isAED, fxRate, 'AED')}</div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-rose-400 mb-2">
            <ArrowUpRight size={16} />
            <span className="text-xs font-semibold">Out</span>
          </div>
          <div className="text-lg font-bold">{formatMoney(totals.expense, isAED, fxRate, 'AED')}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex space-x-6">
          <button onClick={() => navigate('/transactions')} className="flex flex-col items-center space-y-2 group">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-rose-400 group-active:scale-95 transition-all">
              <Plus size={24} />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">Add Log</span>
          </button>

          <button onClick={() => navigate('/remittance')} className="flex flex-col items-center space-y-2 group">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-indigo-400 group-active:scale-95 transition-all">
              <Send size={24} />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">Remit</span>
          </button>
        </div>
      </div>
    </div>
  );
}