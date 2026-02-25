// src/pages/RemittanceDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { ArrowLeft, Trash2, Edit3, Landmark, Globe, ReceiptText, Calendar } from 'lucide-react';

export default function RemittanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { remittances, deleteRemittance, fxRate } = useAppStore();

  const remit = remittances.find(r => r.id === id || r._id === id);

  if (!remit) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-5">
        <p className="text-neutral-500 mb-4">Transfer record not found.</p>
        <button onClick={() => navigate('/remittance')} className="text-indigo-400 font-bold">Back to Log</button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Delete this remittance? This will also restore the balance in your transaction history.")) {
      await deleteRemittance(id);
      navigate('/remittance');
    }
  };
  const handleEdit = () => {
  // Use remit.id or remit._id to ensure we get the right one from your list
  const targetId = remit.id || remit._id; 
  navigate(`/edit-remittance/${targetId}`); 
};

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-right-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em]">Transfer Details</h1>
        <div className="w-10"></div>
      </div>

      {/* AMOUNT DISPLAY */}
      <div className="flex flex-col items-center py-8 mb-4">
        <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-2">Sent from UAE</div>
        <div className="text-4xl font-bold text-white tracking-tighter">
          {remit.aed_sent.toLocaleString()} <span className="text-lg text-neutral-500 font-medium">AED</span>
        </div>
        <div className="mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-bold text-lg">
          ≈ ₹{remit.inr_received.toLocaleString()} Received
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-neutral-400">
            <Landmark size={18} />
            <span className="text-sm font-medium">Destination</span>
          </div>
          <span className="text-sm font-bold text-white">{remit.destination_account}</span>
        </div>

        <div className="h-px bg-neutral-800/50 w-full"></div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-neutral-400">
            <Globe size={18} />
            <span className="text-sm font-medium">Locked Rate</span>
          </div>
          <span className="text-sm font-bold text-indigo-400">1 AED = {remit.exchange_rate_secured} INR</span>
        </div>

        <div className="h-px bg-neutral-800/50 w-full"></div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-neutral-400">
            <ReceiptText size={18} />
            <span className="text-sm font-medium">Service Fee</span>
          </div>
          <span className="text-sm font-bold text-rose-400">{remit.transfer_fee_aed} AED</span>
        </div>

        <div className="h-px bg-neutral-800/50 w-full"></div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-neutral-400">
            <Calendar size={18} />
            <span className="text-sm font-medium">Transfer Date</span>
          </div>
          <span className="text-sm font-bold text-neutral-200">
            {new Date(remit.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mt-8">
        <button 
    onClick={handleEdit}
          className="flex-1 bg-neutral-900 border border-neutral-800 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
        >
          <Edit3 size={18} /> Edit
        </button>
        <button 
          onClick={handleDelete}
          className="flex-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>
    </div>
  );
}