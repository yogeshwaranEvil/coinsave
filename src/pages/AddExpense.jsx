// src/pages/AddExpense.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus } from 'lucide-react';
import { api } from '../services/api';

export default function AddExpense() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [category, setCategory] = useState('Food');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    setIsSubmitting(true);
    try {
      await api.createTransaction({
        type: 'expense',
        amount: parseFloat(amount),
        currency,
        category,
        notes,
        date: new Date(date).toISOString(),
      });
      // Success! Go back to Dashboard
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Failed to save expense");
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
          <Minus size={18} className="text-rose-500" /> Add Expense
        </h1>
        <div className="w-8"></div> {/* Spacer for center alignment */}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="p-5 space-y-6 flex-1 flex flex-col">
        
        {/* BIG AMOUNT INPUT */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex items-center gap-3 bg-neutral-900 p-2 rounded-2xl border border-neutral-800 w-full max-w-xs">
            {/* Currency Toggle inside the input */}
            <button 
              type="button"
              onClick={() => setCurrency(c => c === 'AED' ? 'INR' : 'AED')}
              className="bg-neutral-800 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 active:scale-95 transition-transform"
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

        {/* DETAILS */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wide ml-1">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white outline-none appearance-none"
            >
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transport (Petrol/Nol)</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills & Utilities</option>
              <option value="Rent">Rent</option>
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
              placeholder="e.g., Karak tea at Al Maya" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white outline-none placeholder:text-neutral-600"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="mt-auto pt-8 pb-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}