import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, Zap, Star, Shield, ArrowRight, CheckCircle, 
  XCircle, Clock, Video, Award, Sparkles, MessageCircle 
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
        fetch('http://localhost:5000/api/v1/matches/suggestions', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/v1/matches', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/v1/matches/history', { headers: { Authorization: `Bearer ${token}` } })
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
      const response = await fetch('http://localhost:5000/api/v1/matches', {
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
      const response = await fetch(`http://localhost:5000/api/v1/matches/${id}/respond`, {
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
        const response = await fetch(`http://localhost:5000/api/v1/matches/${id}/complete`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) fetchData();
      } catch (error) {
        alert('Completion failed');
      }
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="spinner mx-auto"></div></div>;

  const pendingRequests = matches.filter(m => m.status === 'PENDING' && m.userBId?._id === user?._id);
  const activeSessions = matches.filter(m => m.status === 'ACCEPTED');

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-white mb-4">Barter <span className="gradient-text">Hub</span></h1>
        <p className="text-lg text-text-muted">Exchange skills, build trust, and grow together without spending a single credit.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Suggestions & Requests */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* Smart Match Suggestions */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles size={24} className="text-primary" /> Smart Match Suggestions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.length > 0 ? suggestions.map(s => (
                <div key={s._id} className="glass-card p-6 flex flex-col justify-between hover:border-primary/50 transition-all">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-background-dark border border-white/10">
                        <img src={s.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt="" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{s.name}</h4>
                        <p className="text-[10px] text-text-muted flex items-center gap-1 uppercase tracking-widest font-black">
                          <Shield size={10} className="text-success" /> Trust {s.trustScore}% • Level {s.xpLevel}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-3 mb-4">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Mutual Interest</p>
                      <div className="flex flex-wrap gap-2">
                        {s.mutualInterest.map((skill, i) => (
                          <span key={i} className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-lg">{skill}</span>
                        ))}
                        {s.mutualOffer.map((skill, i) => (
                          <span key={i} className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-lg">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRequest(s, user.skillsToTeach[0], s.skillsToTeach[0])}
                    className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
                  >
                    <Users size={14} /> Propose Barter
                  </button>
                </div>
              )) : (
                <div className="col-span-full glass-card p-10 text-center border-dashed">
                  <Clock size={32} className="mx-auto mb-4 text-white/10" />
                  <p className="text-sm text-text-muted">Updating skills helps us find better matches for you!</p>
                </div>
              )}
            </div>
          </section>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageCircle size={24} className="text-yellow-500" /> Incoming Requests
              </h2>
              <div className="flex flex-col gap-4">
                {pendingRequests.map(req => (
                  <div key={req._id} className="glass-card p-6 flex items-center justify-between border-yellow-500/30 bg-yellow-500/5 animate-pulse-slow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/20">
                        {req.userAId?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{req.userAId?.name}</h4>
                        <p className="text-xs text-text-muted">
                          Wants to exchange <span className="text-primary font-bold">{req.skillOfferedByA}</span> for your <span className="text-accent font-bold">{req.skillOfferedByB}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleResponse(req._id, 'ACCEPTED')} className="p-3 rounded-2xl bg-success/20 text-success hover:bg-success hover:text-white transition-all">
                        <CheckCircle size={20} />
                      </button>
                      <button onClick={() => handleResponse(req._id, 'DECLINED')} className="p-3 rounded-2xl bg-white/5 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                        <XCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Active Sessions */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Video size={24} className="text-success" /> Active Exchanges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSessions.length > 0 ? activeSessions.map(session => {
                const isInitiator = session.userAId?._id === user?._id;
                const otherUser = isInitiator ? session.userBId : session.userAId;
                return (
                  <div key={session._id} className="glass-card p-6 border-success/30 bg-success/5">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10">
                          {otherUser?.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{otherUser?.name}</h4>
                          <p className="text-[10px] text-text-muted">Session in progress</p>
                        </div>
                      </div>
                      <span className="bg-success text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Live</span>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                       <a href={session.meetingLink} target="_blank" rel="noreferrer" className="btn-primary py-3 text-xs flex items-center justify-center gap-2">
                          <Video size={14} /> Join Virtual Meeting
                       </a>
                       <button onClick={() => handleComplete(session._id)} className="btn-ghost py-3 text-xs border border-success/30 text-success hover:bg-success hover:text-white transition-all">
                          Mark as Completed
                       </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full py-10 text-center glass-card border-dashed">
                  <p className="text-sm text-text-muted">No active sessions at the moment.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: History & Stats */}
        <div className="flex flex-col gap-10">
           <section>
              <h2 className="text-xl font-bold text-white mb-6">Barter History</h2>
              <div className="glass-card overflow-hidden">
                 <div className="max-h-[500px] overflow-y-auto">
                    {history.length > 0 ? history.map((h, i) => {
                      const otherUser = h.userAId?._id === user?._id ? h.userBId : h.userAId;
                      return (
                        <div key={h._id} className={`p-4 flex items-center gap-4 ${i !== history.length - 1 ? 'border-b border-white/5' : ''}`}>
                           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted border border-white/10">
                              {otherUser?.name?.charAt(0)}
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <h4 className="text-xs font-bold text-white truncate">{otherUser?.name}</h4>
                              <p className="text-[10px] text-text-muted truncate">{h.skillOfferedByA} ⇄ {h.skillOfferedByB}</p>
                              <span className="text-[8px] text-success font-bold mt-1 block">+50 XP Earned</span>
                           </div>
                           <Award size={16} className="text-yellow-500 flex-shrink-0" />
                        </div>
                      );
                    }) : (
                      <div className="p-10 text-center">
                         <p className="text-xs text-text-muted">Your barter history is empty.</p>
                      </div>
                    )}
                 </div>
              </div>
           </section>

           <div className="glass-card p-8 border-primary/30 bg-primary/5">
              <h3 className="text-lg font-bold text-white mb-4">Platform Stats</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Total Exchanges</p>
                       <p className="text-2xl font-black text-white">1,240+</p>
                    </div>
                    <Users size={32} className="text-primary opacity-20" />
                 </div>
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Skills Mastered</p>
                       <p className="text-2xl font-black text-white">85</p>
                    </div>
                    <Star size={32} className="text-accent opacity-20" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BarterHub;
