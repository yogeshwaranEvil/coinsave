// src/pages/AddLoan.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Landmark, Save, Plus } from 'lucide-react';

export default function AddLoan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addLoan, updateLoan, loans, isAED } = useAppStore();

  // Extract 'edit' ID from URL parameters (?edit=xyz)
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('edit');
  const isEditing = !!editId;

  const [formData, setFormData] = useState({
    name: '',
    principal: '',
    interestPerMonth: '',
    currency: isAED ? 'AED' : 'INR',
    closeDate: '',
    notes: ''
  });

  // AUTO-FILL LOGIC for Edit Mode
  useEffect(() => {
    if (isEditing && loans.length > 0) {
      const existingLoan = loans.find(l => l.id === editId || l._id === editId);
      if (existingLoan) {
        setFormData({
          name: existingLoan.name,
          principal: existingLoan.principal.toString(),
          interestPerMonth: existingLoan.interestPerMonth.toString(),
          currency: existingLoan.currency,
          closeDate: existingLoan.closeDate.split('T')[0], // Ensure date format for input
          notes: existingLoan.notes || ''
        });
      }
    }
  }, [isEditing, editId, loans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      principal: Number(formData.principal),
      interestPerMonth: Number(formData.interestPerMonth),
      status: Number(formData.principal) <= 0 ? 'closed' : 'active'
    };

    if (isEditing) {
      await updateLoan(editId, payload);
    } else {
      await addLoan(payload);
    }
    
    navigate('/loans');
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-5 animate-in slide-in-from-bottom-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400 active:scale-90 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold text-white uppercase tracking-widest">
          {isEditing ? 'Update Loan' : 'Add New Loan'}
        </h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PRINCIPAL AMOUNT DISPLAY */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col items-center shadow-xl">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-3">
            {isEditing ? 'Current Principal' : 'Loan Amount'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-neutral-600 font-bold text-xl">{formData.currency}</span>
            <input 
              type="number" 
              value={formData.principal}
              onChange={(e) => setFormData({...formData, principal: e.target.value})}
              className="bg-transparent text-5xl font-bold text-white text-center w-full outline-none placeholder:text-neutral-800"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1 tracking-wider">Lender / Loan Name</label>
            <div className="relative">
              <Landmark className="absolute left-4 top-4 text-neutral-600" size={18} />
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Bank Name or Person"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-rose-500/30 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Monthly %</label>
              <input 
                type="number" step="0.01" required
                value={formData.interestPerMonth}
                onChange={(e) => setFormData({...formData, interestPerMonth: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none focus:border-rose-500/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Currency</label>
              <select 
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none appearance-none"
              >
                <option value="AED">AED (UAE)</option>
                <option value="INR">INR (India)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1 tracking-wider">Expected Closure Date</label>
            <input 
              type="date" required
              value={formData.closeDate}
              onChange={(e) => setFormData({...formData, closeDate: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none [color-scheme:dark] focus:border-rose-500/30"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${isEditing ? 'bg-indigo-600 shadow-indigo-900/20' : 'bg-rose-600 shadow-rose-900/20'}`}
        >
          {isEditing ? <Save size={20} /> : <Plus size={20} />}
          {isEditing ? 'Save Changes' : 'Create Loan Entry'}
        </button>
      </form>
    </div>
  );
}