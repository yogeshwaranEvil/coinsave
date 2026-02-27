// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import BottomNav from './components/layout/BottomNav';
import LockScreen from './components/LockScreen'; // Import the new LockScreen

// Pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

// Transactions & Bills
import Transactions from './pages/Transactions';
import TransactionDetail from './pages/TransactionDetail';
import EditTransaction from './pages/EditTransaction';
import AddExpense from './pages/AddExpense';
import AddIncome from './pages/AddIncome';
import AddUpcoming from './pages/AddUpcoming';
import UpcomingBills from './pages/UpcomingBills';

// Cross-Border / Remittance
import Remittance from './pages/Remittance';
import AddRemittance from './pages/AddRemittance';
import RemittanceDetail from './pages/RemittanceDetail';
import EditRemittance from './pages/EditRemittance';

// Loans & Debt
import Loans from './pages/Loans';
import AddLoan from './pages/AddLoan';
import LoanDetail from './pages/LoanDetail';
import LoanRepayment from './pages/LoanRepayment';

// Assets & Wealth
import Assets from './pages/Assets';
import AddAsset from './pages/AddAsset';

function App() {
  const { isLocked, pin } = useAppStore();

  return (
    <Router>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans sm:max-w-md sm:mx-auto sm:border-x sm:border-neutral-800 relative pb-20 shadow-2xl overflow-x-hidden">
        
        {/* 🛡️ SECURITY LAYER 
            If a PIN is set and the app is in 'locked' state, 
            only the LockScreen will be visible.
        */}
        {pin && isLocked ? (
          <LockScreen />
        ) : (
          <>
            <Routes>
              {/* 🏠 Main Flow */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-expense" element={<AddExpense />} />
              <Route path="/add-income" element={<AddIncome />} />
              
              {/* 📊 Transactions & Bills */}
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transaction/:id" element={<TransactionDetail />} />
              <Route path="/edit-transaction/:id" element={<EditTransaction />} />
              <Route path="/upcoming-bills" element={<UpcomingBills />} />
              <Route path="/add-upcoming" element={<AddUpcoming />} />
              
              {/* 🌍 Cross-Border (Remittance) */}
              <Route path="/remittance" element={<Remittance />} />
              <Route path="/add-remittance" element={<AddRemittance />} />
              <Route path="/remittance/:id" element={<RemittanceDetail />} />
              <Route path="/edit-remittance/:id" element={<EditRemittance />} />

              {/* 🏦 Loans & Debts */}
              <Route path="/loans" element={<Loans />} />
              <Route path="/add-loan" element={<AddLoan />} />
              <Route path="/loan/:id" element={<LoanDetail />} />
              <Route path="/pay-loan/:id" element={<LoanRepayment />} />
              
              {/* 🪙 Assets & Wealth */}
              <Route path="/assets" element={<Assets />} />
              <Route path="/add-asset" element={<AddAsset />} />

              {/* ⚙️ Settings */}
              <Route path="/settings" element={<Settings />} />
            </Routes>
            
            <BottomNav />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;