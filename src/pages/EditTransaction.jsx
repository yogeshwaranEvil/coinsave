// src/pages/EditTransaction.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, updateTransaction, fetchTransactions } = useAppStore();

  const [formData, setFormData] = useState({
    amount: '',
    currency: 'AED',
    category: '',
    date: '',
    notes: '',
    type: ''
  });

  useEffect(() => {
    const init = async () => {
      if (transactions.length === 0) await fetchTransactions();
      const tx = transactions.find(t => t.id === id || t._id === id);
      if (tx) {
        setFormData({
          amount: tx.amount,
          currency: tx.currency,
          category: tx.category,
          date: new Date(tx.date).toISOString().split('T')[0],
          notes: tx.notes || '',
          type: tx.type
        });
      }
    };
    init();
  }, [id, transactions, fetchTransactions]);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateTransaction(id, {
      ...formData,
      amount: Number(formData.amount),
      date: new Date(formData.date).toISOString()
    });
    navigate(`/transaction/${id}`, { replace: true });
  };

  const isExpense = formData.type === 'expense';

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white uppercase tracking-tight">Edit {formData.type}</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center">
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isExpense ? 'text-rose-500' : 'text-emerald-500'}`}>Amount</p>
          <input 
            type="number" 
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="bg-transparent text-5xl font-bold text-white text-center w-full outline-none"
            autoFocus
          />
          <div className="flex bg-neutral-800 p-1 rounded-xl mt-6 w-full max-w-[160px]">
            {['AED', 'INR'].map(cur => (
              <button
                key={cur}
                type="button"
                onClick={() => setFormData({...formData, currency: cur})}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.currency === cur ? 'bg-neutral-600 text-white' : 'text-neutral-500'}`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Category</label>
            <input 
              type="text" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 px-4 text-white outline-none focus:border-neutral-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 px-4 text-white outline-none [color-scheme:dark]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Notes</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 px-4 text-white outline-none focus:border-neutral-600 h-24 resize-none"
            />
          </div>
        </div>

        <button type="submit" className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white shadow-lg transition-all active:scale-[0.98] ${isExpense ? 'bg-rose-600 shadow-rose-900/20' : 'bg-emerald-600 shadow-emerald-900/20'}`}>
          <Save size={20} /> Update Transaction
        </button>
      </form>
    </div>
  );
}