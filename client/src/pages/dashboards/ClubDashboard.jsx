import React from 'react';
import { Building, Users, Calendar, Target, DollarSign, ArrowRight, Activity, Plus } from 'lucide-react';

const ClubDashboard = ({ user }) => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Club / Organization • Verified Campus Org</p>
        </div>
        <div className="wallet-pill" style={{background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)'}}>
          <Users size={16} color="#3b82f6" />
          <span style={{color: '#bfdbfe'}}>Manage Community</span>
          <span className="xp-badge" style={{background: '#3b82f6'}}>+{user.xpLevel * 10} XP</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Main Feed */}
        <div className="main-column" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          
          {/* Quick Actions */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className="glass-card" style={{padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)', borderColor: 'rgba(59, 130, 246, 0.2)'}}>
              <Target size={24} color="#3b82f6" style={{marginBottom: '1rem'}} />
              <h3>Post Opportunity</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>Find talent for events/projects</p>
              <button className="btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.85rem', width: '100%', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>Create Post</button>
            </div>
            <div className="glass-card" style={{padding: '1.5rem', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)', borderColor: 'rgba(236, 72, 153, 0.2)'}}>
              <Calendar size={24} color="#ec4899" style={{marginBottom: '1rem'}} />
              <h3>Plan Event</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>Organize workshops & fests</p>
              <button className="btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.85rem', width: '100%', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'}}>Schedule Event</button>
            </div>
          </div>

          {/* Active Campaigns / Posts */}
          <div className="section-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h2 style={{fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Activity size={20} color="#3b82f6" /> Active Recruitments</h2>
            </div>
            <div className="glass-card" style={{padding: '1.5rem'}}>
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center'}}>No active posts right now. Start recruiting volunteers or freelancers!</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div className="glass-card" style={{padding: '1.5rem'}}>
            <h3 style={{fontSize: '1.1rem', marginBottom: '1rem'}}>Organization Profile</h3>
            
            <div style={{marginBottom: '1rem'}}>
              <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Talent We Need</span>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem'}}>
                {user.skillsToLearn?.length > 0 ? user.skillsToLearn.map((skill, i) => (
                  <span key={i} className="skill-badge" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem'}}>{skill}</span>
                )) : <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>None added yet</span>}
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;
