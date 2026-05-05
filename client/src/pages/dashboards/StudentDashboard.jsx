import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../store/slices/authSlice';
import { BookOpen, Users, Briefcase, Zap, Star, Shield, Search, ArrowRight, Video, FileText, Code, Palette, Presentation, Plus } from 'lucide-react';

const StudentDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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
        headers: { Authorization: `Bearer ${token}` }
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
            Authorization: `Bearer ${token}` 
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
          Authorization: `Bearer ${token}` 
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
            Authorization: `Bearer ${token}` 
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
        headers: { Authorization: `Bearer ${token}` }
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
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          dispatch(updateUser({ walletBalance: user.walletBalance - amount }));
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
              dispatch(updateUser({ walletBalance: (user.walletBalance || 0) + parseInt(amount) }));
            }
          }}
          title="Click to add test credits!"
        >
          <Zap size={16} color="#fbbf24" />
          <span>{user.walletBalance || 0} Credits</span>
          <span className="xp-badge">+{((user.xpLevel || 1) * 10)} XP</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Main Feed */}
        <div className="main-column">
          
          {/* Quick Actions */}
          <div className="action-cards">
            <div className="glass-card" style={{padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)', borderColor: 'rgba(139, 92, 246, 0.2)'}}>
              <BookOpen size={24} color="#a855f7" style={{marginBottom: '1rem'}} />
              <h3>Learn a Skill</h3>
              <p className="text-sm text-text-muted mb-4">Find tutors and buy sessions</p>
              <button onClick={handleBrowseTutors} className="btn-primary w-full py-2 text-sm">{showServices ? "Hide Tutors" : "Browse Tutors"}</button>
            </div>
            <div className="glass-card" style={{padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', borderColor: 'rgba(16, 185, 129, 0.2)'}}>
              <Briefcase size={24} color="#10b981" style={{marginBottom: '1rem'}} />
              <h3>Teach & Earn</h3>
              <p className="text-sm text-text-muted mb-4">Offer your skills to peers</p>
              <button onClick={handlePostService} className="btn-primary w-full py-2 text-sm" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>Create Micro-service</button>
            </div>
          </div>

          {/* Render Services if showServices is true */}
          {showServices && (
            <div className="section-container">
              <h2 className="flex items-center gap-2"><BookOpen size={20} color="#a855f7" /> Available Tutors & Services</h2>
              <div className="glass-card p-6">
                {services.length > 0 ? services.map((service, idx) => (
                  <div key={service._id} className={`flex justify-between items-center ${idx !== services.length - 1 ? 'border-b border-glass-border pb-4 mb-4' : ''}`}>
                    <div>
                      <h4 className="m-0 text-text-main">{service.title} <span className="text-[10px] text-text-muted font-normal uppercase tracking-wider ml-2">by {service.freelancerId?.name || 'Unknown'}</span></h4>
                      <p className="text-sm text-text-muted my-1">{service.description}</p>
                      <span className="skill-badge bg-primary/10 text-primary text-[10px]">{service.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-400">{service.pricing?.amount} {service.pricing?.type}</div>
                      <button className="btn-primary py-1 px-3 text-xs mt-2" onClick={() => handlePurchase(service._id, service.pricing?.amount)}>Buy</button>
                    </div>
                  </div>
                )) : (
                  <p className="text-text-muted text-center">No tutors found right now.</p>
                )}
              </div>
            </div>
          )}

          {/* Dynamic Matches Feed */}
          <div className="section-container">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center gap-2"><Star size={20} color="#fbbf24" /> Your Skill Exchanges</h2>
              <button onClick={handleCreateMatch} className="btn-ghost py-1.5 px-3 text-sm border border-glass-border">
                <Plus size={14} className="mr-1" /> Request Match
              </button>
            </div>

            <div className="glass-card p-6">
              {loading ? (
                <p className="text-text-muted text-center">Loading matches...</p>
              ) : matches.length > 0 ? (
                matches.map((match, idx) => {
                  const isInitiator = match.userAId._id === user._id;
                  const otherUser = isInitiator ? match.userBId : match.userAId;
                  
                  return (
                    <div key={match._id} className={`flex justify-between items-center ${idx !== matches.length - 1 ? 'border-b border-glass-border pb-4 mb-4' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isInitiator ? 'bg-secondary' : 'bg-primary'}`}>{otherUser?.name?.charAt(0) || '?'}</div>
                        <div>
                          <h4 className="m-0 text-text-main">{otherUser?.name || 'Unknown User'}</h4>
                          <span className="text-xs text-text-muted">
                            {isInitiator ? `You offer: ${match.skillOfferedByA} • They offer: ${match.skillOfferedByB}` : `They offer: ${match.skillOfferedByA} • You offer: ${match.skillOfferedByB}`}
                          </span>
                          <div className={`mt-1 text-[10px] font-semibold ${match.status === 'ACCEPTED' ? 'text-success' : 'text-text-muted'}`}>
                            {match.status} {match.meetingLink && <Link to={`/meeting/${match._id}`} className="text-primary ml-2 underline">Join Meeting</Link>}
                          </div>
                        </div>
                      </div>
                      
                      {!isInitiator && match.status === 'PENDING' ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleRespond(match._id, 'ACCEPTED')} className="btn-primary py-1.5 px-3 text-xs bg-success">Accept</button>
                          <button onClick={() => handleRespond(match._id, 'DECLINED')} className="btn-ghost py-1.5 px-3 text-xs text-red-500">Decline</button>
                        </div>
                      ) : match.status === 'ACCEPTED' ? (
                        <Link to={`/meeting/${match._id}`}>
                          <button className="btn-primary py-1.5 px-3 text-xs bg-primary">
                            Join Call
                          </button>
                        </Link>
                      ) : (
                        <button className="btn-ghost py-1.5 px-3 text-xs opacity-50 cursor-not-allowed" disabled>
                          {isInitiator && match.status === 'PENDING' ? 'Waiting...' : 'Closed'}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <p>You don't have any active skill matches yet.</p>
                  <p className="text-xs mt-2">Click "Request Match" to barter skills with another student!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="glass-card p-6">
            <h3 className="text-lg mb-4">Your Skills</h3>
            
            <div className="mb-4">
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Offering</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skillsToTeach?.length > 0 ? user.skillsToTeach.map((skill, i) => (
                  <span key={i} className="skill-badge bg-success/10 text-success border border-success/20">{skill}</span>
                )) : <span className="text-xs text-text-muted">None added yet</span>}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Learning</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skillsToLearn?.length > 0 ? user.skillsToLearn.map((skill, i) => (
                  <span key={i} className="skill-badge bg-secondary/10 text-secondary border border-secondary/20">{skill}</span>
                )) : <span className="text-xs text-text-muted">None added yet</span>}
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg mb-4 flex justify-between items-center">
              Trust & Growth 
              <span className="text-[10px] bg-accent/20 text-accent py-1 px-2 rounded-lg">
                Level {user.xpLevel || 1}
              </span>
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">Trust Score</span>
              <span className="font-bold text-success">{user.trustScore || 50}/100</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-success transition-all duration-500" style={{width: `${user.trustScore || 50}%`}}></div>
            </div>
            
            <div className="mt-6 flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">Gigs Completed</span>
              <span className="font-bold text-accent">{user.completedGigs || 0}</span>
            </div>

            <p className="text-[10px] text-text-muted mt-4 flex items-center gap-2 leading-relaxed">
              <Shield size={12} className="text-accent"/> 
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
