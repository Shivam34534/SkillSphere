import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../store/slices/authSlice';
import { BookOpen, Users, Briefcase, Zap, Star, Shield, Search, ArrowRight, Video, FileText, Code, Palette, Presentation, Plus, Activity, Inbox, Clock } from 'lucide-react';

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
    <div className="dashboard-content animate-fade-in-up">
      <div className="dashboard-header flex-col md:flex-row items-start md:items-end gap-6 mb-12">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Howdy, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-text-muted text-lg">Your campus learning hub is buzzing today.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/wallet"
            className="wallet-pill px-6 py-3 bg-white/5 hover:bg-white/10 transition-all border border-white/10"
          >
            <Zap size={20} className="text-yellow-400" />
            <span className="text-lg font-bold">{user.walletBalance || 0} Credits</span>
          </Link>
          <div className="bg-primary/20 text-primary px-4 py-3 rounded-2xl border border-primary/20 flex flex-col items-center min-w-[80px]">
             <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Level</span>
             <span className="text-xl font-black">{user.xpLevel || 1}</span>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="stats-grid mb-12">
        <div className="stat-card">
          <div className="stat-card-glow bg-primary"></div>
          <div className="relative z-10">
            <span className="text-text-muted text-sm font-medium mb-1 block">Active Matches</span>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">{matches.length}</span>
              <span className="text-success text-xs font-bold mb-2">+2 this week</span>
            </div>
            <div className="chart-container mt-4">
               {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                 <div key={i} className="chart-bar" style={{ height: `${h}%` }}></div>
               ))}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-glow bg-secondary"></div>
          <div className="relative z-10">
            <span className="text-text-muted text-sm font-medium mb-1 block">Trust Score</span>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">{user.trustScore || 50}%</span>
              <span className="text-secondary text-xs font-bold mb-2">Top 10%</span>
            </div>
            <div className="mt-6 w-full h-2 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full" style={{ width: `${user.trustScore || 50}%` }}></div>
            </div>
            <p className="text-[10px] text-text-muted mt-4 italic">Higher score attracts better skill partners.</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-glow bg-accent"></div>
          <div className="relative z-10">
            <span className="text-text-muted text-sm font-medium mb-1 block">Credits Earned</span>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">{user.completedGigs * 50 || 0}</span>
              <span className="text-accent text-xs font-bold mb-2">Lifetime</span>
            </div>
            <div className="flex gap-2 mt-8">
               <Activity size={16} className="text-accent" />
               <span className="text-xs text-text-muted">Rank #12 in {user.department}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-column">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <button onClick={handleBrowseTutors} className="group glass-card p-8 text-left hover:border-primary/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen size={80} />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Learn a New Skill</h3>
              <p className="text-sm text-text-muted leading-relaxed">Browse tutors, buy sessions, and grow your expertise today.</p>
              <div className="mt-6 flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-4 transition-all">
                Explore Marketplace <ArrowRight size={16} />
              </div>
            </button>

            <button onClick={handlePostService} className="group glass-card p-8 text-left hover:border-success/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={80} />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center text-success mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Teach & Earn Credits</h3>
              <p className="text-sm text-text-muted leading-relaxed">Offer what you know. Earn credits you can spend on other skills.</p>
              <div className="mt-6 flex items-center gap-2 text-success text-sm font-bold group-hover:gap-4 transition-all">
                Create Listing <ArrowRight size={16} />
              </div>
            </button>
          </div>

          {/* Active Exchanges */}
          <div className="section-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3"><Star className="text-yellow-400" /> Active Exchanges</h2>
              <button onClick={handleCreateMatch} className="btn-primary flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-2 px-4">
                <Plus size={18} /> New Request
              </button>
            </div>

            {loading ? (
              <div className="empty-state animate-pulse">
                <div className="empty-state-icon"><Clock size={32} /></div>
                <p>Loading your exchanges...</p>
              </div>
            ) : matches.length > 0 ? (
              <div className="flex flex-col gap-4">
                {matches.map((match) => {
                  const isInitiator = match.userAId._id === user._id;
                  const otherUser = isInitiator ? match.userBId : match.userAId;
                  return (
                    <div key={match._id} className="glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:bg-white/[0.03] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                           <img src={otherUser?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.name}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">{otherUser?.name || 'Unknown User'}</h4>
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[10px] uppercase tracking-widest font-black text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                              {isInitiator ? match.skillOfferedByA : match.skillOfferedByB}
                            </span>
                            <ArrowRight size={12} className="text-text-muted" />
                            <span className="text-[10px] uppercase tracking-widest font-black text-secondary px-2 py-0.5 bg-secondary/10 rounded-md">
                              {isInitiator ? match.skillOfferedByB : match.skillOfferedByA}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                          match.status === 'ACCEPTED' ? 'bg-success/10 text-success border-success/20' : 
                          match.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {match.status}
                        </div>
                        {!isInitiator && match.status === 'PENDING' ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleRespond(match._id, 'ACCEPTED')} className="p-2 bg-success text-white rounded-xl hover:scale-110 transition-transform"><Plus size={18}/></button>
                            <button onClick={() => handleRespond(match._id, 'DECLINED')} className="p-2 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Plus size={18} className="rotate-45"/></button>
                          </div>
                        ) : match.status === 'ACCEPTED' ? (
                          <Link to={`/meeting/${match._id}`}>
                            <button className="btn-primary py-2 px-6 bg-primary shadow-lg shadow-primary/20 flex items-center gap-2">
                              <Video size={16} /> Join
                            </button>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><Inbox size={32} /></div>
                <h3 className="text-xl font-bold text-white mb-2">No Exchanges Yet</h3>
                <p className="text-text-muted max-w-xs mx-auto mb-8">Start bartering skills with your peers to earn XP and build your network.</p>
                <button onClick={handleCreateMatch} className="btn-primary py-3 px-8">Find a Skill Partner</button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar flex flex-col gap-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-white mb-6">Profile Strength</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-text-muted font-bold uppercase tracking-widest">XP Progression</span>
                  <span className="text-xs font-bold text-white">{user.xpPoints % 500}/500</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full animate-pulse-slow" style={{ width: `${((user.xpPoints % 500) / 500) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-text-muted mt-2 text-right">{500 - (user.xpPoints % 500)} XP to next level</p>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Top Badges</h4>
                <div className="flex flex-wrap gap-3">
                  {user.badges?.length > 0 ? user.badges.slice(0, 4).map((badge, i) => (
                    <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-primary/20 transition-all cursor-help" title={badge.name}>
                      {badge.icon || '🏅'}
                    </div>
                  )) : (
                    <div className="text-[10px] text-text-muted italic">Complete your first exchange to earn a badge!</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 bg-gradient-to-br from-accent/5 to-transparent">
             <h3 className="text-xl font-bold text-white mb-4">Skill Network</h3>
             <p className="text-sm text-text-muted mb-6">You're connected with peers from {user.department} and {user.collegeName}.</p>
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent"><Users size={16}/></div>
                   <span className="text-sm font-medium text-white">42 Active Peers</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center text-success"><Activity size={16}/></div>
                   <span className="text-sm font-medium text-white">Top 5% in {user.department}</span>
                </div>
             </div>
             <button className="btn-secondary w-full mt-8 py-3 text-sm">View Leaderboard</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
