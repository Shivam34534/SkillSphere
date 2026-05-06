import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Award, Zap, Shield, Search } from 'lucide-react';

const Leaderboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teachers'); // earners, teachers, clubs

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/leaderboard');
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-background-dark"><div className="spinner"></div></div>;

  const currentList = activeTab === 'earners' ? data?.topEarners : activeTab === 'teachers' ? data?.topTeachers : data?.topClubs;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-text-main mb-4 flex items-center justify-center gap-4">
          <Trophy className="text-yellow-400" size={48} />
          Campus Rankings
        </h1>
        <p className="text-text-muted text-lg">Top contributors, earners, and organizations on SkillSphere.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        {[
          { id: 'teachers', label: 'Top Teachers', icon: <Award size={18} /> },
          { id: 'earners', label: 'Top Earners', icon: <TrendingUp size={18} /> },
          { id: 'clubs', label: 'Top Clubs', icon: <Users size={18} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-3 px-8 rounded-full font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-white/5 text-text-muted hover:bg-white/10'
              }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Podiums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-end">
        {currentList?.slice(0, 3).map((user, idx) => {
          // Rank 2, 1, 3 order for visual podium
          const order = idx === 0 ? 'md:order-2' : idx === 1 ? 'md:order-1' : 'md:order-3';
          const height = idx === 0 ? 'h-64' : idx === 1 ? 'h-52' : 'h-44';
          const color = idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : 'text-amber-600';

          return (
            <div key={user._id} className={`flex flex-col items-center ${order}`}>
              <div className="relative mb-4">
                <div className={`w-24 h-24 rounded-full border-4 ${idx === 0 ? 'border-yellow-400' : 'border-glass-border'} overflow-hidden shadow-2xl`}>
                  <img src={user.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${idx === 0 ? 'bg-yellow-400' : 'bg-slate-700'} flex items-center justify-center text-black font-bold`}>
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
              <p className="text-xs text-text-muted uppercase tracking-widest mb-4">Level {user.xpLevel} {getLevelName(user.xpPoints || 0)}</p>

              <div className={`w-full ${height} glass-card flex flex-col items-center justify-center border-b-0 rounded-b-none p-6 relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-t ${idx === 0 ? 'from-yellow-400/20' : idx === 1 ? 'from-blue-400/20' : 'from-orange-400/20'} to-transparent opacity-50`}></div>
                {idx === 0 && <Crown className="text-yellow-400 mb-2 relative z-10" size={32} />}
                <span className={`text-2xl font-black ${color} relative z-10`}>
                  {activeTab === 'earners' ? `₹${user.walletBalance}` : activeTab === 'teachers' ? `${user.xpPoints} XP` : `${user.trustScore}% Trust`}
                </span>
                <span className="text-[10px] text-text-muted font-bold relative z-10">
                  {activeTab === 'earners' ? 'TOTAL EARNED' : activeTab === 'teachers' ? 'KNOWLEDGE SHARED' : 'COMMUNITY SCORE'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* List */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-text-muted text-xs uppercase font-bold">
            <tr>
              <th className="p-6">Rank</th>
              <th className="p-6">Student</th>
              <th className="p-6">Role</th>
              <th className="p-6">Level</th>
              <th className="p-6 text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border">
            {currentList?.map((user, idx) => (
              <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${idx < 3 ? 'bg-primary/20 text-primary' : 'text-text-muted'}`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-glass-border">
                      <img src={user.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-main group-hover:text-primary transition-colors">{user.name}</h4>
                      <div className="flex gap-1 mt-1">
                        {user.badges?.map((badge, i) => (
                          <span key={i} title={badge.name} className="text-xs">
                            {badge.icon || '🏅'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-xs py-1 px-3 rounded-full bg-white/5 border border-white/5 text-text-muted uppercase tracking-tighter">
                    {user.role}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(user.xpLevel / 10) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-text-main">Lvl {user.xpLevel}</span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <span className="font-bold text-xl text-text-main">
                    {activeTab === 'earners' ? `₹${user.walletBalance}` : activeTab === 'teachers' ? `${user.xpPoints}` : `${user.trustScore}%`}
                  </span>
                  <span className="text-[10px] text-text-muted ml-2">
                    {activeTab === 'earners' ? 'Credits' : activeTab === 'teachers' ? 'XP' : 'Score'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
