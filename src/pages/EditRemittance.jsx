// src/pages/EditRemittance.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Save, Loader2, Landmark, AlertCircle } from 'lucide-react';

export default function EditRemittance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { remittances, updateRemittance, fetchRemittances } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    aed_sent: '',
    transfer_fee_aed: '',
    exchange_rate_secured: '',
    destination_account: '',
    date: ''
  });

  // 1. Load data from storage if store is empty
  useEffect(() => {
    const init = async () => {
      try {
        await fetchRemittances(); // Always refresh data to be safe
      } catch (err) {
        setError("Failed to load records.");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [fetchRemittances]);

  // 2. Pre-fill form once loading is finished
  useEffect(() => {
    if (!isLoading) {
      const remit = remittances.find(r => r.id === id || r._id === id);
      
      if (remit) {
        setFormData({
          aed_sent: remit.aed_sent.toString(),
          transfer_fee_aed: remit.transfer_fee_aed.toString(),
          exchange_rate_secured: remit.exchange_rate_secured.toString(),
          destination_account: remit.destination_account,
          date: new Date(remit.date).toISOString().split('T')[0]
        });
        setError(null);
      } else {
        setError(`ID "${id}" not found. Please go back to the Remittance Log.`);
      }
    }
  }, [id, remittances, isLoading]);

  const handleSave = async (e) => {
    e.preventDefault();
    const inrVal = (Number(formData.aed_sent) * Number(formData.exchange_rate_secured)).toFixed(2);
    
    try {
      // updateRemittance will automatically update the twin Transaction
      await updateRemittance(id, {
        aed_sent: Number(formData.aed_sent),
        transfer_fee_aed: Number(formData.transfer_fee_aed),
        exchange_rate_secured: Number(formData.exchange_rate_secured),
        inr_received: Number(inrVal),
        destination_account: formData.destination_account,
        date: new Date(formData.date).toISOString()
      });
      navigate('/remittance', { replace: true });
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500" size={32} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-neutral-950 p-10 flex flex-col items-center justify-center text-center">
      <AlertCircle className="text-rose-500 mb-4" size={48} />
      <h2 className="text-white font-bold text-lg">Record Missing</h2>
      <p className="text-neutral-500 text-sm mt-2 mb-6">{error}</p>
      <button onClick={() => navigate('/remittance')} className="px-8 py-3 bg-neutral-900 text-white rounded-2xl border border-neutral-800 font-bold active:scale-95 transition-all">
        Back to Remittances
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white uppercase tracking-tight">Modify Transfer</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col items-center">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 text-center">Amount (AED)</p>
          <input 
            type="number" step="0.01" required value={formData.aed_sent}
            onChange={(e) => setFormData({...formData, aed_sent: e.target.value})}
            className="bg-transparent text-5xl font-bold text-white text-center w-full outline-none"
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">FX Rate</label>
              <input type="number" step="0.001" required value={formData.exchange_rate_secured} 
                onChange={(e) => setFormData({...formData, exchange_rate_secured: e.target.value})} 
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Fee (AED)</label>
              <input type="number" step="0.01" required value={formData.transfer_fee_aed} 
                onChange={(e) => setFormData({...formData, transfer_fee_aed: e.target.value})} 
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Destination</label>
            <div className="relative">
              <Landmark size={18} className="absolute left-4 top-4 text-neutral-600" />
              <input type="text" required value={formData.destination_account} 
                onChange={(e) => setFormData({...formData, destination_account: e.target.value})} 
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Date</label>
            <input type="date" required value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})} 
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none [color-scheme:dark]" />
          </div>
        </div>

        <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
          <Save size={20} /> Save Changes & Update History
        </button>
      </form>
    </div>
  );
}