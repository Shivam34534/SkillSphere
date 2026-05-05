import React from 'react';
import { useSelector } from 'react-redux';
import { Shield, AlertTriangle, Users, Database, Activity, Lock } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>System Administrator • Governance Portal</p>
        </div>
        <div className="wallet-pill" style={{background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)'}}>
          <Shield size={16} color="#ef4444" />
          <span style={{color: '#fca5a5'}}>God Mode</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-column" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
            <div className="glass-card" style={{padding: '1.5rem', textAlign: 'center'}}>
              <h3 style={{fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'white'}}>1,245</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0}}>Total Users</p>
            </div>
            <div className="glass-card" style={{padding: '1.5rem', textAlign: 'center'}}>
              <h3 style={{fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'white'}}>89</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0}}>Pending Verifications</p>
            </div>
            <div className="glass-card" style={{padding: '1.5rem', textAlign: 'center'}}>
              <h3 style={{fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#ef4444'}}>2</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0}}>Active Disputes</p>
            </div>
          </div>

          <div className="section-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h2 style={{fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertTriangle size={20} color="#fbbf24" /> Requires Action</h2>
            </div>
            <div className="glass-card" style={{padding: '1.5rem'}}>
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center'}}>No pending critical alerts.</p>
            </div>
          </div>
        </div>

        <div className="sidebar" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div className="glass-card" style={{padding: '1.5rem'}}>
            <h3 style={{fontSize: '1.1rem', marginBottom: '1rem'}}>Quick Links</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <button className="btn-ghost" style={{textAlign: 'left', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Users size={16}/> Manage Users</button>
              <button className="btn-ghost" style={{textAlign: 'left', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Database size={16}/> System Logs</button>
              <button className="btn-ghost" style={{textAlign: 'left', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Lock size={16}/> Security Controls</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
