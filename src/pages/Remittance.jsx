// src/pages/Remittance.jsx
import { useEffect, useState } from 'react';
import { Send, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function Remittance() {
  const [remittances, setRemittances] = useState([]);
  
  // Form State
  const [aedSent, setAedSent] = useState('');
  const [fee, setFee] = useState('15'); // Standard bank fee default
  const [fxRate, setFxRate] = useState('');
  const [destination, setDestination] = useState('HDFC Savings');

  const loadData = () => api.getRemittances().then(setRemittances).catch(console.error);
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aedSent || !fxRate) return;

    const inrReceived = parseFloat(aedSent) * parseFloat(fxRate);

    try {
      await api.createRemittance({
        aed_sent: parseFloat(aedSent),
        transfer_fee_aed: parseFloat(fee),
        exchange_rate_secured: parseFloat(fxRate),
        inr_received: inrReceived,
        destination_account: destination
      });
      setAedSent(''); setFxRate('');
      loadData();
    } catch (err) {
      alert("Error saving remittance");
    }
  };

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Send className="text-indigo-400" /> Send to India
      </h1>

      {/* Remittance Form */}
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wide">AED Sent</label>
            <input type="number" placeholder="0.00" value={aedSent} onChange={(e) => setAedSent(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none mt-1" />
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wide">Locked FX Rate</label>
            <input type="number" step="0.001" placeholder="22.85" value={fxRate} onChange={(e) => setFxRate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wide">Transfer Fee (AED)</label>
            <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none mt-1" />
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wide">Destination Bank</label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none mt-1" />
          </div>
        </div>

        {/* Auto-calculated preview */}
        {aedSent && fxRate && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex justify-between items-center text-sm">
            <span className="text-indigo-300">You will receive:</span>
            <span className="font-bold text-indigo-400">₹ {(aedSent * fxRate).toLocaleString()}</span>
          </div>
        )}

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors">
          Record Transfer
        </button>
      </form>

      {/* History List */}
      <div className="space-y-3 pb-6">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Transfer History</h2>
        {remittances.map((remit) => (
          <div key={remit._id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-neutral-300">{remit.destination_account}</span>
              <span className="text-[10px] text-neutral-500">{new Date(remit.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-rose-400">-{remit.aed_sent} <span className="text-xs font-normal">AED</span></span>
              <ArrowRight size={16} className="text-neutral-600" />
              <span className="text-emerald-400">+{remit.inr_received.toLocaleString()} <span className="text-xs font-normal">INR</span></span>
            </div>
            <div className="text-[10px] text-neutral-500 text-right">Rate applied: {remit.exchange_rate_secured}</div>
          </div>
        ))}
      </div>
    </div>
  );
}