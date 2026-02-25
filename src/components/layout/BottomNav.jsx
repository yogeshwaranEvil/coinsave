// src/components/layout/BottomNav.jsx
import { Home, ListOrdered, Send, Landmark, Coins, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide BottomNav on detail screens and forms to give them full focus
  const hideOnRoutes = ['/add-expense', '/add-income', '/add-remittance'];
  if (hideOnRoutes.includes(location.pathname) || location.pathname.includes('/transaction/') || location.pathname.includes('/loan/')) {
    return null; 
  }

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'History', path: '/transactions', icon: ListOrdered },
    { name: 'Remit', path: '/remittance', icon: Send },
    { name: 'Loans', path: '/loans', icon: Landmark },
    { name: 'Assets', path: '/assets', icon: Coins },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 w-full sm:max-w-md bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800 pb-safe z-50">
      <div className="grid grid-cols-6 items-center h-16 px-1">
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
              <span className="text-[9px] font-medium tracking-wide">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}