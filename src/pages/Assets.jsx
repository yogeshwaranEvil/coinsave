// src/pages/Assets.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { Wallet, TrendingUp, Coins, Plus, Scale, Tag, ChevronRight } from 'lucide-react';

export default function Assets() {
  const navigate = useNavigate();
  const { wealth, fetchAssets, isAED, fxRate, getGlobalNetWorth, metalRates } = useAppStore();

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const netWorth = getGlobalNetWorth();

  const categories = [
    { id: 'liquid', name: 'Cash & Bank', icon: Wallet, color: 'text-emerald-400' },
    { id: 'market', name: 'Market Investments', icon: TrendingUp, color: 'text-indigo-400' },
    { id: 'commodity', name: 'Metal / Commodities', icon: Coins, color: 'text-amber-400' }
  ];

  // Helper to calculate individual asset value for display
  const getAssetDisplayValue = (asset) => {
    if (asset.category === 'commodity') {
      const isGold = asset.metalType === 'gold';
      const baseRate = isGold ? (isAED ? metalRates.gold_aed : metalRates.gold_inr) : (isAED ? metalRates.silver_aed : metalRates.silver_inr);
      const purityFactor = isGold ? (parseInt(asset.purity) / 24) : (asset.purity === '925' ? 0.925 : 1);
      return (Number(asset.grams) || 0) * baseRate * purityFactor;
    }
    if (asset.category === 'market') {
      return (Number(asset.quantity) || 0) * (Number(asset.currentPrice) || 0);
    }
    return Number(asset.value) || 0;
  };

  return (
    <div className="p-5 space-y-6 pb-28 min-h-screen bg-neutral-950 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-black text-white uppercase tracking-widest">Global Portfolio</h1>
        <button onClick={() => navigate('/add-asset')} className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-950/40 active:scale-90 transition-all">
          <Plus size={20} />
        </button>
      </div>

      {/* TOTAL NET WORTH */}
      <div className={`border rounded-[2.5rem] p-7 relative overflow-hidden transition-colors duration-500 shadow-2xl ${netWorth < 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-neutral-900 border-neutral-800'}`}>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>
        <p className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.2em] mb-2 relative z-10">Aggregate Net Worth</p>
        <h2 className={`text-4xl font-black tracking-tighter relative z-10 ${netWorth < 0 ? 'text-rose-500' : 'text-white'}`}>
          {formatMoney(netWorth, isAED, fxRate, isAED ? 'AED' : 'INR')}
        </h2>
      </div>

      {/* CATEGORIES LIST */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const catAssets = wealth.filter(a => a.category === cat.id);
          if (catAssets.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <cat.icon size={14} className={cat.color} />
                <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{cat.name}</h3>
              </div>

              <div className="space-y-3">
                {catAssets.map(asset => {
                  const val = getAssetDisplayValue(asset);
                  
                  return (
                    <div 
                      key={asset.id} 
                      onClick={() => navigate(`/edit-asset/${asset.id || asset._id}`)}
                      className="bg-neutral-900/50 border border-neutral-800/60 rounded-3xl p-5 flex justify-between items-center group hover:border-indigo-500/30 active:bg-neutral-900 transition-all cursor-pointer shadow-lg"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{asset.name}</p>
                        
                        {/* CONDITIONAL DETAILS FOR METALS */}
                        {asset.category === 'commodity' ? (
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[10px] font-black text-amber-500/80 uppercase">
                              <Scale size={10} /> {asset.grams}g
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-black text-neutral-500 uppercase bg-neutral-800 px-2 py-0.5 rounded-md">
                              <Tag size={10} /> {asset.purity}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-tighter">
                            {asset.category === 'market' ? `${asset.quantity} Units` : 'Liquid Asset'}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-black text-white">
                            {formatMoney(val, isAED, fxRate, asset.category === 'commodity' ? (isAED ? 'AED' : 'INR') : asset.currency)}
                          </p>
                          <p className="text-[9px] text-neutral-600 font-bold uppercase mt-1">
                            Current Valuation
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-neutral-700 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}