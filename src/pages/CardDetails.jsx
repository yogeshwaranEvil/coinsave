// src/pages/CardDetails.jsx
import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { 
  ArrowLeft, CreditCard, Calendar, 
  AlertCircle, ArrowUpRight, Receipt, CheckCircle2, X 
} from 'lucide-react';

export default function CardDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, transactions, isAED, fxRate, payCardBill } = useAppStore();

  // Local state for the Settle Text Box
  const [showSettle, setShowSettle] = useState(false);
  const [payAmount, setPayAmount] = useState('');

  // Find the specific card
  const card = useMemo(() => 
    cards.find(c => (c.id === id || c._id === id)), 
  [cards, id]);

  // CRITICAL FIX: Only include transactions where paymentMethod is actually 'credit_card'
  // This completely removes the "Bank Transfer" side from showing up here and ruining the math.
  const cardTransactions = useMemo(() => 
    transactions.filter(tx => 
      (tx.cardId === id || tx.cardId === card?.id) && 
      tx.paymentMethod === 'credit_card'
    ), 
  [transactions, id, card]);

  // Calculate current outstanding
  const outstanding = useMemo(() => {
    return cardTransactions.reduce((acc, tx) => {
      const amt = Number(tx.amount) || 0;
      // Expenses add to debt. Income (Repayments) subtract from debt.
      return tx.type === 'expense' ? acc + amt : acc - amt;
    }, 0);
  }, [cardTransactions]);

  if (!card) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-10 text-white font-black uppercase text-center">
      Card Not Found
    </div>
  );

  const limit = Number(card.limit) || 1;
  const usagePercent = Math.min((outstanding / limit) * 100, 100);

  // --- SETTLE HANDLER ---
  const handleSettleSubmit = async () => {
    const amt = Number(payAmount);
    if (amt > 0) {
      await payCardBill(card.id || card._id, amt);
      setShowSettle(false);
      setPayAmount('');
    } else {
      alert("Please enter a valid amount");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 pb-32 animate-in fade-in duration-500 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{card.bankName}</h1>
          <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest mt-0.5">**** {card.lastFour}</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* CARD SUMMARY WIDGET */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-[2.5rem] p-7 space-y-6 shadow-2xl relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 p-8 opacity-5"><CreditCard size={100} /></div>
        
        <div className="relative z-10">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Current Outstanding</p>
          <h2 className="text-4xl font-black text-white tracking-tighter">
            {formatMoney(outstanding, card.currency === 'AED', fxRate, card.currency)}
          </h2>
        </div>

        {/* UTILIZATION PROGRESS */}
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
            <span className="text-neutral-500">Utilization</span>
            <span className={usagePercent > 80 ? 'text-rose-500' : 'text-emerald-400'}>{usagePercent.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-neutral-950 rounded-full border border-neutral-800 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${usagePercent > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {/* BILLING DATES */}
        <div className="grid grid-cols-2 gap-4 pt-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-800 rounded-xl text-neutral-400"><Calendar size={14} /></div>
            <div>
              <p className="text-[8px] text-neutral-600 font-black uppercase">Statement</p>
              <p className="text-xs text-white font-bold">{card.statementDate}th</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500"><AlertCircle size={14} /></div>
            <div>
              <p className="text-[8px] text-rose-500/60 font-black uppercase">Due Date</p>
              <p className="text-xs text-white font-bold">{card.dueDate}th</p>
            </div>
          </div>
        </div>
      </div>

      {/* TRIGGER SETTLE BUTTON */}
      {!showSettle && (
        <div className="px-1 mb-10">
          <button 
            onClick={() => {
              setShowSettle(true);
              // Pre-fill with remaining balance
              setPayAmount(outstanding > 0 ? outstanding.toString() : ''); 
            }}
            disabled={outstanding <= 0}
            className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all ${
              outstanding <= 0 
              ? 'bg-neutral-900 text-neutral-700 border border-neutral-800 cursor-not-allowed' 
              : 'bg-white text-neutral-950'
            }`}
          >
            <CheckCircle2 size={18} /> Settle Card Balance
          </button>
        </div>
      )}

      {/* --- THE SETTLE TEXT BOX (UI PANEL) --- */}
      {showSettle && (
        <div className="px-1 mb-10 animate-in slide-in-from-bottom duration-300">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Repayment Amount</span>
              <button onClick={() => setShowSettle(false)} className="text-neutral-500"><X size={16}/></button>
            </div>
            
            <div className="relative">
              <span className="absolute left-5 top-5 text-neutral-500 font-black text-sm">{card.currency}</span>
              <input 
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-5 pl-14 pr-5 text-white font-black text-xl outline-none focus:border-indigo-500 transition-all"
                placeholder="0.00"
                autoFocus
              />
            </div>

            <button 
              onClick={handleSettleSubmit}
              className="w-full bg-indigo-600 py-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-950/50 active:scale-95 transition-all"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}

      {/* TRANSACTION LIST */}
      <div className="space-y-5">
        <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
          <Receipt size={12} /> Digital Statement
        </h3>

        {cardTransactions.length === 0 ? (
          <div className="bg-neutral-900/30 border border-neutral-800 border-dashed rounded-[2rem] py-16 text-center text-neutral-700 font-black uppercase text-[10px] tracking-widest">
            No Card Activity Found
          </div>
        ) : (
          <div className="space-y-3">
            {cardTransactions.map((tx) => (
              <div 
                key={tx.id || tx._id}
                onClick={() => navigate(`/transaction/${tx.id || tx._id}`)}
                className="bg-neutral-900/50 border border-neutral-800/60 rounded-[2rem] p-5 flex justify-between items-center active:bg-neutral-900 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    <ArrowUpRight size={20} className={tx.type === 'income' ? 'rotate-180' : ''} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{tx.category}</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5 tracking-tighter line-clamp-1">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {tx.notes || 'No Note'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                    {tx.type === 'expense' ? '-' : '+'}{formatMoney(tx.amount, tx.currency === 'AED', fxRate, tx.currency)}
                  </p>
                  <p className="text-[9px] text-neutral-600 font-black uppercase mt-1">
                    {tx.category === 'Card Repayment' ? 'Cleared' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}