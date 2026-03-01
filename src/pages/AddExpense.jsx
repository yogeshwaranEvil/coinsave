import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  ArrowLeft, Save, CreditCard, Wallet, 
  Tag, Calendar, FileText, ChevronDown 
} from 'lucide-react';

export default function AddExpense() {
  const navigate = useNavigate();
  const { addTransaction, cards, fetchCards, isAED } = useAppStore();

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    currency: isAED ? 'AED' : 'INR',
    category: 'Shopping',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash', // 'cash' or 'credit_card'
    cardId: '',            // Linked credit card ID
    notes: ''
  });

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const categories = [
    'Shopping', 'Food', 'Transport', 'Bills', 
    'Health', 'Entertainment', 'Education', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check: If credit card is selected, a card must be chosen
    if (formData.paymentMethod === 'credit_card' && !formData.cardId) {
      alert("Please select a credit card for this expense.");
      return;
    }

    await addTransaction(formData);
    navigate('/transactions');
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Record Expense</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* AMOUNT INPUT */}
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Amount Spent</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-black text-indigo-500">{formData.currency}</span>
            <input 
              type="number" required step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
              className="bg-transparent text-5xl font-black text-white outline-none w-48 text-center placeholder:text-neutral-900"
              autoFocus
            />
          </div>
        </div>

        {/* PAYMENT METHOD TOGGLE */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Payment Source</label>
          <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setFormData({...formData, paymentMethod: 'cash', cardId: ''})}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all ${
                formData.paymentMethod === 'cash' ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-600'
              }`}
            >
              <Wallet size={14} /> Cash / Debit
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, paymentMethod: 'credit_card'})}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all ${
                formData.paymentMethod === 'credit_card' ? 'bg-amber-500 text-neutral-950 shadow-lg' : 'text-neutral-600'
              }`}
            >
              <CreditCard size={14} /> Credit Card
            </button>
          </div>
        </div>

        {/* DYNAMIC CARD SELECTION */}
        {formData.paymentMethod === 'credit_card' && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black text-amber-500 uppercase ml-1 tracking-widest">Select Card</label>
            <div className="relative">
              <select 
                required
                value={formData.cardId}
                onChange={(e) => setFormData({...formData, cardId: e.target.value})}
                className="w-full bg-neutral-900 border border-amber-500/20 rounded-2xl p-5 text-white outline-none appearance-none font-bold"
              >
                <option value="" disabled>Choose card...</option>
                {cards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.bankName} (**** {card.lastFour}) - {card.currency}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-5 text-neutral-600 pointer-events-none" size={18} />
            </div>
          </div>
        )}

        {/* CATEGORY & DATE ROW */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Category</label>
            <div className="relative">
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none appearance-none font-bold"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <Tag className="absolute right-4 top-4 text-neutral-700 pointer-events-none" size={14} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Date</label>
            <div className="relative">
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none font-bold"
              />
            </div>
          </div>
        </div>

        {/* CURRENCY TOGGLE (ONLY FOR CASH) */}
        {formData.paymentMethod === 'cash' && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Currency</label>
            <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setFormData({...formData, currency: 'AED'})}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${formData.currency === 'AED' ? 'bg-indigo-600 text-white' : 'text-neutral-600'}`}
              >
                AED
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, currency: 'INR'})}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${formData.currency === 'INR' ? 'bg-indigo-600 text-white' : 'text-neutral-600'}`}
              >
                INR
              </button>
            </div>
          </div>
        )}

        {/* NOTES */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-500 uppercase ml-1 tracking-widest">Notes (Optional)</label>
          <div className="relative">
            <FileText className="absolute left-5 top-5 text-neutral-600" size={18} />
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="What was this for?"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-5 pl-14 pr-5 text-white outline-none font-medium h-24"
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button 
          type="submit" 
          className="w-full bg-indigo-600 py-5 rounded-[2rem] font-black text-white shadow-xl shadow-indigo-950/40 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px]"
        >
          <Save size={18} /> Confirm Expense
        </button>
      </form>
    </div>
  );
}