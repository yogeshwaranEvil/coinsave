// src/pages/Settings.jsx
import { useAppStore } from '../store/useAppStore';
import { Shield, ShieldOff, ChevronRight, Bell, Smartphone } from 'lucide-react';

export default function Settings() {
  const { pin, setPin, removePin } = useAppStore();

  const handleTogglePin = () => {
    if (pin) {
      if (window.confirm("Remove PIN protection?")) removePin();
    } else {
      const newPin = prompt("Enter a new 4-digit PIN:");
      if (newPin && newPin.length === 4) {
        setPin(newPin);
      } else {
        alert("PIN must be exactly 4 digits.");
      }
    }
  };

  return (
    <div className="p-6 space-y-8 bg-neutral-950 min-h-screen">
      <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>

      <div className="space-y-4">
        <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">Security</h2>
        
        <button 
          onClick={handleTogglePin}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex items-center justify-between group active:bg-neutral-800"
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${pin ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {pin ? <Shield size={20} /> : <ShieldOff size={20} />}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">PIN Lock</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">
                {pin ? 'App is protected' : 'Security disabled'}
              </p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${pin ? 'bg-emerald-500 text-neutral-950' : 'bg-rose-500 text-white'}`}>
            {pin ? 'Active' : 'Enable'}
          </div>
        </button>
      </div>

      <p className="text-[10px] text-neutral-600 font-bold uppercase text-center mt-20 tracking-widest">
        CoinSave v2.0.1 <br/> Personalized for Peter
      </p>
    </div>
  );
}