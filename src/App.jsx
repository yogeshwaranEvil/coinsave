// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BottomNav from './components/layout/BottomNav';
import Remittance from './pages/Remittance';
import Wealth from './pages/Wealth';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans sm:max-w-md sm:mx-auto sm:border-x sm:border-neutral-800 relative pb-24 shadow-2xl overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          {/* Placeholders for next step */}
          <Route path="/remittance" element={<Remittance />} />
          <Route path="/wealth" element={< Wealth />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;