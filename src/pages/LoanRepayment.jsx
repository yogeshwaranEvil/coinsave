// src/pages/LoanRepayment.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, CreditCard } from 'lucide-react';

export default function LoanRepayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loans, payLoan } = useAppStore();
  
  const loan = loans.find(l => l.id === id || l._id === id);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  if (!loan) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    await payLoan(id, Number(amount), note);
    navigate('/loans');
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400"><ArrowLeft size={20} /></button>
        <h1 className="text-sm font-bold text-white uppercase tracking-widest">Record Payment</h1>
        <div className="w-10"></div>
      </div>

      <div className="mb-8 text-center">
        <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Paying off</p>
        <h2 className="text-xl font-bold text-white">{loan.name}</h2>
        <p className="text-xs text-rose-500 font-medium mt-1">Remaining: {loan.currency} {loan.principal.toLocaleString()}</p>
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col items-center">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3">Payment Amount</p>
          <input 
            type="number" required autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent text-5xl font-bold text-white text-center w-full outline-none"
            placeholder="0"
          />
        </div>

        <input 
          type="text"
          placeholder="Note (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none"
        />

        <button type="submit" className="w-full bg-emerald-600 py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
          <CreditCard size={20} /> Confirm Payment
        </button>
      </form>
    </div>
  );
}