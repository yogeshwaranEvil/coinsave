// src/pages/AddLoan.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Landmark, Calendar } from 'lucide-react';

export default function AddLoan() {
  const navigate = useNavigate();
  const { addLoan, isAED } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    principal: '',
    interestPerMonth: '',
    currency: isAED ? 'AED' : 'INR',
    closeDate: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addLoan({
      ...formData,
      principal: Number(formData.principal),
      interestPerMonth: Number(formData.interestPerMonth)
    });
    navigate('/loans');
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">Add Loan</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col items-center">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-3">Principal Amount</p>
          <input 
            type="number" 
            value={formData.principal}
            onChange={(e) => setFormData({...formData, principal: e.target.value})}
            className="bg-transparent text-5xl font-bold text-white text-center w-full outline-none"
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Loan Name / Lender</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Personal Loan, Car EMI"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Monthly Interest (%)</label>
              <input 
                type="number" step="0.01" required
                value={formData.interestPerMonth}
                onChange={(e) => setFormData({...formData, interestPerMonth: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Currency</label>
              <select 
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none appearance-none"
              >
                <option value="AED">AED</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Loan Close Date</label>
            <input 
              type="date" required
              value={formData.closeDate}
              onChange={(e) => setFormData({...formData, closeDate: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none [color-scheme:dark]"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-rose-600 py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all">
          Record Loan
        </button>
      </form>
    </div>
  );
}