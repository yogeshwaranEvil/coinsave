// src/pages/UpcomingBills.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';
import { ArrowLeft, CalendarClock, CheckCircle2, Trash2, Plus, Edit3 } from 'lucide-react';

export default function UpcomingBills() {
  const navigate = useNavigate();
  const { upcomingBills, fetchUpcoming, markUpcomingAsPaid, deleteUpcoming, fxRate, isAED } = useAppStore();

  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming]);

  const getDaysRemaining = (dateString) => {
    const diff = new Date(dateString) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="p-5 space-y-6 animate-in fade-in duration-300 pb-28 min-h-screen bg-neutral-950">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Scheduled Bills</h1>
        <button 
          onClick={() => navigate('/add-upcoming')}
          className="p-2 bg-indigo-500 text-white rounded-full active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {upcomingBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500 space-y-4">
            <CalendarClock size={48} className="text-neutral-800" />
            <p className="text-sm">No bills scheduled.</p>
          </div>
        ) : (
          upcomingBills.map((bill) => {
            const daysLeft = getDaysRemaining(bill.date);
            const isOverdue = daysLeft < 0;

            return (
              <div key={bill.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isOverdue ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      <CalendarClock size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{bill.category}</h3>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${isOverdue ? 'text-rose-500' : 'text-neutral-500'}`}>
                        {isOverdue ? `${Math.abs(daysLeft)} Days Overdue` : `Due in ${daysLeft} Days`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {formatMoney(bill.amount, bill.currency === 'AED', fxRate, bill.currency)}
                    </div>
                    <p className="text-[10px] text-neutral-500">{new Date(bill.date).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* ACTION ROW */}
                <div className="flex gap-2 pt-2 border-t border-neutral-800/50">
                  <button 
                    onClick={() => markUpcomingAsPaid(bill)}
                    className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle2 size={14} /> Mark as Paid
                  </button>
                  <button 
                    onClick={() => navigate(`/add-upcoming?edit=${bill.id}`)}
                    className="bg-neutral-800 text-neutral-400 p-2.5 rounded-xl hover:text-white transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteUpcoming(bill.id)}
                    className="bg-rose-500/10 text-rose-500 p-2.5 rounded-xl hover:bg-rose-500/20 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}