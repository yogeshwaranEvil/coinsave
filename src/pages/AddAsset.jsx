// src/pages/AddAsset.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  ArrowLeft, Wallet, TrendingUp, Coins, Save, Scale 
} from 'lucide-react';

export default function AddAsset() {
  const navigate = useNavigate();
  const { addAsset, isAED } = useAppStore();

  const [formData, setFormData] = useState({
    category: 'liquid',
    name: '',
    currency: isAED ? 'AED' : 'INR',
    // Market fields
    quantity: '',
    currentPrice: '',
    // Commodity specific fields
    metalType: 'gold', 
    purity: '24K',     
    grams: '',
    // Liquid field
    totalValue: '',
    notes: ''
  });

  const purityOptions = {
    gold: ['24K', '22K', '21K', '18K'],
    silver: ['999', '925']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">New Asset</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* CATEGORY SELECTOR */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'liquid', name: 'Liquid', icon: Wallet },
            { id: 'market', name: 'Market', icon: TrendingUp },
            { id: 'commodity', name: 'Metal', icon: Coins }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFormData({...formData, category: cat.id})}
              className={`flex flex-col items-center py-4 rounded-3xl border transition-all duration-300 ${
                formData.category === cat.id 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
            >
              <cat.icon size={20} className="mb-2" />
              <span className="text-[9px] font-black uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* NAME FIELD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Asset Name</label>
            <input 
              type="text" required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Gold Chain, SBI Savings"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-700 font-bold"
            />
          </div>

          {/* DYNAMIC METAL SECTION */}
          {formData.category === 'commodity' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              
              {/* METAL TYPE TOGGLE */}
              <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, metalType: 'gold', purity: '24K'})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.metalType === 'gold' ? 'bg-amber-500 text-neutral-950 shadow-lg' : 'text-neutral-500'}`}
                >
                  Gold
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, metalType: 'silver', purity: '999'})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.metalType === 'silver' ? 'bg-neutral-200 text-neutral-950 shadow-lg' : 'text-neutral-500'}`}
                >
                  Silver
                </button>
              </div>

              {/* PURITY TOGGLE BUTTONS (The "Touch" or "Carat" Buttons) */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">
                  {formData.metalType === 'gold' ? 'Carat Value' : 'Touch / Purity'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {purityOptions[formData.metalType].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({...formData, purity: opt})}
                      className={`py-3 rounded-xl text-[10px] font-black border transition-all ${
                        formData.purity === opt 
                        ? 'bg-neutral-100 border-white text-neutral-950 shadow-md' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* GRAMS INPUT */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Weight (Grams)</label>
                <div className="relative">
                  <Scale className="absolute left-5 top-5 text-neutral-600" size={18} />
                  <input 
                    type="number" step="0.01" required
                    value={formData.grams}
                    onChange={(e) => setFormData({...formData, grams: e.target.value})}
                    placeholder="0.00"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-5 pl-14 pr-5 text-white outline-none font-bold text-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MARKET SECTION */}
          {formData.category === 'market' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Quantity</label>
                <input 
                  type="number" required
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white outline-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Avg Price</label>
                <input 
                  type="number" required
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({...formData, currentPrice: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white outline-none font-bold"
                />
              </div>
            </div>
          )}

          {/* LIQUID SECTION */}
          {formData.category === 'liquid' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Balance</label>
              <input 
                type="number" required
                value={formData.totalValue}
                onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white outline-none font-bold text-lg"
              />
            </div>
          )}

          {/* CURRENCY (Only for Non-Metals) */}
          {formData.category !== 'commodity' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Base Currency</label>
              <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, currency: 'AED'})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${formData.currency === 'AED' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500'}`}
                >
                  AED
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, currency: 'INR'})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${formData.currency === 'INR' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500'}`}
                >
                  INR
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <button 
          type="submit" 
          className="w-full bg-indigo-600 py-5 rounded-[2rem] font-black text-white shadow-xl shadow-indigo-950/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px]"
        >
          <Save size={18} /> Record Wealth Entry
        </button>
      </form>
    </div>
  );
}