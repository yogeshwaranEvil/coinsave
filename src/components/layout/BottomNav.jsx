// src/components/layout/BottomNav.jsx
import { Home, ListOrdered, Send, Wallet } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'History', path: '/transactions', icon: ListOrdered },
    { name: 'Remit', path: '/remittance', icon: Send },
    { name: 'Wealth', path: '/wealth', icon: Wallet },
  ];

  return (
    <div className="fixed bottom-0 w-full sm:max-w-md bg-neutral-900/90 backdrop-blur-md border-t border-neutral-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}