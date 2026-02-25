// src/pages/AddAsset.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  ArrowLeft, Wallet, TrendingUp, Coins, Save, Building2, Layers, Scale 
} from 'lucide-react';

export default function AddAsset() {
  const navigate = useNavigate();
  const { addAsset, isAED } = useAppStore();

  const [formData, setFormData] = useState({
    category: 'liquid',
    name: '',
    institution: '',
    currency: isAED ? 'AED' : 'INR',
    // Unit-based fields
    quantity: '', // For stocks/market
    currentPrice: '', // For stocks/market
    grams: '', // For Commodities
    totalValue: '', // Manual entry for Liquid
    notes: ''
  });

  // Dynamic Calculation Logic
  const displayValue = useMemo(() => {
    if (formData.category === 'market') {
      const val = (Number(formData.quantity) || 0) * (Number(formData.currentPrice) || 0);
      return `${formData.currency} ${val.toLocaleString()}`;
    }
    if (formData.category === 'commodity') {
      return `${formData.grams || 0} Grams`;
    }
    return `${formData.currency} ${(Number(formData.totalValue) || 0).toLocaleString()}`;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For gold, we save it with 0 value initially or we can integrate a live price later
    // For now, we store the grams as the primary value
    const finalValue = formData.category === 'market' 
      ? (Number(formData.quantity) * Number(formData.currentPrice))
      : Number(formData.totalValue) || 0;

    await addAsset({
      ...formData,
      value: finalValue,
      quantity: Number(formData.quantity) || 0,
      currentPrice: Number(formData.currentPrice) || 0,
      grams: Number(formData.grams) || 0,
    });
    navigate('/assets');
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-bottom-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold text-white uppercase tracking-widest">New Asset</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* DYNAMIC DISPLAY HEADER */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">
             {formData.category === 'commodity' ? 'Total Weight' : 'Estimated Value'}
           </p>
           <div className="text-4xl font-black text-white tracking-tighter">
             {displayValue}
           </div>
        </div>

        {/* CATEGORY SELECTOR */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'liquid', name: 'Liquid', icon: Wallet },
            { id: 'market', name: 'Market', icon: TrendingUp },
            { id: 'commodity', name: 'Gold/Silver', icon: Coins }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFormData({...formData, category: cat.id})}
              className={`flex flex-col items-center py-4 rounded-2xl border transition-all ${
                formData.category === cat.id ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
            >
              <cat.icon size={20} className="mb-2" />
              <span className="text-[10px] font-black uppercase tracking-tighter">{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* NAME FIELD */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Asset Name</label>
            <input 
              type="text" required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder={formData.category === 'commodity' ? "e.g., 24K Gold Bar, Jewelry" : "e.g., Apple Stocks, Bank Balance"}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500/30"
            />
          </div>

          {/* DYNAMIC FIELDS BASED ON CATEGORY */}
          
          {/* 1. MARKET MODE */}
          {formData.category === 'market' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1 flex items-center gap-1"><Layers size={10}/> Quantity</label>
                <input 
                  type="number" required
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="Units"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Current Price</label>
                <input 
                  type="number" required
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({...formData, currentPrice: e.target.value})}
                  placeholder="Per Unit"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none"
                />
              </div>
            </div>
          )}

          {/* 2. COMMODITY MODE (Pure Weight) */}
          {formData.category === 'commodity' && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1 flex items-center gap-1">
                <Scale size={14} className="text-amber-500" /> Total Weight (Grams)
              </label>
              <input 
                type="number" step="0.01" required
                value={formData.grams}
                onChange={(e) => setFormData({...formData, grams: e.target.value})}
                placeholder="0.00g"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-2xl font-bold text-white outline-none focus:border-amber-500/30"
              />
              <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest mt-1 ml-1">Value will be tracked by weight</p>
            </div>
          )}

          {/* 3. LIQUID MODE (Simple Value) */}
          {formData.category === 'liquid' && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Total Balance</label>
              <input 
                type="number" required
                value={formData.totalValue}
                onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
                placeholder="Current Balance"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none"
              />
            </div>
          )}

          {/* SHARED: INSTITUTION & CURRENCY */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Institution</label>
              <input 
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({...formData, institution: e.target.value})}
                placeholder="HDFC, Zerodha, etc."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Currency</label>
              <select 
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none appearance-none font-bold"
              >
                <option value="AED">AED</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-white shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
          <Save size={18} /> Record Asset
        </button>
      </form>
    </div>
  );
}