import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { Trophy, Crown, TrendingUp, Users, Award, Zap, Inbox } from 'lucide-react';

const Leaderboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teachers'); // earners, teachers, clubs

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/leaderboard`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelName = (xp) => {
    if (xp >= 500) return 'Expert';
    if (xp >= 200) return 'Mentor';
    return 'Beginner';
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="spinner"></div></div>;

  const currentList = activeTab === 'earners' ? data?.topEarners : activeTab === 'teachers' ? data?.topTeachers : data?.topClubs;

  return (
    <div className="leaderboard-container px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="feature-tag mb-4">RANKINGS</div>
        <h1 className="text-4xl md:text-6xl font-black mb-6">
          Campus <span className="gradient-text">Elite.</span>
        </h1>
        <p className="text-text-muted max-w-2xl text-base md:text-lg">
          Recognizing the top contributors, highest earners, and most active clubs in the SkillSphere ecosystem.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-16 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { id: 'teachers', label: 'Top Teachers', icon: <Award size={18} /> },
          { id: 'earners', label: 'Top Earners', icon: <TrendingUp size={18} /> },
          { id: 'clubs', label: 'Top Clubs', icon: <Users size={18} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-3 px-8 rounded-full font-bold transition-all whitespace-nowrap text-sm ${
              activeTab === tab.id 
              ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
              : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Podiums */}
      {currentList?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
          {/* 2nd Place */}
          {currentList[1] && (
            <div className="flex flex-col items-center order-2 md:order-1">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl p-1 bg-white/5">
                  <img src={currentList[1].profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentList[1].name}`} alt="" className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-slate-500 flex items-center justify-center text-white font-black text-xs shadow-lg">2</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{currentList[1].name}</h3>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mb-6">Level {currentList[1].xpLevel}</p>
              <div className="w-full h-40 feature-card p-6 flex flex-col items-center justify-center border-b-0 rounded-b-none bg-gradient-to-t from-blue-500/10 to-transparent">
                 <span className="text-2xl font-black text-white mb-1">
                    {activeTab === 'earners' ? `₹${currentList[1].walletBalance}` : activeTab === 'teachers' ? `${currentList[1].xpPoints}` : `${currentList[1].trustScore}%`}
                 </span>
                 <span className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">
                    {activeTab === 'earners' ? 'EARNINGS' : activeTab === 'teachers' ? 'XP POINTS' : 'TRUST SCORE'}
                 </span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {currentList[0] && (
            <div className="flex flex-col items-center order-1 md:order-2">
              <div className="relative mb-8">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                   <Crown className="text-yellow-400 animate-bounce" size={40} />
                </div>
                <div className="w-32 h-32 rounded-[2rem] border-4 border-yellow-400/50 overflow-hidden shadow-[0_0_50px_rgba(250,204,21,0.2)] p-1.5 bg-white/5">
                  <img src={currentList[0].profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentList[0].name}`} alt="" className="w-full h-full object-cover rounded-[1.5rem]" />
                </div>
                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl bg-yellow-400 flex items-center justify-center text-black font-black text-sm shadow-xl">1</div>
              </div>
              <h3 className="text-2xl font-black text-white mb-1">{currentList[0].name}</h3>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mb-8">Level {currentList[0].xpLevel} EXPERT</p>
              <div className="w-full h-56 feature-card p-8 flex flex-col items-center justify-center border-b-0 rounded-b-none bg-gradient-to-t from-yellow-400/10 to-transparent scale-105 z-10">
                 <span className="text-3xl font-black text-yellow-400 mb-2">
                    {activeTab === 'earners' ? `₹${currentList[0].walletBalance}` : activeTab === 'teachers' ? `${currentList[0].xpPoints}` : `${currentList[0].trustScore}%`}
                 </span>
                 <span className="text-[11px] text-text-muted font-bold uppercase tracking-widest">
                    {activeTab === 'earners' ? 'EARNINGS' : activeTab === 'teachers' ? 'XP POINTS' : 'TRUST SCORE'}
                 </span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {currentList[2] && (
            <div className="flex flex-col items-center order-3 md:order-3">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl p-1 bg-white/5">
                  <img src={currentList[2].profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentList[2].name}`} alt="" className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-orange-700 flex items-center justify-center text-white font-black text-xs shadow-lg">3</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{currentList[2].name}</h3>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mb-6">Level {currentList[2].xpLevel}</p>
              <div className="w-full h-32 feature-card p-6 flex flex-col items-center justify-center border-b-0 rounded-b-none bg-gradient-to-t from-orange-500/10 to-transparent">
                 <span className="text-2xl font-black text-white mb-1">
                    {activeTab === 'earners' ? `₹${currentList[2].walletBalance}` : activeTab === 'teachers' ? `${currentList[2].xpPoints}` : `${currentList[2].trustScore}%`}
                 </span>
                 <span className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">
                    {activeTab === 'earners' ? 'EARNINGS' : activeTab === 'teachers' ? 'XP POINTS' : 'TRUST SCORE'}
                 </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List Table */}
      <div className="feature-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Rank</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">User</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Role</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Experience</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentList?.map((user, idx) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${idx < 3 ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/5 text-text-muted border border-white/5'}`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="p-6">
                    <Link to={`/profile/${user._id}`} className="flex items-center gap-4 group/user no-underline">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover/user:border-primary transition-all p-0.5 bg-white/5">
                        <img src={user.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover/user:text-primary transition-colors">{user.name}</h4>
                        <div className="flex gap-1 mt-1">
                          {user.badges?.slice(0, 3).map((badge, i) => (
                            <span key={i} title={badge.name} className="text-[10px] opacity-60">
                              {badge.icon || '🏅'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-text-muted">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[100px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${Math.min((user.xpLevel / 10) * 100, 100)}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-white">Lvl {user.xpLevel}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-black text-white">
                        {activeTab === 'earners' ? `₹${user.walletBalance}` : activeTab === 'teachers' ? `${user.xpPoints}` : `${user.trustScore}%`}
                      </span>
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter">
                        {activeTab === 'earners' ? 'CREDITS' : activeTab === 'teachers' ? 'XP' : 'TRUST'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {(!currentList || currentList.length === 0) && (
                <tr>
                   <td colSpan="5" className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                         <Inbox size={48} className="text-text-muted/20" />
                         <p className="text-text-muted font-bold">No rankings available yet.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
