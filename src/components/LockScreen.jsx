// src/components/LockScreen.jsx
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Lock, ShieldCheck, XCircle } from 'lucide-react';

export default function LockScreen() {
  const { pin, unlock } = useAppStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (num) => {
    if (input.length < 4) {
      const newPath = input + num;
      setInput(newPath);
      
      if (newPath.length === 4) {
        if (newPath === pin) {
          unlock();
        } else {
          setError(true);
          setTimeout(() => { setInput(''); setError(false); }, 600);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-neutral-950 flex flex-col items-center justify-center p-8">
      <div className={`mb-12 transition-all duration-300 ${error ? 'text-rose-500 animate-bounce' : 'text-indigo-500'}`}>
        {error ? <XCircle size={64} /> : <Lock size={64} />}
      </div>

      <h2 className="text-white font-black uppercase tracking-[0.3em] text-sm mb-2">Secure Entry</h2>
      <p className="text-neutral-500 text-[10px] uppercase font-bold mb-8">Enter your 4-digit PIN</p>

      {/* PIN DOTS */}
      <div className="flex gap-4 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
            input.length >= i ? 'bg-white border-white scale-110' : 'border-neutral-800'
          }`} />
        ))}
      </div>

      {/* KEYPAD */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((key, i) => (
          <button
            key={i}
            onClick={() => key === 'del' ? setInput(input.slice(0, -1)) : key !== '' && handlePress(key)}
            className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold active:bg-neutral-800 transition-colors ${
              key === '' ? 'pointer-events-none' : 'text-white'
            }`}
          >
            {key === 'del' ? <span className="text-xs uppercase font-black">Clear</span> : key}
          </button>
        ))}
      </div>
    </div>
  );
}