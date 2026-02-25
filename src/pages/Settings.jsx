// src/pages/Settings.jsx
import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Download, RefreshCw, Moon, Database, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Settings() {
  const { isAED, toggleCurrency } = useAppStore();
  const [autoFx, setAutoFx] = useState(true);
  const [biometrics, setBiometrics] = useState(true);

  // Toggle switch component for reuse
  const Toggle = ({ enabled, onToggle }) => (
    <div 
      onClick={onToggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabled ? 'bg-emerald-500' : 'bg-neutral-700'}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="p-5 space-y-6 animate-in fade-in duration-300 pb-24">
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        <SettingsIcon className="text-neutral-400" /> Settings
      </h1>

      {/* PREFERENCES */}
      <div className="space-y-2">
        <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-2">Preferences</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          
          <div className="flex justify-between items-center p-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <RefreshCw size={18} className="text-blue-400" />
              <div>
                <div className="text-sm font-semibold text-white">Default Base Currency</div>
                <div className="text-[10px] text-neutral-500">View app in AED or INR on launch</div>
              </div>
            </div>
            <button 
              onClick={toggleCurrency}
              className="bg-neutral-800 px-3 py-1 rounded-lg text-xs font-bold text-neutral-300 transition-colors"
            >
              {isAED ? 'AED' : 'INR'}
            </button>
          </div>

          <div className="flex justify-between items-center p-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-indigo-400" />
              <div>
                <div className="text-sm font-semibold text-white">Dark Mode</div>
                <div className="text-[10px] text-neutral-500">Forced for optimal viewing</div>
              </div>
            </div>
            <Toggle enabled={true} onToggle={() => {}} />
          </div>

          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <RefreshCw size={18} className="text-yellow-500" />
              <div>
                <div className="text-sm font-semibold text-white">Auto FX Rate Update</div>
                <div className="text-[10px] text-neutral-500">Fetch daily AED-INR exchange rates</div>
              </div>
            </div>
            <Toggle enabled={autoFx} onToggle={() => setAutoFx(!autoFx)} />
          </div>

        </div>
      </div>

      {/* SECURITY & DATA */}
      <div className="space-y-2">
        <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-2">Security & Data</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          
          <div className="flex justify-between items-center p-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-emerald-400" />
              <div>
                <div className="text-sm font-semibold text-white">Require PIN / Biometrics</div>
                <div className="text-[10px] text-neutral-500">Ask for PIN on app launch</div>
              </div>
            </div>
            <Toggle enabled={biometrics} onToggle={() => setBiometrics(!biometrics)} />
          </div>

          <div className="flex justify-between items-center p-4 border-b border-neutral-800 cursor-pointer hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <Download size={18} className="text-white" />
              <div>
                <div className="text-sm font-semibold text-white">Export to CSV</div>
                <div className="text-[10px] text-neutral-500">Download all transaction history</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-neutral-500" />
          </div>

          <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <Database size={18} className="text-rose-400" />
              <div>
                <div className="text-sm font-semibold text-rose-400">Backup / Restore</div>
                <div className="text-[10px] text-neutral-500">Manual database sync</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-neutral-500" />
          </div>

        </div>
      </div>

      <div className="text-center text-[10px] text-neutral-600 pt-4">
        Cross-Border Tracker v1.0.0
      </div>
    </div>
  );
}