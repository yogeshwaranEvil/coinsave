// src/pages/ManageCards.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { 
  Plus, CreditCard, Calendar, ArrowLeft, 
  AlertCircle, ChevronRight, PieChart, Trash2 
} from 'lucide-react';

export default function ManageCards() {
  const navigate = useNavigate();
  const { 
    cards, 
    fetchCards, 
    getCardOutstanding, 
    deleteCard,
    isAED, 
    fxRate 
  } = useAppStore();

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // --- CASCADE DELETE HANDLER ---
  const handleDelete = async (e, id, bankName) => {
    e.stopPropagation(); // Stop navigation to details page
    
    const confirmMessage = `Delete ${bankName} card?\n\nThis will permanently remove all linked transactions and payment history from your records.`;
    
    if (window.confirm(confirmMessage)) {
      await deleteCard(id);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 pb-32 animate-in slide-in-from-right duration-500 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400 active:scale-90 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Credit Portfolio</h1>
        <button 
          onClick={() => navigate('/add-card')}
          className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-950/40 active:scale-90 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-20 text-white">
            <CreditCard size={48} className="mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">No Cards Registered</p>
          </div>
        ) : (
          cards.map((card) => {
            const outstanding = getCardOutstanding(card.id || card._id);
            const limit = Number(card.limit) || 1;
            const usagePercent = Math.min((outstanding / limit) * 100, 100);

            return (
              <div 
                key={card.id || card._id}
                onClick={() => navigate(`/card-details/${card.id || card._id}`)}
                className="bg-neutral-900/50 border border-neutral-800 rounded-[2.5rem] p-6 space-y-6 relative overflow-hidden group active:bg-neutral-900 transition-all cursor-pointer shadow-xl"
              >
                {/* Visual Background Accent */}
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <CreditCard size={100} />
                </div>

                {/* CARD INFO & DELETE ACTION */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">
                      {card.bankName}
                    </p>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-white tracking-tighter">
                        **** {card.lastFour}
                      </h2>
                      <ChevronRight size={14} className="text-neutral-700 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, card.id || card._id, card.bankName)}
                    className="p-3 bg-rose-500/5 text-rose-500/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* UTILIZATION PROGRESS BAR */}
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-neutral-500">Utilization</span>
                    <span className={usagePercent > 80 ? 'text-rose-500 font-bold' : 'text-emerald-400'}>
                      {usagePercent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-950 rounded-full border border-neutral-800 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${usagePercent > 80 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-indigo-500'}`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-lg font-black text-white leading-none">
                      {formatMoney(outstanding, card.currency === 'AED', fxRate, card.currency)}
                    </p>
                    <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-tighter">
                      Limit: {card.currency} {limit.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* BILLING DATES FOOTER */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800/50 relative z-10">
                  <div className="bg-neutral-950/50 p-3 rounded-2xl flex items-center gap-3 border border-neutral-800/40">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <p className="text-[8px] text-neutral-600 font-black uppercase leading-none">Statement</p>
                      <p className="text-[11px] text-white font-bold mt-1.5">{card.statementDate}th</p>
                    </div>
                  </div>
                  <div className={`bg-neutral-950/50 p-3 rounded-2xl flex items-center gap-3 border ${usagePercent > 80 ? 'border-rose-500/20' : 'border-neutral-800/40'}`}>
                    <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                      <AlertCircle size={14} />
                    </div>
                    <div>
                      <p className="text-[8px] text-rose-500/60 font-black uppercase leading-none">Due Date</p>
                      <p className="text-[11px] text-white font-bold mt-1.5">{card.dueDate}th</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PRO TIP / INSIGHT FOOTER */}
      <div className="mt-10 bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] p-6 flex items-center gap-5 shadow-inner">
        <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-indigo-900/40 shrink-0">
          <PieChart size={22} />
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Financial Insight</p>
          <p className="text-[11px] text-neutral-300 font-medium leading-relaxed mt-1">
            Tap a card to view your <span className="text-white font-bold underline decoration-indigo-500/50">Digital Statement</span> or settle your outstanding balance.
          </p>
        </div>
      </div>
    </div>
  );
}