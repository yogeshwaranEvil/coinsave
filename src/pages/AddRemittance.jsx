// src/pages/AddRemittance.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';

export default function AddRemittance() {
  const navigate = useNavigate();
  const { fxRate: globalFxRate } = useAppStore(); // Pull today's rate as default
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [aedSent, setAedSent] = useState('');
  const [fee, setFee] = useState('15'); // Typical UAE exchange house fee
  const [fxRate, setFxRate] = useState(globalFxRate.toString());
  const [destination, setDestination] = useState('HDFC Savings');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Auto-calculated fields
  const [inrReceived, setInrReceived] = useState(0);

  useEffect(() => {
    if (aedSent && fxRate) {
      setInrReceived((parseFloat(aedSent) * parseFloat(fxRate)).toFixed(2));
    } else {
      setInrReceived(0);
    }
  }, [aedSent, fxRate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aedSent || !fxRate) return;
    
    setIsSubmitting(true);
    try {
      await api.createRemittance({
        aed_sent: parseFloat(aedSent),
        transfer_fee_aed: parseFloat(fee),
        exchange_rate_secured: parseFloat(fxRate),
        inr_received: parseFloat(inrReceived),
        destination_account: destination,
        date: new Date(date).toISOString(),
      });
      navigate('/remittance'); // Go back to the remittance log
    } catch (error) {
      console.error(error);
      alert("Failed to log remittance");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
      
      {/* HEADER */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-between border-b border-neutral-900">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Send size={18} className="text-indigo-400" /> Send Remittance
        </h1>
        <div className="w-8"></div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="p-5 space-y-6 flex-1 flex flex-col">
        
        {/* BIG AMOUNT INPUT */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wide mb-2">Total AED Deducted</div>
          <div className="flex items-center gap-3 bg-neutral-900 p-2 rounded-2xl border border-neutral-800 w-full max-w-xs">
            <div className="bg-neutral-800 px-4 py-3 rounded-xl text-sm font-bold text-indigo-400">AED</div>
            <input 
              type="number" 
              step="0.01"
              required
              autoFocus
              placeholder="0.00" 
              value={aedSent} 
              onChange={(e) => setAedSent(e.target.value)}
              className="bg-transparent text-3xl font-bold text-white w-full outline-none placeholder:text-neutral-700"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wide ml-1">Locked FX Rate</label>
              <input 
                type="number" 
                step="0.001"
                required
                value={fxRate}
                onChange={(e) => setFxRate(e.target.value)}
                className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wide ml-1">Transfer Fee (AED)</label>
              <input 
                type="number" 
                step="0.01"
                required
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wide ml-1">Destination Account</label>
            <input 
              type="text" 
              required
              placeholder="e.g. HDFC Savings"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wide ml-1">Transfer Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white outline-none"
            />
          </div>
        </div>

        {/* DYNAMIC CALCULATOR RESULT */}
        {inrReceived > 0 && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 mt-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <span className="text-indigo-300 text-sm font-medium">Net INR to receive:</span>
              <span className="text-2xl font-bold text-indigo-400 flex items-baseline gap-1">
                <span className="text-sm">₹</span>{parseFloat(inrReceived).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="mt-auto pt-8 pb-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Recording...' : 'Record Remittance'}
          </button>
        </div>
      </form>
    </div>
  );
}