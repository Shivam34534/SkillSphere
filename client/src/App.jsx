import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MeetingRoom from './pages/MeetingRoom';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Leaderboard from './pages/Leaderboard';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon } from 'lucide-react';
import { SocketProvider } from './context/SocketContext';
import NotificationBell from './components/NotificationBell';

function Navigation() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  return (
    <nav className="glass-nav">
      <div className="nav-content">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="SkillSphere Logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <span>SkillSphere</span>
        </Link>
        <div className="nav-links">
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          <a href="/#features" className="nav-link">Features</a>
          <a href="/#how-it-works" className="nav-link">How it works</a>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <NotificationBell />
              <Link to="/wallet" className="nav-link flex items-center gap-2">
                <WalletIcon size={18} />
                <span>Wallet</span>
              </Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button className="btn-primary" onClick={handleLogout} style={{padding: '0.5rem 1.25rem', fontSize: '0.9rem'}}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" style={{ color: 'var(--text-main)' }}>Sign in</Link>
              <Link to="/signup">
                <button className="btn-primary" style={{padding: '0.5rem 1.25rem', fontSize: '0.9rem'}}>Get started</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <SocketProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app-container">
          <Navigation />
          
          <div style={{ paddingTop: '80px', width: '100%' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meeting/:id" element={<MeetingRoom />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
