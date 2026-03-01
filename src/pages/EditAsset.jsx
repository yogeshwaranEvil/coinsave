// src/pages/EditAsset.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Save, Trash2, Landmark, Coins, TrendingUp } from 'lucide-react';

export default function EditAsset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wealth, updateAsset, deleteAsset } = useAppStore();

  const asset = useMemo(() => wealth.find(a => String(a.id) === String(id) || String(a._id) === String(id)), [wealth, id]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'liquid', // FIXED: Default to liquid
    value: '', 
    grams: '', 
    purity: '24', 
    metalType: 'gold', 
    quantity: '', 
    currentPrice: '', 
    currency: 'AED'
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        category: asset.category || 'liquid', // FIXED: Default to liquid
        value: asset.value || asset.totalValue || '',
        grams: asset.grams || '',
        purity: asset.purity || '24',
        metalType: asset.metalType || 'gold',
        quantity: asset.quantity || '',
        currentPrice: asset.currentPrice || '',
        currency: asset.currency || 'AED'
      });
    }
  }, [asset]);

  if (!asset) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateAsset(id, formData);
    navigate(-1); 
  };

  const handleDelete = async (e) => {
    e.preventDefault(); 
    if (window.confirm(`Are you sure you want to permanently delete ${asset.name}?`)) {
      const targetId = String(asset.id || asset._id);
      await deleteAsset(targetId);
      navigate(-1, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 pb-24 animate-in slide-in-from-right duration-500">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Edit Asset</h1>
        
        <button 
          type="button" 
          onClick={handleDelete} 
          className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center active:scale-90 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        
        {/* NAME INPUT */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Asset Name</label>
          <input 
            type="text" required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white outline-none font-bold focus:border-indigo-500/50 transition-colors"
          />
        </div>

        {/* DYNAMIC FIELDS BASED ON CATEGORY */}
        {formData.category === 'commodity' && (
          <div className="grid grid-cols-2 gap-4 bg-neutral-900/40 border border-neutral-800 rounded-[2rem] p-5">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-amber-500 uppercase ml-1 tracking-widest flex items-center gap-2"><Coins size={12}/> Metal Type</label>
              <select 
                value={formData.metalType}
                onChange={(e) => setFormData({...formData, metalType: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white font-bold outline-none"
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Weight (g)</label>
              <input 
                type="number" required step="0.01"
                value={formData.grams}
                onChange={(e) => setFormData({...formData, grams: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white font-bold outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Purity (K)</label>
              <input 
                type="text" required
                value={formData.purity}
                onChange={(e) => setFormData({...formData, purity: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white font-bold outline-none"
              />
            </div>
          </div>
        )}

        {formData.category === 'market' && (
          <div className="grid grid-cols-2 gap-4 bg-neutral-900/40 border border-neutral-800 rounded-[2rem] p-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-500 uppercase ml-1 tracking-widest flex items-center gap-2"><TrendingUp size={12}/> Quantity</label>
              <input 
                type="number" required step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white font-bold outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Price / Unit</label>
              <input 
                type="number" required step="0.01"
                value={formData.currentPrice}
                onChange={(e) => setFormData({...formData, currentPrice: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white font-bold outline-none"
              />
            </div>
          </div>
        )}

        {/* FIXED: NOW LOOKS FOR 'liquid' */}
        {formData.category === 'liquid' && (
          <div className="space-y-2 bg-neutral-900/40 border border-neutral-800 rounded-[2rem] p-5">
            <label className="text-[10px] font-black text-indigo-400 uppercase ml-1 tracking-widest flex items-center gap-2"><Landmark size={12}/> Total Value</label>
            <input 
              type="number" required step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white font-bold outline-none"
            />
          </div>
        )}

        {/* SUBMIT */}
        <button 
          type="submit" 
          className="w-full bg-white py-5 rounded-[2rem] font-black text-neutral-950 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] mt-8"
        >
          <Save size={18} /> Update Asset
        </button>
      </form>
    </div>
  );
}