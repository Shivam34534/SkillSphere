import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, Users, Briefcase, Zap, Star, Shield, Search, ArrowRight, Video, FileText, Code, Palette, Presentation, Plus } from 'lucide-react';

const StudentDashboard = () => {
  const { user, updateUser } = React.useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [services, setServices] = useState([]);
  const [showServices, setShowServices] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/matches', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Failed to fetch matches', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async () => {
    const userBEmail = window.prompt("Enter the exact email address of the student you want to match with:");
    if (!userBEmail) return;
    const skillOfferedByA = window.prompt("What skill are YOU offering?");
    const skillOfferedByB = window.prompt("What skill do they have that YOU need?");
    
    if (userBEmail && skillOfferedByA && skillOfferedByB) {
      try {
        const response = await fetch('http://localhost:5000/api/v1/matches', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}` 
          },
          body: JSON.stringify({ userBEmail, skillOfferedByA, skillOfferedByB, exchangeType: 'BARTER' })
        });
        
        if (response.ok) {
          alert('Match requested successfully!');
          fetchMatches();
        } else {
          const err = await response.json();
          alert('Error: ' + err.message);
        }
      } catch (error) {
        alert('Failed to create match');
      }
    }
  };

  const handleRespond = async (matchId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/matches/${matchId}/respond`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        alert('Responded to match!');
        fetchMatches();
      } else {
        const err = await response.json();
        alert('Error: ' + err.message);
      }
    } catch (error) {
      alert('Failed to respond');
    }
  };

  const handlePostService = async () => {
    const title = window.prompt("Service Title (e.g., 'React Tutoring'):");
    if (!title) return;
    const description = window.prompt("Service Description:");
    const category = window.prompt("Category (e.g., 'Web Dev'):");
    const amount = window.prompt("Price in Credits/Cash (e.g., 50):");
    
    if (title && description && category) {
      try {
        const response = await fetch('http://localhost:5000/api/v1/services', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}` 
          },
          body: JSON.stringify({ 
            title, description, category, 
            pricing: { type: 'CREDITS', amount: Number(amount) || 0 }
          })
        });
        
        if (response.ok) {
          alert('Service (Micro-service) posted successfully!');
        } else {
          const err = await response.json();
          alert('Error: ' + err.message);
        }
      } catch (error) {
        alert('Failed to post service');
      }
    }
  };

  const handleBrowseTutors = async () => {
    if (showServices) {
      setShowServices(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/v1/services', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data);
        setShowServices(true);
      }
    } catch (error) {
      alert('Failed to load tutors');
    }
  };
  const handlePurchase = async (serviceId, amount) => {
    if (user.walletBalance < amount) {
      alert(`You don't have enough credits. You need ${amount} credits.`);
      return;
    }
    
    if (window.confirm(`Buy this service for ${amount} Credits?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/services/${serviceId}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        });
        
        if (response.ok) {
          updateUser({ walletBalance: user.walletBalance - amount });
          
          // Force a page reload to update the Context and navbar instantly
          window.location.reload();
        } else {
          const data = await response.json();
          alert(data.message || 'Purchase failed');
        }
      } catch (error) {
        alert('An error occurred during purchase');
      }
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Student • {user.department} • Level {user.xpLevel} Beginner</p>
        </div>
        <div 
          className="wallet-pill" 
          onClick={() => {
            const amount = window.prompt("🚀 MVP TEST MODE: How many free credits do you want to add to your wallet?", "100");
            if (amount && !isNaN(amount)) {
              updateUser({ walletBalance: (user.walletBalance || 0) + parseInt(amount) });
              window.location.reload();
            }
          }}
          style={{cursor: 'pointer', transition: 'transform 0.2s'}}
          title="Click to add test credits!"
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
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
              <button onClick={handleBrowseTutors} className="btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.85rem', width: '100%'}}>{showServices ? "Hide Tutors" : "Browse Tutors"}</button>
            </div>
            <div className="glass-card" style={{padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', borderColor: 'rgba(16, 185, 129, 0.2)'}}>
              <Briefcase size={24} color="#10b981" style={{marginBottom: '1rem'}} />
              <h3>Teach & Earn</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>Offer your skills to peers</p>
              <button onClick={handlePostService} className="btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.85rem', width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>Create Micro-service</button>
            </div>
          </div>

          {/* Render Services if showServices is true */}
          {showServices && (
            <div className="section-container">
              <h2 style={{fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><BookOpen size={20} color="#a855f7" /> Available Tutors & Services</h2>
              <div className="glass-card" style={{padding: '1.5rem'}}>
                {services.length > 0 ? services.map((service, idx) => (
                  <div key={service._id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== services.length - 1 ? '1px solid var(--glass-border)' : 'none', paddingBottom: idx !== services.length - 1 ? '1rem' : 0, marginBottom: idx !== services.length - 1 ? '1rem' : 0}}>
                    <div>
                      <h4 style={{margin: 0, color: 'white'}}>{service.title} <span style={{fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>by {service.freelancerId?.name || 'Unknown'}</span></h4>
                      <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0'}}>{service.description}</p>
                      <span className="skill-badge" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#a855f7', fontSize: '0.7rem'}}>{service.category}</span>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontWeight: 'bold', color: '#fbbf24'}}>{service.pricing?.amount} {service.pricing?.type}</div>
                      <button className="btn-primary" style={{padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginTop: '0.5rem'}} onClick={() => handlePurchase(service._id, service.pricing?.amount)}>Buy</button>
                    </div>
                  </div>
                )) : (
                  <p style={{color: 'var(--text-muted)', textAlign: 'center'}}>No tutors found right now.</p>
                )}
              </div>
            </div>
          )}

          {/* Dynamic Matches Feed */}
          <div className="section-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h2 style={{fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Star size={20} color="#fbbf24" /> Your Skill Exchanges</h2>
              <button onClick={handleCreateMatch} className="btn-ghost" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem', border: '1px solid var(--glass-border)'}}>
                <Plus size={14} style={{marginRight: '0.3rem'}} /> Request Match
              </button>
            </div>

            <div className="glass-card" style={{padding: '1.5rem'}}>
              {loading ? (
                <p style={{color: 'var(--text-muted)', textAlign: 'center'}}>Loading matches...</p>
              ) : matches.length > 0 ? (
                matches.map((match, idx) => {
                  const isInitiator = match.userAId._id === user._id;
                  const otherUser = isInitiator ? match.userBId : match.userAId;
                  
                  return (
                    <div key={match._id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== matches.length - 1 ? '1px solid var(--glass-border)' : 'none', paddingBottom: idx !== matches.length - 1 ? '1rem' : 0, marginBottom: idx !== matches.length - 1 ? '1rem' : 0}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <div style={{width: '40px', height: '40px', borderRadius: '50%', background: isInitiator ? 'var(--secondary)' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{otherUser?.name?.charAt(0) || '?'}</div>
                        <div>
                          <h4 style={{margin: 0}}>{otherUser?.name || 'Unknown User'}</h4>
                          <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                            {isInitiator ? `You offer: ${match.skillOfferedByA} • They offer: ${match.skillOfferedByB}` : `They offer: ${match.skillOfferedByA} • You offer: ${match.skillOfferedByB}`}
                          </span>
                          <div style={{marginTop: '0.2rem', fontSize: '0.75rem', color: match.status === 'ACCEPTED' ? '#10b981' : 'var(--text-muted)'}}>
                            Status: {match.status} {match.meetingLink && <Link to={`/meeting/${match._id}`} style={{color: 'var(--primary)', marginLeft: '0.5rem', fontWeight: 'bold'}}>Join Meeting</Link>}
                          </div>
                        </div>
                      </div>
                      
                      {!isInitiator && match.status === 'PENDING' ? (
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <button onClick={() => handleRespond(match._id, 'ACCEPTED')} className="btn-primary" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#10b981'}}>Accept</button>
                          <button onClick={() => handleRespond(match._id, 'DECLINED')} className="btn-ghost" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444'}}>Decline</button>
                        </div>
                      ) : match.status === 'ACCEPTED' ? (
                        <Link to={`/meeting/${match._id}`}>
                          <button className="btn-primary" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--primary)'}}>
                            Join Call
                          </button>
                        </Link>
                      ) : (
                        <button className="btn-ghost" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: 0.5}} disabled>
                          {isInitiator && match.status === 'PENDING' ? 'Waiting...' : 'Closed'}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)'}}>
                  <p>You don't have any active skill matches yet.</p>
                  <p style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>Click "Request Match" to barter skills with another student!</p>
                </div>
              )}
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
            <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between'}}>
              Trust & Growth 
              <span style={{fontSize: '0.7rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '0.2rem 0.5rem', borderRadius: '10px'}}>
                Level {user.xpLevel || 1}
              </span>
            </h3>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Trust Score</span>
              <span style={{fontWeight: 'bold', color: '#10b981'}}>{user.trustScore || 50}/100</span>
            </div>
            <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'}}>
              <div style={{width: `${user.trustScore || 50}%`, height: '100%', background: '#10b981', transition: 'width 0.5s ease-out'}}></div>
            </div>
            
            <div style={{marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Gigs Completed</span>
              <span style={{fontWeight: 'bold', color: '#3b82f6'}}>{user.completedGigs || 0}</span>
            </div>

            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Shield size={14} color="#3b82f6"/> 
              {user.xpLevel >= 5 
                ? "Max level! You're a Campus Expert!" 
                : `Complete ${5 - ((user.completedGigs || 0) % 5)} more gigs to reach ${['Beginner', 'Learner', 'Contributor', 'Mentor', 'Campus Expert'][user.xpLevel || 1] || 'next'} level!`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
