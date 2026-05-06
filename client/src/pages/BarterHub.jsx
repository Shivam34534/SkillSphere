import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { API_URL } from '../config';
import { 
  Users, Zap, Star, Shield, ArrowRight, CheckCircle, 
  XCircle, Clock, Video, Award, Sparkles, MessageCircle, ArrowUpRight, Inbox
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
      <div className="p-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
           <Zap size={32} className="text-primary" />
        </div>
        <p className="text-text-muted font-bold tracking-widest uppercase text-xs">Calibrating your smart matches...</p>
      </div>
    );
  }

  const pendingRequests = matches.filter(m => m.status === 'PENDING' && m.userBId?._id === user?._id);
  const activeSessions = matches.filter(m => m.status === 'ACCEPTED');

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in-up pb-20">
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
           <Sparkles size={14} /> Peer-to-Peer Exchange
        </div>
        <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">Barter <span className="gradient-text">Hub</span></h1>
        <p className="text-lg text-text-muted max-w-2xl leading-relaxed">Exchange skills, build trust, and grow together without spending a single credit. The true campus economy starts here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Suggestions & Requests */}
        <div className="lg:col-span-2 flex flex-col gap-16">
          
          {/* Smart Match Suggestions */}
          <section>
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                 <Zap size={24} className="text-primary" /> Smart Matches
               </h2>
               <button onClick={fetchData} className="text-xs font-bold text-primary hover:underline">Refresh Suggestions</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suggestions.length > 0 ? suggestions.map(s => (
                <div key={s._id} className="glass-card group p-8 flex flex-col justify-between hover:border-primary/50 transition-all relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-background-dark border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                        <img src={s.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{s.name}</h4>
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-black uppercase tracking-widest border border-success/20">Trust {s.trustScore}%</span>
                           <span className="text-[10px] text-text-muted font-bold">Lvl {s.xpLevel}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-4 mb-8 border border-white/5">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                         <Sparkles size={10} /> Optimal Exchange
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {s.mutualInterest.map((skill, i) => (
                          <span key={i} className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/10">{skill}</span>
                        ))}
                        {s.mutualOffer.map((skill, i) => (
                          <span key={i} className="text-[10px] font-bold bg-accent/10 text-accent px-3 py-1 rounded-lg border border-accent/10">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRequest(s, user.skillsToTeach[0], s.skillsToTeach[0])}
                    className="relative z-10 btn-primary w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 group/btn"
                  >
                    Propose Barter <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              )) : (
                <div className="col-span-full empty-state py-20">
                  <div className="empty-state-icon"><Inbox size={32} /></div>
                  <h3 className="text-xl font-bold text-white mb-2">No Suggestions Yet</h3>
                  <p className="text-sm text-text-muted max-w-xs mx-auto">Update your profile skills to get high-accuracy barter matches!</p>
                </div>
              )}
            </div>
          </section>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <section className="animate-pulse-slow">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <MessageCircle size={24} className="text-yellow-500" /> Incoming Requests
              </h2>
              <div className="flex flex-col gap-4">
                {pendingRequests.map(req => (
                  <div key={req._id} className="glass-card p-8 flex flex-col md:flex-row items-center justify-between border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-2xl text-primary border border-primary/20 shadow-2xl">
                        {req.userAId?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{req.userAId?.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                           <span className="text-text-muted">Offers <span className="text-primary font-bold">{req.skillOfferedByA}</span></span>
                           <ArrowRight size={14} className="text-text-muted opacity-50" />
                           <span className="text-text-muted">Needs your <span className="text-accent font-bold">{req.skillOfferedByB}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <button onClick={() => handleResponse(req._id, 'ACCEPTED')} className="flex-1 md:flex-none py-3 px-8 rounded-xl bg-success text-white font-bold hover:scale-105 transition-all shadow-lg shadow-success/20">
                        Accept
                      </button>
                      <button onClick={() => handleResponse(req._id, 'DECLINED')} className="flex-1 md:flex-none py-3 px-8 rounded-xl bg-white/5 text-red-400 font-bold hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/10">
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Active Sessions */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Video size={24} className="text-success" /> Active Exchanges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeSessions.length > 0 ? activeSessions.map(session => {
                const isInitiator = session.userAId?._id === user?._id;
                const otherUser = isInitiator ? session.userBId : session.userAId;
                return (
                  <div key={session._id} className="glass-card p-8 border-success/30 bg-success/5 hover:bg-success/[0.08] transition-all">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10 font-bold text-lg">
                          {otherUser?.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{otherUser?.name}</h4>
                          <p className="text-[10px] text-success uppercase font-black tracking-widest flex items-center gap-1 mt-1">
                             <Clock size={10} /> Active Now
                          </p>
                        </div>
                      </div>
                      <span className="bg-success text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest animate-pulse">Live Session</span>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                       <a href={session.meetingLink} target="_blank" rel="noreferrer" className="btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2 bg-success hover:bg-success/90">
                          <Video size={18} /> Join Meeting Room
                       </a>
                       <button onClick={() => handleComplete(session._id)} className="w-full py-3 text-xs font-bold border border-success/30 text-success hover:bg-success hover:text-white transition-all rounded-xl">
                          Complete & Earn XP
                       </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full empty-state py-12">
                  <p className="text-sm text-text-muted">No active exchanges. Start matching to earn rewards!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: History & Stats */}
        <div className="flex flex-col gap-12">
           <section>
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold text-white">Activity</h2>
                 <Clock size={20} className="text-text-muted" />
              </div>
              <div className="glass-card overflow-hidden">
                 <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
                    {history.length > 0 ? history.map((h, i) => {
                      const otherUser = h.userAId?._id === user?._id ? h.userBId : h.userAId;
                      return (
                        <div key={h._id} className={`p-6 flex items-center gap-4 hover:bg-white/5 transition-all ${i !== history.length - 1 ? 'border-b border-white/5' : ''}`}>
                           <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-muted border border-white/10 font-bold">
                              {otherUser?.name?.charAt(0)}
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <h4 className="text-sm font-bold text-white mb-1 truncate">{otherUser?.name}</h4>
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="text-[9px] text-primary font-bold uppercase">{h.skillOfferedByA}</span>
                                 <ArrowRight size={8} className="text-text-muted" />
                                 <span className="text-[9px] text-accent font-bold uppercase">{h.skillOfferedByB}</span>
                              </div>
                              <span className="inline-block px-2 py-0.5 rounded bg-success/10 text-success text-[8px] font-black uppercase tracking-tighter border border-success/20">+50 XP</span>
                           </div>
                           <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                              <Award size={20} className="text-yellow-500" />
                           </div>
                        </div>
                      );
                    }) : (
                      <div className="p-20 text-center">
                         <p className="text-sm text-text-muted">History is empty.</p>
                      </div>
                    )}
                 </div>
              </div>
           </section>

           <div className="glass-card p-10 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Zap size={120} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-8 relative z-10">Network Pulse</h3>
              <div className="space-y-10 relative z-10">
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Campus Synergy</p>
                       <p className="text-4xl font-black text-white tracking-tighter">1,240+</p>
                       <p className="text-[10px] text-success font-bold mt-1 flex items-center gap-1">
                          <ArrowUpRight size={12} /> Live Exchanges
                       </p>
                    </div>
                    <Users size={48} className="text-primary opacity-30" />
                 </div>
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Trust Verified</p>
                       <p className="text-4xl font-black text-white tracking-tighter">85%</p>
                       <p className="text-[10px] text-text-muted font-bold mt-1">Platform Average</p>
                    </div>
                    <Shield size={48} className="text-accent opacity-30" />
                 </div>
              </div>
              <button className="w-full mt-12 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all text-sm">
                 View Synergy Map
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BarterHub;
