// src/pages/AddIncome.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { api } from '../services/api';

export default function AddIncome() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [category, setCategory] = useState('Salary'); // Default changed to Salary
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    setIsSubmitting(true);
    try {
      await api.createTransaction({
        type: 'income',
        amount: parseFloat(amount),
        currency,
        category,
        notes,
        date: new Date(date).toISOString(),
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Failed to save income");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
      <div className="px-5 pt-8 pb-4 flex items-center justify-between border-b border-neutral-900">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus size={18} className="text-emerald-400" /> Add Income
        </h1>
        <div className="w-8"></div> 
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-6 flex-1 flex flex-col">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex items-center gap-3 bg-neutral-900 p-2 rounded-2xl border border-neutral-800 w-full max-w-xs">
            <button 
              type="button"
              onClick={() => setCurrency(c => c === 'AED' ? 'INR' : 'AED')}
              className="bg-neutral-800 px-4 py-3 rounded-xl text-sm font-bold text-emerald-400 active:scale-95 transition-transform"
            >
              {currency} ⇄
            </button>
            <input 
              type="number" 
              step="0.01"
              required
              autoFocus
              placeholder="0.00" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-3xl font-bold text-white w-full outline-none placeholder:text-neutral-700"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wide ml-1">Source</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white outline-none appearance-none"
            >
              <option value="Salary">Salary</option>
              <option value="Business">Business</option>
              <option value="Investment">Investment Returns</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wide ml-1">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wide ml-1">Notes (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g., February Salary" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white outline-none placeholder:text-neutral-600"
            />
          </div>
        </div>

        <div className="mt-auto pt-8 pb-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Income'}
          </button>
        </div>
      </form>
    </div>
  );
}