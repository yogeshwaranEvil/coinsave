// src/pages/Remittance.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight, TrendingUp, Plus } from 'lucide-react';
import { api } from '../services/api';

export default function Remittance() {
  const navigate = useNavigate();
  const [remittances, setRemittances] = useState([]);

  useEffect(() => {
    api.getRemittances().then(setRemittances).catch(console.error);
  }, []);

  // Calculate Yearly Summary Metrics
  const summary = remittances.reduce((acc, remit) => {
    acc.totalAedSent += remit.aed_sent;
    acc.totalInrReceived += remit.inr_received;
    acc.totalFees += remit.transfer_fee_aed;
    return acc;
  }, { totalAedSent: 0, totalInrReceived: 0, totalFees: 0 });

  const avgFxRate = summary.totalAedSent > 0 
    ? (summary.totalInrReceived / summary.totalAedSent).toFixed(2) 
    : 0;

  return (
    <div className="p-5 space-y-6 animate-in fade-in duration-300 pb-24">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Send className="text-indigo-400" /> Remittance Log
        </h1>
        <button 
          onClick={() => navigate('/add-remittance')}
          className="bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* YEARLY SUMMARY DASHBOARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Total Sent This Year</div>
            <div className="text-2xl font-bold text-indigo-400">
              {summary.totalAedSent.toLocaleString()} <span className="text-sm font-normal text-indigo-400/70">AED</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Net INR Received</div>
            <div className="text-xl font-bold text-emerald-400">
              ₹ {summary.totalInrReceived.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-800"></div>

        <div className="flex justify-between items-center text-xs">
          <div className="flex flex-col">
            <span className="text-neutral-500">Average FX Rate</span>
            <span className="font-bold text-white flex items-center gap-1 mt-0.5">
              <TrendingUp size={12} className="text-yellow-500" /> {avgFxRate}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-neutral-500">Total Fees Paid</span>
            <span className="font-bold text-rose-400 mt-0.5">{summary.totalFees} AED</span>
          </div>
        </div>
      </div>

      {/* REMITTANCE HISTORY */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Transfer History</h2>
        
        {remittances.length === 0 ? (
          <div className="text-center text-neutral-500 py-10 text-sm">No transfers recorded yet.</div>
        ) : (
          remittances.map((remit) => (
            <div key={remit._id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-neutral-200">{remit.destination_account}</span>
                <span className="text-[10px] text-neutral-500">{new Date(remit.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-rose-400">-{remit.aed_sent.toLocaleString()} <span className="text-xs font-normal">AED</span></span>
                <ArrowRight size={16} className="text-neutral-600" />
                <span className="text-emerald-400">+{remit.inr_received.toLocaleString()} <span className="text-xs font-normal">INR</span></span>
              </div>
              <div className="text-[10px] text-neutral-500 text-right">Rate applied: {remit.exchange_rate_secured}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}