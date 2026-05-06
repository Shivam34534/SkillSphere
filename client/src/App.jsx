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
import PublicProfile from './pages/PublicProfile';
import Gigs from './pages/Gigs';
import GigDetails from './pages/GigDetails';
import BarterHub from './pages/BarterHub';
import AdminPanel from './pages/AdminPanel';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, Sparkles, Briefcase, Zap, Trophy, UserCheck, Home as HomeIcon, Layout, Info, Users, X, Shield } from 'lucide-react';
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
        <div className="flex flex-col gap-8">
          <Link to="/" className="logo">
            <div className="logo-icon new-logo">
               <Sparkles size={20} color="white" />
            </div>
            <span>SkillSphere</span>
          </Link>

          <div className="nav-group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-4 mb-2 block">Main Menu</span>
            <div className="nav-links">
              <Link to="/" className="nav-link"><HomeIcon size={18} /> Home</Link>
              <Link to="/barter-hub" className="nav-link"><Sparkles size={18} /> Barter Hub</Link>
              <Link to="/marketplace" className="nav-link"><Users size={18} /> Marketplace</Link>
              <Link to="/gigs" className="nav-link"><Briefcase size={18} /> Gigs</Link>
              <Link to="/leaderboard" className="nav-link"><Trophy size={18} /> Leaderboard</Link>
              {user?.role === 'ADMIN' && <Link to="/admin" className="nav-link"><Shield size={18} /> Admin Panel</Link>}
            </div>
          </div>

          <div className="nav-group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-4 mb-2 block">Platform</span>
            <div className="nav-links">
              <a href="/#features" className="nav-link"><Layout size={18} /> Features</a>
              <a href="/#how-it-works" className="nav-link"><Info size={18} /> How it works</a>
            </div>
          </div>

          {user && (
            <div className="nav-group">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-4 mb-2 block">Personal</span>
              <div className="nav-links">
                <Link to="/dashboard" className="nav-link"><Zap size={18} /> Dashboard</Link>
                <Link to="/wallet" className="nav-link"><WalletIcon size={18} /> Wallet</Link>
                <Link to="/profile" className="nav-link"><UserCheck size={18} /> Profile</Link>
              </div>
            </div>
          )}
        </div>

        <div className="nav-actions mt-auto">
          {user ? (
            <>
              <div className="px-4 mb-4">
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {user.name?.charAt(0)}
                       </div>
                       <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate w-24">{user.name}</p>
                          <p className="text-[10px] text-text-muted truncate w-24">Verified Student</p>
                       </div>
                    </div>
                    <NotificationBell />
                 </div>
              </div>
              <button className="btn-secondary w-full text-sm py-3" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" className="btn-secondary text-center py-3">Sign in</Link>
              <Link to="/signup" className="btn-primary text-center py-3">Get started</Link>
            </div>
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
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/barter-hub" element={<BarterHub />} />
              <Route path="/gigs" element={<Gigs />} />
              <Route path="/gigs/:id" element={<GigDetails />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meeting/:id" element={<MeetingRoom />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<PublicProfile />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
