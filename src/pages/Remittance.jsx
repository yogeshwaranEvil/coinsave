// src/pages/Remittance.jsx
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight, TrendingUp, Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Remittance() {
  const navigate = useNavigate();
  
  // Connect to the global store instead of local state
  const { remittances, fetchRemittances, isLoading } = useAppStore();

  useEffect(() => {
    fetchRemittances();
  }, [fetchRemittances]);

  // Calculate Yearly Summary Metrics using useMemo for performance
  const summary = useMemo(() => {
    return remittances.reduce((acc, remit) => {
      acc.totalAedSent += Number(remit.aed_sent || 0);
      acc.totalInrReceived += Number(remit.inr_received || 0);
      acc.totalFees += Number(remit.transfer_fee_aed || 0);
      return acc;
    }, { totalAedSent: 0, totalInrReceived: 0, totalFees: 0 });
  }, [remittances]);

  const avgFxRate = summary.totalAedSent > 0 
    ? (summary.totalInrReceived / summary.totalAedSent).toFixed(2) 
    : 0;

  return (
    <div className="p-5 space-y-6 animate-in fade-in duration-300 pb-28 min-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Send className="text-indigo-400" size={24} /> Remittance
          </h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-medium">Cross-Border Tracker</p>
        </div>
        <button 
          onClick={() => navigate('/add-remittance')}
          className="bg-indigo-600 w-11 h-11 rounded-full text-white flex items-center justify-center hover:bg-indigo-500 active:scale-90 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* YEARLY SUMMARY DASHBOARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-5 shadow-xl shadow-black/20">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Sent (AED)</div>
            <div className="text-3xl font-bold text-white tracking-tighter">
              {summary.totalAedSent.toLocaleString()} <span className="text-sm font-medium text-neutral-500">AED</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Received (INR)</div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              ₹{summary.totalInrReceived.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-800/50"></div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-800/30 rounded-2xl p-3 border border-neutral-800/50">
            <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">Avg. FX Rate</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <TrendingUp size={14} className="text-yellow-500" /> {avgFxRate}
            </span>
          </div>
          <div className="bg-neutral-800/30 rounded-2xl p-3 border border-neutral-800/50 text-right">
            <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">Fees Paid</span>
            <span className="font-bold text-rose-400">{summary.totalFees} <span className="text-[10px] text-rose-400/60 uppercase">AED</span></span>
          </div>
        </div>
      </div>

      {/* REMITTANCE HISTORY */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Transfer History</h2>
        
        {isLoading ? (
          <div className="text-center text-neutral-600 py-10 text-sm animate-pulse">Syncing logs...</div>
        ) : remittances.length === 0 ? (
          <div className="text-center bg-neutral-900/40 border border-dashed border-neutral-800 rounded-3xl py-12">
            <Send size={32} className="mx-auto text-neutral-800 mb-3" />
            <p className="text-sm text-neutral-600">No transfers recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {remittances.map((remit) => (
              <div 
                key={remit.id || remit._id} 
                onClick={() => navigate(`/remittance/${remit.id || remit._id}`)}
                className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3 active:scale-[0.98] active:bg-neutral-800 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    {remit.destination_account}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 bg-neutral-800 px-2 py-1 rounded-md">
                    {new Date(remit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-white tracking-tight">
                    {remit.aed_sent.toLocaleString()} <span className="text-[10px] text-neutral-500 font-medium">AED</span>
                  </div>
                  
                  <div className="flex-1 flex justify-center opacity-30 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={18} className="text-neutral-500" />
                  </div>
                  
                  <div className="text-xl font-bold text-emerald-400 tracking-tight text-right">
                    <span className="text-sm">₹</span>{remit.inr_received.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-neutral-800/30">
                   <div className="text-[10px] text-neutral-500 font-medium">
                    Locked Rate: <span className="text-indigo-400">{remit.exchange_rate_secured}</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 font-medium italic">
                    Fee: {remit.transfer_fee_aed} AED
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}