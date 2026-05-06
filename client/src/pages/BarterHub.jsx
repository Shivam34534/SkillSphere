import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { API_URL } from '../config';
import { 
  Users, Zap, ArrowRight, Video, Award, Sparkles, MessageCircle, ArrowUpRight, Inbox, Clock, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BarterHub = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [suggestions, setSuggestions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sugRes, matchRes, histRes] = await Promise.all([
        fetch(`${API_URL}/matches/suggestions`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/matches`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/matches/history`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (sugRes.ok) setSuggestions(await sugRes.json());
      if (matchRes.ok) setMatches(await matchRes.json());
      if (histRes.ok) setHistory(await histRes.json());
    } catch (error) {
      console.error('Failed to fetch barter data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (targetUser, offer, need) => {
    try {
      const response = await fetch(`${API_URL}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userBEmail: targetUser.email,
          skillOfferedByA: offer,
          skillOfferedByB: need,
          exchangeType: 'BARTER'
        })
      });
      if (response.ok) {
        alert('Barter request sent!');
        fetchData();
      }
    } catch (error) {
      alert('Request failed');
    }
  };

  const handleResponse = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/matches/${id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchData();
    } catch (error) {
      alert('Action failed');
    }
  };

  const handleComplete = async (id) => {
    if (window.confirm('Mark this session as complete? XP rewards will be distributed.')) {
      try {
        const response = await fetch(`${API_URL}/matches/${id}/complete`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) fetchData();
      } catch (error) {
        alert('Completion failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
         <div className="icon-box new-feature-icon w-20 h-20 rounded-3xl animate-bounce mb-8">
            <Zap size={32} color="white" />
         </div>
         <p className="text-text-muted font-black tracking-widest uppercase text-xs">Synchronizing your campus synergy...</p>
      </div>
    );
  }

  const pendingRequests = matches.filter(m => m.status === 'PENDING' && m.userBId?._id === user?._id);
  const activeSessions = matches.filter(m => m.status === 'ACCEPTED');

  return (
    <div className="barter-hub-container px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col mb-16">
        <div className="feature-tag mb-4">P2P EXCHANGE</div>
        <h1 className="text-4xl md:text-6xl font-black mb-6">
          Barter <span className="gradient-text">Hub.</span>
        </h1>
        <p className="text-text-muted max-w-2xl text-base md:text-lg">
          Exchange skills directly with peers. No credits, no cash—just knowledge sharing and community trust.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* Smart Matches */}
          <section>
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                 <Zap size={24} className="text-primary" /> Smart Matches
               </h2>
               <button onClick={fetchData} className="text-xs font-bold text-primary hover:underline">Refresh</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suggestions.length > 0 ? suggestions.map(s => (
                <div key={s._id} className="feature-card p-8 flex flex-col justify-between group h-full">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all p-0.5 bg-white/5">
                        <img src={s.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt="" className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{s.name}</h4>
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 rounded-lg bg-success/10 text-success text-[10px] font-black uppercase tracking-widest border border-success/20">Trust {s.trustScore}%</span>
                           <span className="text-[10px] text-text-muted font-bold">Lvl {s.xpLevel}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-4 mb-8 border border-white/5">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-3">Optimal Exchange</p>
                      <div className="flex flex-wrap gap-2">
                        {s.mutualInterest.map((skill, i) => (
                          <span key={i} className="text-[9px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/10 uppercase">{skill}</span>
                        ))}
                        {s.mutualOffer.map((skill, i) => (
                          <span key={i} className="text-[9px] font-bold bg-accent/10 text-accent px-3 py-1 rounded-lg border border-accent/10 uppercase">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRequest(s, user.skillsToTeach[0], s.skillsToTeach[0])}
                    className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Propose Barter <ArrowRight size={14} />
                  </button>
                </div>
              )) : (
                <div className="col-span-full py-20 feature-card flex flex-col items-center">
                  <Inbox size={48} className="text-text-muted/20 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-2">No suggestions</h3>
                  <p className="text-sm text-text-muted">Update your skills to find matches.</p>
                </div>
              )}
            </div>
          </section>

          {/* Active Exchanges */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Video size={24} className="text-success" /> Active Exchanges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeSessions.length > 0 ? activeSessions.map(session => {
                const otherUser = session.userAId?._id === user?._id ? session.userBId : session.userAId;
                return (
                  <div key={session._id} className="feature-card p-8 border-success/30 bg-success/5 h-full">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10 font-bold">
                          {otherUser?.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{otherUser?.name}</h4>
                          <span className="text-[9px] text-success font-black uppercase tracking-widest">Live Session</span>
                        </div>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-success animate-ping"></div>
                    </div>
                    
                    <div className="space-y-4">
                       <a href={session.meetingLink} target="_blank" rel="noreferrer" className="btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2 bg-success hover:bg-success/90">
                          Join Meeting
                       </a>
                       <button onClick={() => handleComplete(session._id)} className="w-full py-3 text-xs font-bold border border-success/30 text-success hover:bg-success hover:text-white transition-all rounded-xl">
                          Complete Exchange
                       </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full py-12 feature-card border-dashed border-white/10 flex items-center justify-center">
                  <p className="text-sm text-text-muted">No active live sessions.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-12">
           <section>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                 <Clock size={20} className="text-text-muted" /> Activity
              </h2>
              <div className="feature-card p-0 overflow-hidden divide-y divide-white/5">
                {history.length > 0 ? history.map((h, i) => {
                  const otherUser = h.userAId?._id === user?._id ? h.userBId : h.userAId;
                  return (
                    <div key={h._id} className="p-6 flex items-center gap-4 hover:bg-white/5 transition-all">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted border border-white/10 font-bold text-xs">
                          {otherUser?.name?.charAt(0)}
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <h4 className="text-sm font-bold text-white truncate">{otherUser?.name}</h4>
                          <div className="flex items-center gap-2">
                             <span className="text-[8px] text-primary font-black uppercase tracking-tighter">{h.skillOfferedByA}</span>
                             <ArrowRight size={8} className="text-text-muted" />
                             <span className="text-[8px] text-accent font-black uppercase tracking-tighter">{h.skillOfferedByB}</span>
                          </div>
                       </div>
                       <span className="text-[10px] font-black text-success">+50 XP</span>
                    </div>
                  );
                }) : (
                  <div className="p-12 text-center text-text-muted text-sm italic">No recent activity.</div>
                )}
              </div>
           </section>

           {/* Pulse Stats */}
           <div className="feature-card p-10 bg-gradient-to-br from-primary/20 to-transparent relative overflow-hidden group">
              <Zap className="absolute -bottom-10 -right-10 text-primary/5 group-hover:scale-150 transition-transform duration-1000" size={200} />
              <h3 className="text-2xl font-black text-white mb-8">Campus Pulse</h3>
              <div className="space-y-8 relative z-10">
                 <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Live Swaps</p>
                    <p className="text-4xl font-black text-white tracking-tighter">1.2K+</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Trust Average</p>
                    <p className="text-4xl font-black text-white tracking-tighter">8.5<span className="text-lg">/10</span></p>
                 </div>
              </div>
              <Link to="/leaderboard" className="w-full mt-10 btn-secondary py-4 text-center block text-sm font-bold">View Rankings</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BarterHub;
