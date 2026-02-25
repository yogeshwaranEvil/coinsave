// src/pages/Assets.jsx
import { useEffect, useState } from 'react';
import { Coins, Landmark, Plus, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';

export default function Assets() {
  const { isAED, fxRate } = useAppStore();
  const [assets, setAssets] = useState([]);
  
  // For the MVP UI, we will hardcode the live gold price. 
  // Later, the Python backend will pass this dynamically.
  const goldPriceAEDPerGram = 275.50; 

  useEffect(() => {
    // Fetch all wealth items and filter only the assets
    api.getWealth()
      .then(items => setAssets(items.filter(i => i.class_type === 'asset')))
      .catch(console.error);
  }, []);

  // Calculate total value of all assets in AED
  const totalAssetsAED = assets.reduce((total, asset) => {
    if (asset.unit === 'AED') return total + asset.balance_or_quantity;
    if (asset.unit === 'INR') return total + (asset.balance_or_quantity / fxRate);
    if (asset.unit === 'grams' && asset.category === 'gold') return total + (asset.balance_or_quantity * goldPriceAEDPerGram);
    return total;
  }, 0);

  return (
    <div className="p-5 space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Coins className="text-yellow-500" /> Asset Portfolio
        </h1>
        <button className="bg-neutral-900 border border-neutral-800 p-2 rounded-full text-emerald-400 hover:bg-neutral-800 transition-colors">
          <Plus size={20} />
        </button>
      </div>

      {/* TOTAL ASSETS SNAPSHOT */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
        <TrendingUp className="absolute -right-4 -bottom-4 text-emerald-500/10" size={100} />
        <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1 z-10">Total Asset Value</span>
        <span className="text-3xl font-bold text-emerald-400 z-10">
          {formatMoney(totalAssetsAED, isAED, fxRate, 'AED')}
        </span>
      </div>

      {/* ASSET LIST */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Your Holdings</h2>
        
        {assets.length === 0 ? (
          <div className="text-center text-neutral-500 py-10 text-sm">
            No assets tracked yet. Click the + to add your first bank account or gold asset.
          </div>
        ) : (
          <div className="space-y-3">
            {assets.map(asset => {
              // Calculate individual display value
              let displayValue = asset.balance_or_quantity;
              let isGrams = asset.unit === 'grams';
              let evaluatedAED = 0;

              if (isGrams && asset.category === 'gold') {
                evaluatedAED = asset.balance_or_quantity * goldPriceAEDPerGram;
              }

              return (
                <div key={asset._id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-neutral-950 p-2 rounded-full border border-neutral-800">
                      {asset.category === 'gold' || asset.category === 'silver' ? (
                        <Coins size={18} className="text-yellow-500" />
                      ) : (
                        <Landmark size={18} className="text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-200">{asset.name}</div>
                      <div className="text-[10px] text-neutral-500 uppercase">
                        {isGrams ? `${asset.balance_or_quantity} Grams` : asset.unit}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-white">
                      {isGrams 
                        ? formatMoney(evaluatedAED, isAED, fxRate, 'AED')
                        : formatMoney(displayValue, isAED, fxRate, asset.unit)}
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
