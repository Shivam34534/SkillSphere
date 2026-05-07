import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../store/slices/authSlice';
import { API_URL } from '../../config';
import { BookOpen, Users, Zap, Star, ArrowRight, Video, Activity, Inbox, Clock, Plus, MessageSquare, Award } from 'lucide-react';
import MatchRequestModal from '../../components/MatchRequestModal';

const StudentDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`, {
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

  const handleCreateMatch = (data) => {
    setIsModalOpen(true);
  };

  const submitMatchRequest = async (data) => {
    setModalLoading(true);
    try {
      const response = await fetch(`${API_URL}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, exchangeType: 'BARTER' })
      });

      if (response.ok) {
        alert('Match requested successfully!');
        setIsModalOpen(false);
        fetchMatches();
      } else {
        const err = await response.json();
        alert('Error: ' + err.message);
      }
    } catch (error) {
      alert('Failed to create match');
    } finally {
      setModalLoading(false);
    }
  };

  const handleRespond = async (matchId, status) => {
    try {
      const response = await fetch(`${API_URL}/matches/${matchId}/respond`, {
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

  return (
    <div className="dashboard-container px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <div className="feature-tag mb-4">STUDENT COMMAND</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Howdy, <span className="gradient-text">{user.name.split(' ')[0]}!</span> 👋
          </h1>
          <p className="text-text-muted max-w-xl text-base md:text-lg leading-relaxed">
            Welcome back to your campus synergy hub. Here's what's happening in your network.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Link to="/wallet" className="feature-card p-4 flex items-center gap-4 bg-white/5 border-white/10 hover:border-primary/50 transition-all no-underline">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center text-yellow-400">
                 <Zap size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-text-muted">Balance</p>
                 <p className="text-xl font-black text-white">{user.walletBalance || 0} Credits</p>
              </div>
           </Link>
           <div className="feature-card p-4 flex items-center gap-4 bg-primary/10 border-primary/20">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                 <Award size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-text-muted">Rank</p>
                 <p className="text-xl font-black text-white">Lvl {user.xpLevel || 1}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="feature-card p-8 bg-gradient-to-br from-primary/10 to-transparent">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Active Exchanges</p>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl font-black text-white">{matches.length}</span>
            <span className="text-success text-xs font-bold mb-2">+2 this week</span>
          </div>
          <div className="flex gap-1 h-8 items-end">
             {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
               <div key={i} className="flex-1 bg-primary/30 rounded-t-sm" style={{ height: `${h}%` }}></div>
             ))}
          </div>
        </div>

        <div className="feature-card p-8 bg-gradient-to-br from-accent/10 to-transparent">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Trust Rating</p>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl font-black text-white">{user.trustScore || 50}%</span>
            <span className="text-accent text-xs font-bold mb-2">Top Tier</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-accent to-primary" style={{ width: `${user.trustScore || 50}%` }}></div>
          </div>
        </div>

        <div className="feature-card p-8 bg-gradient-to-br from-secondary/10 to-transparent">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">XP Progression</p>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl font-black text-white">{user.xpPoints || 0}</span>
            <span className="text-secondary text-xs font-bold mb-2">Lifetime</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted text-xs">
             <Activity size={14} className="text-secondary" />
             <span>Rank #12 in {user.department || 'Campus'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Quick Nav */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/marketplace" className="feature-card p-8 group no-underline">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Seek Mastery</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-6">Browse verified student mentors and hire them for private sessions.</p>
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                 Marketplace <ArrowRight size={14} />
              </div>
            </Link>

            <Link to="/gigs" className="feature-card p-8 group no-underline">
              <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center text-success mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Launch Services</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-6">Offer your unique skills to the campus and earn credits or barter.</p>
              <div className="flex items-center gap-2 text-success font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                 Post Gig <ArrowRight size={14} />
              </div>
            </Link>
          </div>

          {/* Matches List */}
          <section>
            <div className="flex justify-between items-center mb-8 px-2">
               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Star className="text-yellow-400" /> Live Matches
               </h2>
               <button onClick={handleCreateMatch} className="btn-secondary px-6 py-2.5 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                  <Plus size={16} /> New Request
               </button>
            </div>

            {loading ? (
              <div className="feature-card p-20 flex flex-col items-center gap-4 animate-pulse">
                <Clock size={48} className="text-text-muted/20" />
                <p className="text-text-muted font-bold">Synchronizing matches...</p>
              </div>
            ) : matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => {
                  const isInitiator = match.userAId?._id === user?._id;
                  const otherUser = isInitiator ? match.userBId : match.userAId;
                  return (
                    <div key={match._id} className="feature-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 group">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary transition-all p-0.5 bg-white/5">
                           <img src={otherUser?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.name}`} alt="" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{otherUser?.name || 'Unknown User'}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase text-primary bg-primary/10 px-2 py-1 rounded-md">
                              {isInitiator ? match.skillOfferedByA : match.skillOfferedByB}
                            </span>
                            <ArrowRight size={12} className="text-text-muted" />
                            <span className="text-[9px] font-black uppercase text-accent bg-accent/10 px-2 py-1 rounded-md">
                              {isInitiator ? match.skillOfferedByB : match.skillOfferedByA}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                        <span className={`text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full border ${
                          match.status === 'ACCEPTED' ? 'bg-success/10 text-success border-success/20' : 
                          match.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {match.status}
                        </span>
                        {!isInitiator && match.status === 'PENDING' ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleRespond(match._id, 'ACCEPTED')} className="w-10 h-10 bg-success text-white rounded-xl hover:scale-110 transition-transform flex items-center justify-center"><Plus size={20}/></button>
                            <button onClick={() => handleRespond(match._id, 'DECLINED')} className="w-10 h-10 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><Plus size={20} className="rotate-45"/></button>
                          </div>
                        ) : match.status === 'ACCEPTED' ? (
                          <Link to={`/meeting/${match._id}`} className="no-underline">
                            <button className="btn-primary py-3 px-8 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                              <Video size={16} /> Enter Room
                            </button>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="feature-card p-20 flex flex-col items-center text-center gap-4">
                <Inbox size={64} className="text-text-muted/10" />
                <h3 className="text-2xl font-bold text-white">Silence in the Hub</h3>
                <p className="text-text-muted max-w-xs mb-6">No active exchanges yet. Why not initiate a skill swap with a fellow student?</p>
                <button onClick={handleCreateMatch} className="btn-primary px-10 py-4 text-xs">Begin Exploration</button>
              </div>
            )}
          </section>
        </div>

        {/* Right Rail */}
        <div className="space-y-12">
          <div className="feature-card p-8">
            <h3 className="text-xl font-bold text-white mb-8">Reputation Pulse</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3 items-end">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">XP Progression</span>
                  <span className="text-xs font-black text-white">{user.xpPoints % 500}/500</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-primary via-accent to-secondary" style={{ width: `${((user.xpPoints % 500) / 500) * 100}%` }}></div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-6">Premier Badges</p>
                <div className="flex flex-wrap gap-4">
                  {user.badges?.length > 0 ? user.badges.slice(0, 4).map((badge, i) => (
                    <div key={i} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl hover:bg-primary/20 transition-all cursor-help hover:-translate-y-1" title={badge.name}>
                      {badge.icon || '🏅'}
                    </div>
                  )) : (
                    <p className="text-xs text-text-muted italic">Complete your first mission to earn a badge.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card p-10 bg-gradient-to-br from-accent/10 to-transparent border-accent/20 group relative overflow-hidden">
             <MessageSquare className="absolute -bottom-10 -right-10 text-accent/5 group-hover:scale-150 transition-transform duration-1000" size={150} />
             <h3 className="text-2xl font-black text-white mb-6">Network Pulse</h3>
             <p className="text-sm text-text-muted mb-8 leading-relaxed relative z-10">You're currently connected with peers from {user.department || 'across campus'}. Trust verified and ready to exchange.</p>
             <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent"><Users size={20}/></div>
                   <div>
                      <p className="text-base font-bold text-white">42 Peers</p>
                      <p className="text-[9px] font-black text-text-muted uppercase">Active Links</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center text-success"><Activity size={20}/></div>
                   <div>
                      <p className="text-base font-bold text-white">Top 5%</p>
                      <p className="text-[9px] font-black text-text-muted uppercase">In Department</p>
                   </div>
                </div>
             </div>
             <Link to="/leaderboard" className="w-full mt-12 btn-secondary py-4 text-center block text-xs font-black uppercase tracking-widest no-underline">View Leaderboard</Link>
          </div>
        </div>
      </div>

      <MatchRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={submitMatchRequest}
        loading={modalLoading}
      />
    </div>
  );
};

export default StudentDashboard;
