// src/pages/Assets.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { Wallet, TrendingUp, Coins, Plus, ChevronRight, PieChart } from 'lucide-react';

export default function Assets() {
  const navigate = useNavigate();
  const { wealth, fetchAssets, isAED, fxRate, getGlobalNetWorth } = useAppStore();

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const netWorth = getGlobalNetWorth();

  // Helper to group assets by category
  const categories = [
    { id: 'liquid', name: 'Cash & Bank', icon: Wallet, color: 'text-emerald-400' },
    { id: 'market', name: 'Market Investments', icon: TrendingUp, color: 'text-indigo-400' },
    { id: 'commodity', name: 'Gold & Silver', icon: Coins, color: 'text-amber-400' }
  ];

  return (
    <div className="p-5 space-y-6 pb-28 min-h-screen bg-neutral-950">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio</h1>
        <button onClick={() => navigate('/add-asset')} className="bg-indigo-600 p-2.5 rounded-full text-white shadow-lg">
          <Plus size={20} />
        </button>
      </div>

      {/* NET WORTH DISPLAY */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest mb-1">Total Net Worth</p>
        <h2 className={`text-4xl font-black tracking-tighter ${netWorth >= 0 ? 'text-white' : 'text-rose-500'}`}>
          {formatMoney(netWorth, isAED, fxRate, 'AED')}
        </h2>
      </div>

      {/* CATEGORIES LIST */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catAssets = wealth.filter(a => a.category === cat.id);
          const totalVal = catAssets.reduce((acc, a) => acc + (a.currency === 'INR' ? a.value / fxRate : a.value), 0);

          return (
            <div key={cat.id} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-neutral-800 ${cat.color}`}><cat.icon size={18} /></div>
                  <span className="text-sm font-bold text-white">{cat.name}</span>
                </div>
                <span className="text-xs font-bold text-neutral-400">
                  {formatMoney(totalVal, isAED, fxRate, 'AED')}
                </span>
              </div>

              {/* Individual Asset Rows */}
              <div className="space-y-2">
                {catAssets.map(asset => (
                  <div key={asset.id} className="flex justify-between items-center bg-neutral-900 p-3 rounded-xl border border-neutral-800/50">
                    <div>
                      <p className="text-xs font-bold text-neutral-200">{asset.name}</p>
                      <p className="text-[9px] text-neutral-500 uppercase">{asset.institution || 'Personal'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">
                        {formatMoney(asset.value, asset.currency === 'AED', fxRate, asset.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}