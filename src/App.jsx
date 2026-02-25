// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';

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
import AddLoan from './pages/AddLoan'; // New
import LoanDetail from './pages/LoanDetail';
import LoanRepayment from './pages/LoanRepayment'; // New

// Assets & Wealth
import Assets from './pages/Assets';

function App() {
  return (
    <Router>
      {/* Using neutral-950 for deep dark mode. 
        pb-20 ensures content isn't hidden behind the bottom nav.
      */}
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans sm:max-w-md sm:mx-auto sm:border-x sm:border-neutral-800 relative pb-20 shadow-2xl overflow-x-hidden">
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
          
          {/* ⚙️ Settings */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
        
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;