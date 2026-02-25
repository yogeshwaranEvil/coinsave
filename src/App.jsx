// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';
import AddUpcoming from './pages/AddUpcoming';
import UpcomingBills from './pages/UpcomingBills';
// Add this import
import EditTransaction from './pages/EditTransaction';

// Add this inside your <Routes>
// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import TransactionDetail from './pages/TransactionDetail';
import AddExpense from './pages/AddExpense';
import AddIncome from './pages/AddIncome';
import Remittance from './pages/Remittance';
import AddRemittance from './pages/AddRemittance';
import Loans from './pages/Loans';
import LoanDetail from './pages/LoanDetail';
import Assets from './pages/Assets';
import Settings from './pages/Settings';
import RemittanceDetail from './pages/RemittanceDetail';
import EditRemittance from './pages/EditRemittance';


function App() {
  return (
    <Router>
      {/* Using neutral-950 for the deep dark mode. 
        pb-20 ensures content isn't hidden behind the 6-item bottom nav.
      */}
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans sm:max-w-md sm:mx-auto sm:border-x sm:border-neutral-800 relative pb-20 shadow-2xl overflow-x-hidden">
        <Routes>
          {/* 🏠 Main Flow */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/add-income" element={<AddIncome />} />
          <Route path="/upcoming-bills" element = {<UpcomingBills />} />
          {/* 📊 Transactions */}
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transaction/:id" element={<TransactionDetail />} />
          <Route path="/add-upcoming" element={<AddUpcoming />} />
          <Route path="/edit-transaction/:id" element={<EditTransaction />} />
          <Route path="/edit-remittance/:id" element={<EditRemittance />} />          {/* 🌍 Cross-Border */}
          <Route path="/remittance" element={<Remittance />} />
          <Route path="/add-remittance" element={<AddRemittance />} />
          <Route path="/remittance/:id" element={<RemittanceDetail />} />     
          {/* 🏦 Loans (Phase 2 UI) */}
          <Route path="/loans" element={<Loans />} />
          <Route path="/loan/:id" element={<LoanDetail />} />
          
          {/* 🪙 Assets (Phase 2 UI) */}
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