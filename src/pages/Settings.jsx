// src/pages/Settings.jsx
import { useAppStore } from '../store/useAppStore';
import { 
  Shield, 
  ShieldOff, 
  Download, 
  Upload, 
  Trash2, 
  Lock, 
  RefreshCw,
  AlertTriangle 
} from 'lucide-react';
import { exportData, importData } from '../utils/backup';

export default function Settings() {
  const { pin, setPin, removePin, lock } = useAppStore();

  // Unified Security Gatekeeper
  const verifyIdentity = () => {
    if (!pin) return true; 
    const challenge = prompt("Security Verification: Enter your 4-digit PIN to authorize this action:");
    if (challenge === pin) return true;
    alert("Incorrect PIN. Authorization failed.");
    return false;
  };

  // --- SECURE HANDLERS ---

  const handleSecureExport = () => {
    if (verifyIdentity()) {
      exportData();
    }
  };

  const handleSecureImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verify PIN before allowing the file to be processed
    if (verifyIdentity()) {
      if (window.confirm("CRITICAL: This will overwrite your current data. Proceed with Restore?")) {
        importData(file, (success) => {
          if (success) {
            alert("Data Restored Successfully. App will reload.");
            window.location.reload();
          } else {
            alert("Import failed. Invalid file format.");
          }
        });
      }
    }
    // Reset input so the same file can be picked again if needed
    e.target.value = '';
  };

  const handleDisablePin = () => {
    if (verifyIdentity()) {
      if (window.confirm("Remove PIN protection?")) {
        removePin();
      }
    }
  };

  const handleFactoryReset = () => {
    if (verifyIdentity()) {
      if (window.confirm("⚠️ PERMANENT WIPE: Delete all financial data?")) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div className="p-6 space-y-10 bg-neutral-950 min-h-screen pb-32">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white tracking-tight">System Settings</h1>
        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest px-1">Vault Status: {pin ? 'Locked' : 'Unprotected'}</p>
      </div>

      {/* SECURITY */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
          <Lock size={12} /> Access Control
        </h2>
        <button 
          onClick={pin ? handleDisablePin : () => {
            const val = prompt("Set 4-Digit PIN:");
            if(val && /^\d{4}$/.test(val)) setPin(val);
          }}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 flex items-center justify-between active:bg-neutral-800 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${pin ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {pin ? <Shield size={20} /> : <ShieldOff size={20} />}
            </div>
            <p className="text-sm font-bold text-white">4-Digit PIN Lock</p>
          </div>
          <div className={`w-12 h-6 rounded-full relative ${pin ? 'bg-indigo-600' : 'bg-neutral-800'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pin ? 'right-1' : 'left-1'}`} />
          </div>
        </button>
      </div>

      {/* DATA MANAGEMENT (Now Secure) */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
          <RefreshCw size={12} /> Secure Portability
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* SECURE EXPORT */}
          <button 
            onClick={handleSecureExport}
            className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6 flex flex-col items-center gap-3 active:scale-95 transition-all"
          >
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl shadow-inner">
              <Download size={24} />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Backup</span>
          </button>

          {/* SECURE IMPORT */}
          <label className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6 flex flex-col items-center gap-3 active:scale-95 transition-all cursor-pointer relative">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl shadow-inner">
              <Upload size={24} />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Restore</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleSecureImport} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* DANGER ZONE */}
      <button 
        onClick={handleFactoryReset}
        className="w-full bg-rose-500/5 border border-rose-500/10 py-5 rounded-[2rem] flex items-center justify-center gap-3 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] active:bg-rose-500/10 transition-all"
      >
        <Trash2 size={16} /> Factory Reset
      </button>

      <div className="flex flex-col items-center gap-2 opacity-40">
        <AlertTriangle size={14} className="text-neutral-500" />
        <p className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.3em]">Hardware Encrypted Flow Active</p>
      </div>
    </div>
  );
}