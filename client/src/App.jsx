import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MeetingRoom from './pages/MeetingRoom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="glass-nav">
      <div className="nav-content">
        <Link to="/" className="logo">
          <div className="logo-icon new-logo"><Sparkles size={18} color="white" /></div>
          <span>SkillSphere</span>
        </Link>
        <div className="nav-links">
          <a href="/#features">Features</a>
          <a href="/#how-it-works">How it works</a>
          <a href="/#roles">Roles</a>
          <a href="/#pricing">Pricing</a>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <span style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center'}}>{user.name}</span>
              <button className="btn-primary" onClick={handleLogout} style={{padding: '0.5rem 1.25rem', fontSize: '0.9rem'}}>Log Out</button>
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
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navigation />
          
          <div style={{ paddingTop: '80px', width: '100%' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meeting/:id" element={<MeetingRoom />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
