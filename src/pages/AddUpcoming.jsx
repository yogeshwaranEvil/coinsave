// src/pages/AddUpcoming.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, CalendarClock } from 'lucide-react';

export default function AddUpcoming() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit'); 
  
  const { addUpcoming, updateUpcoming, upcomingBills, isAED } = useAppStore();

  // Form State
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(isAED ? 'AED' : 'INR');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // This acts as the Due Date
  const [notes, setNotes] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill if editing an existing scheduled bill
  useEffect(() => {
    if (editId) {
      const existingBill = upcomingBills.find(b => b.id === editId || b._id === editId);
      if (existingBill) {
        setAmount(existingBill.amount.toString());
        setCurrency(existingBill.currency);
        setCategory(existingBill.category);
        const formattedDate = new Date(existingBill.date).toISOString().split('T')[0];
        setDate(formattedDate);
        setNotes(existingBill.notes || '');
      }
    }
  }, [editId, upcomingBills]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!amount || !category) return alert('Please enter an amount and category.');

    setIsSaving(true);

    const payload = {
      type: 'upcoming',
      amount: Number(amount),
      currency,
      category,
      date: new Date(date).toISOString(), // Saves the due date
      notes
    };

    try {
      if (editId) {
        await updateUpcoming(editId, payload);
      } else {
        await addUpcoming(payload);
      }
      navigate('/'); // Go back to Dashboard after saving
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save scheduled bill.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-bottom-8 duration-300 pb-24">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">
          {editId ? 'Edit Scheduled Bill' : 'Schedule Bill'}
        </h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* AMOUNT & CURRENCY */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col items-center">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Planned Amount</p>
          <div className="flex items-center justify-center space-x-3 w-full">
            <input 
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-5xl font-bold text-white text-center w-full outline-none placeholder:text-neutral-700"
              required
            />
          </div>
          
          <div className="flex bg-neutral-800 p-1 rounded-xl mt-6 w-full max-w-[200px]">
            <button 
              type="button"
              onClick={() => setCurrency('AED')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${currency === 'AED' ? 'bg-neutral-600 text-white shadow-sm' : 'text-neutral-400'}`}
            >
              AED
            </button>
            <button 
              type="button"
              onClick={() => setCurrency('INR')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${currency === 'INR' ? 'bg-neutral-600 text-white shadow-sm' : 'text-neutral-400'}`}
            >
              INR
            </button>
          </div>
        </div>

        {/* INPUT FIELDS */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">Bill Name / Category</label>
            <input 
              type="text" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Rent, Credit Card, Electricity"
              className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl py-3.5 px-4 text-white outline-none placeholder:text-neutral-600 focus:border-indigo-500/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">Due Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl py-3.5 px-4 text-white outline-none focus:border-indigo-500/50 transition-colors block [color-scheme:dark]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">Notes (Optional)</label>
            <input 
              type="text" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details..."
              className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl py-3.5 px-4 text-white outline-none placeholder:text-neutral-600 focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button 
          type="submit"
          disabled={isSaving}
          className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] transition-all rounded-xl py-4 flex items-center justify-center gap-2 text-white font-bold text-lg mt-8 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          {isSaving ? 'Scheduling...' : (
            <>
              <CalendarClock size={20} />
              {editId ? 'Update Scheduled Bill' : 'Schedule Bill'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}