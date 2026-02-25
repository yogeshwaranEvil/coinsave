// src/pages/TransactionDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Calendar, Tag, FileText, Globe, Edit2, Save, X } from 'lucide-react';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../utils/helpers';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fxRate } = useAppStore();
  
  const [tx, setTx] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Form State
  const [editData, setEditData] = useState({
    amount: '', category: '', notes: '', date: ''
  });

  useEffect(() => {
    api.getTransactions().then(data => {
      const found = data.find(item => item._id === id);
      if (found) {
        setTx(found);
        setEditData({
          amount: found.amount,
          category: found.category,
          notes: found.notes || '',
          date: new Date(found.date).toISOString().split('T')[0]
        });
      }
    }).catch(console.error);
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setIsDeleting(true);
    try {
      await api.deleteTransaction(id);
      navigate(-1);
    } catch (err) {
      alert("Failed to delete");
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const updatedTx = await api.updateTransaction(id, {
        ...tx, // Keep original type and currency
        amount: parseFloat(editData.amount),
        category: editData.category,
        notes: editData.notes,
        date: new Date(editData.date).toISOString()
      });
      setTx(updatedTx);
      setIsEditing(false); // Close edit mode
    } catch (err) {
      alert("Failed to update transaction");
    } finally {
      setIsSaving(false);
    }
  };

  if (!tx) return <div className="p-5 text-center text-neutral-500 mt-20 animate-pulse">Loading record...</div>;

  const isIncome = tx.type === 'income';
  const colorClass = isIncome ? 'text-emerald-400' : 'text-rose-400';
  const bgClass = isIncome ? 'bg-emerald-500/10' : 'bg-rose-500/10';
  const equivalentAmount = tx.currency === 'AED' ? (tx.amount * fxRate) : (tx.amount / fxRate);
  const oppositeCurrency = tx.currency === 'AED' ? 'INR' : 'AED';

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col animate-in slide-in-from-right-4 duration-300">
      
      {/* HEADER */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-between border-b border-neutral-900">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
          {isEditing ? 'Edit Transaction' : 'Transaction Details'}
        </h1>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className={`p-2 -mr-2 transition-colors ${isEditing ? 'text-rose-400' : 'text-blue-400 hover:text-blue-300'}`}
        >
          {isEditing ? <X size={20} /> : <Edit2 size={20} />}
        </button>
      </div>

      <div className="p-5 flex-1 space-y-6">
        
        {/* BIG AMOUNT HEADER */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className={`p-4 rounded-full ${bgClass} mb-4`}>
            <Tag size={32} className={isIncome ? "text-emerald-500" : "text-rose-500"} />
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-bold ${colorClass}`}>{isIncome ? '+' : '-'}</span>
              <input 
                type="number" 
                value={editData.amount} 
                onChange={e => setEditData({...editData, amount: e.target.value})}
                className={`bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2 text-3xl font-bold ${colorClass} w-40 text-center outline-none focus:border-blue-500`}
              />
              <span className="text-xl font-normal text-neutral-400">{tx.currency}</span>
            </div>
          ) : (
            <>
              <div className={`text-4xl font-bold ${colorClass}`}>
                {isIncome ? '+' : '-'}{tx.amount.toLocaleString()} <span className="text-xl font-normal">{tx.currency}</span>
              </div>
              <div className="text-sm text-neutral-500 mt-2 font-medium">
                ≈ {equivalentAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {oppositeCurrency}
              </div>
            </>
          )}
        </div>

        {/* DETAILS CARD */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden space-y-1">
          
          {/* CATEGORY */}
          <div className="flex items-center gap-4 p-4 border-b border-neutral-800">
            <Globe className="text-indigo-400" size={20} />
            <div className="flex-1">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wide">Category</div>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editData.category}
                  onChange={e => setEditData({...editData, category: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 mt-1 text-white outline-none focus:border-blue-500"
                />
              ) : (
                <div className="text-white font-medium">{tx.category}</div>
              )}
            </div>
          </div>

          {/* DATE */}
          <div className="flex items-center gap-4 p-4 border-b border-neutral-800">
            <Calendar className="text-blue-400" size={20} />
            <div className="flex-1">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wide">Date</div>
              {isEditing ? (
                <input 
                  type="date" 
                  value={editData.date}
                  onChange={e => setEditData({...editData, date: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 mt-1 text-white outline-none focus:border-blue-500"
                />
              ) : (
                <div className="text-white font-medium">{new Date(tx.date).toLocaleDateString()}</div>
              )}
            </div>
          </div>

          {/* NOTES */}
          <div className="flex items-start gap-4 p-4">
            <FileText className="text-yellow-400 mt-1" size={20} />
            <div className="flex-1">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wide">Notes</div>
              {isEditing ? (
                <input 
                  type="text" 
                  placeholder="Add a note..."
                  value={editData.notes}
                  onChange={e => setEditData({...editData, notes: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 mt-1 text-white outline-none focus:border-blue-500"
                />
              ) : (
                <div className="text-white font-medium">{tx.notes || <span className="text-neutral-600 italic">No notes</span>}</div>
              )}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-6 space-y-3">
          {isEditing ? (
            <button 
              onClick={handleUpdate}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <Save size={20} />
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          ) : (
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-bold py-4 rounded-2xl transition-all disabled:opacity-50"
            >
              <Trash2 size={20} />
              {isDeleting ? 'Deleting...' : 'Delete Record'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}