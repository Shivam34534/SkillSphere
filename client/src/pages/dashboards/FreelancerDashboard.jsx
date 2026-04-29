import React from 'react';
import { Briefcase, DollarSign, Star, TrendingUp, Users, Activity, ExternalLink, CheckCircle } from 'lucide-react';

const FreelancerDashboard = ({ user }) => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Freelancer • Level {user.xpLevel} Rookie</p>
        </div>
        <div className="wallet-pill" style={{background: 'rgba(217, 70, 239, 0.1)', borderColor: 'rgba(217, 70, 239, 0.2)'}}>
          <DollarSign size={16} color="#d946ef" />
          <span style={{color: '#f5d0fe'}}>₹{user.walletBalance || 0} Earned</span>
          <span className="xp-badge" style={{background: '#d946ef'}}>+{user.xpLevel * 10} XP</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Main Feed */}
        <div className="main-column" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          
          {/* Quick Stats */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
            <div className="glass-card" style={{padding: '1.5rem', textAlign: 'center'}}>
              <h3 style={{fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'white'}}>0</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0}}>Active Orders</p>
            </div>
            <div className="glass-card" style={{padding: '1.5rem', textAlign: 'center'}}>
              <h3 style={{fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'white'}}>0</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0}}>Total Clients</p>
            </div>
            <div className="glass-card" style={{padding: '1.5rem', textAlign: 'center'}}>
              <h3 style={{fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#fbbf24'}}>0.0</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0}}>Average Rating</p>
            </div>
          </div>

          {/* Active Services */}
          <div className="section-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h2 style={{fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Briefcase size={20} color="#d946ef" /> Your Services</h2>
              <button className="btn-primary" style={{padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)'}}>+ Post New Service</button>
            </div>
            
            <div className="glass-card" style={{padding: '2rem', textAlign: 'center', borderStyle: 'dashed'}}>
              <p style={{color: 'var(--text-muted)', marginBottom: '1rem'}}>You haven't posted any services yet.</p>
              <button className="btn-ghost">Create your first service listing</button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="section-container">
            <h2 style={{fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Activity size={20} color="#3b82f6" /> Recent Orders</h2>
            <div className="glass-card" style={{padding: '1.5rem'}}>
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center'}}>No recent orders. Promote your profile to get clients!</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div className="glass-card" style={{padding: '1.5rem'}}>
            <h3 style={{fontSize: '1.1rem', marginBottom: '1rem'}}>Your Portfolio</h3>
            
            <div style={{marginBottom: '1rem'}}>
              <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Service Categories</span>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem'}}>
                {user.skillsToTeach?.length > 0 ? user.skillsToTeach.map((skill, i) => (
                  <span key={i} className="skill-badge" style={{background: 'rgba(217, 70, 239, 0.1)', color: '#d946ef', border: '1px solid rgba(217, 70, 239, 0.2)', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem'}}>{skill}</span>
                )) : <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>None added yet</span>}
              </div>
            </div>

            <button className="btn-ghost full-width" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
              <ExternalLink size={16} /> Link Portfolio
            </button>
          </div>

          <div className="glass-card" style={{padding: '1.5rem'}}>
            <h3 style={{fontSize: '1.1rem', marginBottom: '1rem'}}>Trust & Growth</h3>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Trust Score</span>
              <span style={{fontWeight: 'bold', color: '#10b981'}}>{user.trustScore}/100</span>
            </div>
            <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'}}>
              <div style={{width: `${user.trustScore}%`, height: '100%', background: '#10b981'}}></div>
            </div>
            <div style={{marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem'}}>
              <p style={{fontSize: '0.85rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle size={14} color="#10b981"/> College Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
