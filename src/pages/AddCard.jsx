// src/pages/AddCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Save, CreditCard, Landmark, Calendar, ShieldCheck } from 'lucide-react';

export default function AddCard() {
  const navigate = useNavigate();
  const { addCard, isAED } = useAppStore();

  const [formData, setFormData] = useState({
    bankName: '',
    lastFour: '',
    limit: '',
    statementDate: '1', // Default to 1st
    dueDate: '20',      // Default to 20th
    currency: isAED ? 'AED' : 'INR'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCard(formData);
    navigate('/manage-cards');
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Register Card</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BANK NAME */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Issuing Bank</label>
          <div className="relative">
            <Landmark className="absolute left-5 top-5 text-neutral-600" size={18} />
            <input 
              type="text" required
              value={formData.bankName}
              onChange={(e) => setFormData({...formData, bankName: e.target.value})}
              placeholder="e.g. Emirates NBD, HDFC"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-5 pl-14 pr-5 text-white outline-none focus:border-indigo-500 transition-all font-bold"
            />
          </div>
        </div>

        {/* CARD DETAILS ROW */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Last 4 Digits</label>
            <input 
              type="text" maxLength="4" required
              value={formData.lastFour}
              onChange={(e) => setFormData({...formData, lastFour: e.target.value.replace(/\D/g, '')})}
              placeholder="0000"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white outline-none font-bold text-center tracking-[0.5em]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Credit Limit</label>
            <input 
              type="number" required
              value={formData.limit}
              onChange={(e) => setFormData({...formData, limit: e.target.value})}
              placeholder="5000"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white outline-none font-bold"
            />
          </div>
        </div>

        {/* BILLING CYCLE */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-[2rem] p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Cycle Management</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-neutral-600 uppercase">Statement Day</label>
              <select 
                value={formData.statementDate}
                onChange={(e) => setFormData({...formData, statementDate: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white font-bold outline-none"
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-rose-500/60 uppercase">Due Day</label>
              <select 
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white font-bold outline-none"
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[8px] text-neutral-600 font-bold uppercase text-center">Dates are relative to the current month</p>
        </div>

        {/* CURRENCY SELECTOR */}
        <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setFormData({...formData, currency: 'AED'})}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${formData.currency === 'AED' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500'}`}
          >
            Dubai (AED)
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, currency: 'INR'})}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${formData.currency === 'INR' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500'}`}
          >
            India (INR)
          </button>
        </div>

        {/* SUBMIT */}
        <button 
          type="submit" 
          className="w-full bg-white py-5 rounded-[2rem] font-black text-neutral-950 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px]"
        >
          <Save size={18} /> Initialize Card
        </button>
      </form>
    </div>
  );
}