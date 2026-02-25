// src/pages/AddRemittance.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send, Save } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function AddRemittance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const { fxRate: globalFxRate, addRemittance, updateRemittance, remittances } = useAppStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    aedSent: '',
    fee: '15',
    fxRate: globalFxRate.toString(),
    destination: 'HDFC Savings',
    date: new Date().toISOString().split('T')[0]
  });

  const [inrReceived, setInrReceived] = useState(0);

  // Pre-fill if in Edit Mode
  useEffect(() => {
    if (editId) {
      const existing = remittances.find(r => r.id === editId || r._id === editId);
      if (existing) {
        setFormData({
          aedSent: existing.aed_sent.toString(),
          fee: existing.transfer_fee_aed.toString(),
          fxRate: existing.exchange_rate_secured.toString(),
          destination: existing.destination_account,
          date: existing.date.split('T')[0]
        });
      }
    }
  }, [editId, remittances]);

  useEffect(() => {
    if (formData.aedSent && formData.fxRate) {
      setInrReceived((parseFloat(formData.aedSent) * parseFloat(formData.fxRate)).toFixed(2));
    } else {
      setInrReceived(0);
    }
  }, [formData.aedSent, formData.fxRate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      aed_sent: parseFloat(formData.aedSent),
      transfer_fee_aed: parseFloat(formData.fee),
      exchange_rate_secured: parseFloat(formData.fxRate),
      inr_received: parseFloat(inrReceived),
      destination_account: formData.destination,
      date: new Date(formData.date).toISOString(),
    };

    try {
      if (editId) {
        await updateRemittance(editId, payload);
      } else {
        await addRemittance(payload);
      }
      navigate('/remittance');
    } catch (error) {
      alert("Error saving record.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col animate-in slide-in-from-bottom-4 pb-24">
      <div className="px-5 pt-8 pb-4 flex items-center justify-between border-b border-neutral-900">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Send size={18} className="text-indigo-400" /> {editId ? 'Edit Record' : 'Record Remittance'}
        </h1>
        <div className="w-8"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col items-center">
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-2">Amount Sent (AED)</span>
          <input 
            type="number" step="0.01" required value={formData.aedSent}
            onChange={(e) => setFormData({...formData, aedSent: e.target.value})}
            className="bg-transparent text-5xl font-bold text-white text-center w-full outline-none placeholder:text-neutral-800"
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase font-bold ml-1">FX Rate</label>
            <input type="number" step="0.001" required value={formData.fxRate}
              onChange={(e) => setFormData({...formData, fxRate: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase font-bold ml-1">Fee (AED)</label>
            <input type="number" step="0.01" required value={formData.fee}
              onChange={(e) => setFormData({...formData, fee: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase font-bold ml-1">To Account</label>
            <input type="text" required value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase font-bold ml-1">Date</label>
            <input type="date" required value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none [color-scheme:dark]" />
          </div>
        </div>

        {inrReceived > 0 && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex justify-between items-center">
            <span className="text-sm font-bold text-indigo-300">Receiving:</span>
            <span className="text-2xl font-black text-indigo-400">₹{parseFloat(inrReceived).toLocaleString()}</span>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 py-4 rounded-2xl text-white font-bold shadow-lg shadow-indigo-900/40 active:scale-[0.98] transition-all disabled:opacity-50">
           {isSubmitting ? 'Processing...' : (editId ? 'Update Transfer' : 'Record Transfer')}
        </button>
      </form>
    </div>
  );
}