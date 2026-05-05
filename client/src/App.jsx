import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MeetingRoom from './pages/MeetingRoom';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

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
          <Link to="/marketplace">Marketplace</Link>
          <a href="/#features">Features</a>
          <a href="/#how-it-works">How it works</a>
          <a href="/#roles">Roles</a>
          <a href="/#pricing">Pricing</a>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/profile" style={{color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', marginRight: '1rem'}}>Profile</Link>
              <span style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center'}}>{user.name}</span>
              <button className="btn-primary" onClick={handleLogout} style={{padding: '0.5rem 1.25rem', fontSize: '0.9rem', marginLeft: '1rem'}}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{color: '#f8f8fa', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500'}}>Sign in</Link>
              <Link to="/signup"><button className="btn-primary" style={{padding: '0.5rem 1.25rem', fontSize: '0.9rem'}}>Get started</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
