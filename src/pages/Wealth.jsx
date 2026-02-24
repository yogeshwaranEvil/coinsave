// src/pages/Wealth.jsx
import { useEffect, useState } from 'react';
import { Wallet, Landmark, Coins } from 'lucide-react';
import { api } from '../services/api';

export default function Wealth() {
  const [wealthItems, setWealthItems] = useState([]);
  
  // Form State
  const [classType, setClassType] = useState('asset');
  const [category, setCategory] = useState('bank');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [unit, setUnit] = useState('AED');

  const loadData = () => api.getWealth().then(setWealthItems).catch(console.error);
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !balance) return;

    try {
      await api.createWealthItem({
        class_type: classType,
        category,
        name,
        balance_or_quantity: parseFloat(balance),
        unit
      });
      setName(''); setBalance('');
      loadData();
    } catch (err) {
      alert("Error saving wealth item");
    }
  };

  const assets = wealthItems.filter(item => item.class_type === 'asset');
  const liabilities = wealthItems.filter(item => item.class_type === 'liability');

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Wallet className="text-yellow-500" /> Wealth & Assets
      </h1>

      {/* Add Asset/Liability Form */}
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <select value={classType} onChange={(e) => setClassType(e.target.value)} className="bg-neutral-950 border border-neutral-800 text-sm rounded-lg p-2 text-white outline-none">
            <option value="asset">Asset (Bank/Gold)</option>
            <option value="liability">Liability (Loan)</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-neutral-950 border border-neutral-800 text-sm rounded-lg p-2 text-white outline-none">
            <option value="bank">Bank Account</option>
            <option value="gold">Physical Gold</option>
            <option value="silver">Physical Silver</option>
            <option value="personal_loan">Personal Loan</option>
          </select>
        </div>
        
        <input type="text" placeholder="Name (e.g. NRE HDFC, 24k Gold)" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none" />
        
        <div className="grid grid-cols-2 gap-2">
          <input type="number" step="0.01" placeholder="Balance or Weight" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none" />
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="bg-neutral-950 border border-neutral-800 text-sm rounded-lg p-2 text-white outline-none">
            <option value="AED">AED</option>
            <option value="INR">INR</option>
            <option value="grams">Grams</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-xl transition-colors">
          Add Portfolio Item
        </button>
      </form>

      {/* Portfolio List */}
      <div className="space-y-6 pb-6">
        
        {/* Assets Section */}
        <div>
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Your Assets</h2>
          <div className="space-y-2">
            {assets.map(item => (
              <div key={item._id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {item.category === 'gold' || item.category === 'silver' ? <Coins size={18} className="text-yellow-500" /> : <Landmark size={18} className="text-blue-400" />}
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <div className="font-bold text-emerald-400">
                  {item.balance_or_quantity.toLocaleString()} <span className="text-xs font-normal text-neutral-500">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities Section */}
        <div>
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Your Liabilities</h2>
          <div className="space-y-2">
            {liabilities.map(item => (
              <div key={item._id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Landmark size={18} className="text-rose-500" />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <div className="font-bold text-rose-400">
                  -{item.balance_or_quantity.toLocaleString()} <span className="text-xs font-normal text-neutral-500">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}