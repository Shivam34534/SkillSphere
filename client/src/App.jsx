import React, { useState } from 'react';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, Sparkles, Briefcase, Zap, Trophy, UserCheck, Home as HomeIcon, Layout, Info, Users, X, Shield, Menu, Bell } from 'lucide-react';
import { SocketProvider } from './context/SocketContext';
import NotificationBell from './components/NotificationBell';

function Navigation() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);
  
  return (
    <>
    <header className="mobile-header">
      <Link to="/" className="logo mb-0 text-xl" onClick={closeMenu}>
        <div className="logo-icon new-logo w-8 h-8">
           <Sparkles size={16} color="white" />
        </div>
        <span>SkillSphere</span>
      </Link>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white bg-white/5 rounded-xl border border-white/10">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>

    <nav className={`glass-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
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
        <Link to="/" className="nav-link" onClick={closeMenu}><HomeIcon size={18} /> Home</Link>
        <Link to="/barter-hub" className="nav-link" onClick={closeMenu}><Sparkles size={18} /> Barter Hub</Link>
        <Link to="/marketplace" className="nav-link" onClick={closeMenu}><Users size={18} /> Marketplace</Link>
        <Link to="/gigs" className="nav-link" onClick={closeMenu}><Briefcase size={18} /> Gigs</Link>
        <Link to="/leaderboard" className="nav-link" onClick={closeMenu}><Trophy size={18} /> Leaderboard</Link>
        {user?.role === 'ADMIN' && <Link to="/admin" className="nav-link" onClick={closeMenu}><Shield size={18} /> Admin Panel</Link>}
      </div>
    </div>

    <div className="nav-group">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-4 mb-2 block">Platform</span>
      <div className="nav-links">
        <a href="/#features" className="nav-link" onClick={closeMenu}><Layout size={18} /> Features</a>
        <a href="/#roles" className="nav-link" onClick={closeMenu}><Users size={18} /> Roles</a>
        <a href="/#how-it-works" className="nav-link" onClick={closeMenu}><Info size={18} /> How it works</a>
      </div>
    </div>

    {user && (
      <div className="nav-group">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-4 mb-2 block">Personal</span>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link" onClick={closeMenu}><Zap size={18} /> Dashboard</Link>
          <Link to="/wallet" className="nav-link" onClick={closeMenu}><WalletIcon size={18} /> Wallet</Link>
          <Link to="/profile" className="nav-link" onClick={closeMenu}><UserCheck size={18} /> Profile</Link>
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
    {isMobileMenuOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[950] lg:hidden" onClick={closeMenu}></div>
    )}
    </>
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
