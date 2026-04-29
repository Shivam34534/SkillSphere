import React from 'react';
import { BookOpen, Users, Briefcase, Zap, Star, Shield, Search, ArrowRight, Video, FileText, Code, Palette, Presentation } from 'lucide-react';

const StudentDashboard = ({ user }) => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Student • {user.department} • Level {user.xpLevel} Beginner</p>
        </div>
        <div className="wallet-pill">
          <Zap size={16} color="#fbbf24" />
          <span>{user.walletBalance || 0} Credits</span>
          <span className="xp-badge">+{((user.xpLevel || 1) * 10)} XP</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Main Feed */}
        <div className="main-column" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          
          {/* Quick Actions */}
          <div className="action-cards" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className="glass-card" style={{padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)', borderColor: 'rgba(139, 92, 246, 0.2)'}}>
              <BookOpen size={24} color="#a855f7" style={{marginBottom: '1rem'}} />
              <h3>Learn a Skill</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>Find tutors and buy sessions</p>
              <button className="btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.85rem', width: '100%'}}>Browse Tutors</button>
            </div>
            <div className="glass-card" style={{padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', borderColor: 'rgba(16, 185, 129, 0.2)'}}>
              <Briefcase size={24} color="#10b981" style={{marginBottom: '1rem'}} />
              <h3>Teach & Earn</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>Offer your skills to peers</p>
              <button className="btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.85rem', width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>Create Micro-service</button>
            </div>
          </div>

          {/* Recommended Matches */}
          <div className="section-container">
            <h2 style={{fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Star size={20} color="#fbbf24" /> Skill Matches (Barter)</h2>
            <div className="glass-card" style={{padding: '1.5rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>A</div>
                  <div>
                    <h4 style={{margin: 0}}>Aisha Patel</h4>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Needs: React • Offers: UI Design</span>
                  </div>
                </div>
                <button className="btn-ghost" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>Exchange <ArrowRight size={14}/></button>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>R</div>
                  <div>
                    <h4 style={{margin: 0}}>Rahul K.</h4>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Needs: Python • Offers: Resume Building</span>
                  </div>
                </div>
                <button className="btn-ghost" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>Exchange <ArrowRight size={14}/></button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div className="glass-card" style={{padding: '1.5rem'}}>
            <h3 style={{fontSize: '1.1rem', marginBottom: '1rem'}}>Your Skills</h3>
            
            <div style={{marginBottom: '1rem'}}>
              <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Offering</span>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem'}}>
                {user.skillsToTeach?.length > 0 ? user.skillsToTeach.map((skill, i) => (
                  <span key={i} className="skill-badge" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem'}}>{skill}</span>
                )) : <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>None added yet</span>}
              </div>
            </div>

            <div>
              <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Learning</span>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem'}}>
                {user.skillsToLearn?.length > 0 ? user.skillsToLearn.map((skill, i) => (
                  <span key={i} className="skill-badge" style={{background: 'rgba(217, 70, 239, 0.1)', color: '#d946ef', border: '1px solid rgba(217, 70, 239, 0.2)', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem'}}>{skill}</span>
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
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Shield size={14} color="#3b82f6"/> Complete 2 more gigs to reach Learner level!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
