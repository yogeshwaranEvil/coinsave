// src/pages/AddAsset.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  ArrowLeft, 
  Wallet, 
  TrendingUp, 
  Coins, 
  Save, 
  Building2 
} from 'lucide-react';

export default function AddAsset() {
  const navigate = useNavigate();
  const { addAsset, isAED } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    value: '',
    category: 'liquid', // Default to Cash & Bank
    currency: isAED ? 'AED' : 'INR',
    institution: '', // e.g., HDFC, Emirates NBD, Zerodha
    notes: ''
  });

  const categories = [
    { id: 'liquid', name: 'Cash & Bank', icon: Wallet, color: 'text-emerald-400' },
    { id: 'market', name: 'Market Investments', icon: TrendingUp, color: 'text-indigo-400' },
    { id: 'commodity', name: 'Gold & Silver', icon: Coins, color: 'text-amber-400' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAsset({
      ...formData,
      value: Number(formData.value),
    });
    navigate('/assets');
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-bottom-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400 active:scale-90 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold text-white uppercase tracking-widest">Add Asset</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* VALUE INPUT */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col items-center shadow-xl">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Current Valuation</p>
          <div className="flex items-baseline gap-2">
            <span className="text-neutral-600 font-bold text-xl">{formData.currency}</span>
            <input 
              type="number" 
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              className="bg-transparent text-5xl font-bold text-white text-center w-full outline-none placeholder:text-neutral-800"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* CATEGORY SELECTOR */}
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFormData({...formData, category: cat.id})}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                formData.category === cat.id 
                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
            >
              <cat.icon size={20} className="mb-2" />
              <span className="text-[9px] font-bold uppercase text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* DETAILS SECTION */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1 tracking-wider">Asset Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Savings Account, Apple Stocks"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500/30 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Institution</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-4 text-neutral-600" size={16} />
                <input 
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  placeholder="HDFC, NBD, etc."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/30"
                />
              </div>
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

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1 tracking-wider">Additional Notes</label>
            <textarea 
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Optional details..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none resize-none focus:border-indigo-500/30"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold text-white shadow-lg shadow-indigo-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} /> Record Asset
        </button>
      </form>
    </div>
  );
}