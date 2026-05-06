import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, GraduationCap, Shield, Award, Github, Linkedin, Globe, MessageCircle, Star, Zap, Clock, UserCheck } from 'lucide-react';

const PublicProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, historyRes] = await Promise.all([
          fetch(`http://localhost:5000/api/v1/users/${id}`),
          fetch(`http://localhost:5000/api/v1/matches/user-history/${id}`)
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="spinner"></div></div>;
  if (!user) return <div className="p-20 text-center text-white text-2xl font-bold">User Not Found</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-700">
      {/* Header Card */}
      <div className="glass-card overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-primary/80 via-accent/80 to-primary/80 relative">
           <div className="absolute -bottom-16 left-8 flex items-end gap-6">
             <div className="w-32 h-32 rounded-3xl bg-background-dark border-4 border-background-dark shadow-2xl overflow-hidden">
                <img src={user.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
             </div>
             <div className="pb-4">
                <h1 className="text-4xl font-bold text-white mb-1">{user.name}</h1>
                <p className="text-white/80 flex items-center gap-2">
                  <GraduationCap size={16} /> {user.department} • {user.collegeName || 'SkillSphere Campus'}
                </p>
             </div>
           </div>
           <div className="absolute bottom-4 right-8 flex gap-3">
              <button className="btn-primary py-2 px-6 flex items-center gap-2">
                <MessageCircle size={18} /> Message
              </button>
           </div>
        </div>
        <div className="pt-20 px-8 pb-8 flex flex-wrap gap-12">
            <div className="flex items-center gap-2 text-text-muted">
               <Shield className="text-success" size={20} />
               <span className="text-sm font-bold uppercase tracking-widest">Verified Student</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
               <Zap className="text-primary" size={20} />
               <span className="text-sm font-bold uppercase tracking-widest">Lvl {user.xpLevel} {user.xpPoints >= 1000 ? 'Expert' : 'Mentor'}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
               <Star className="text-yellow-400" size={20} />
               <span className="text-sm font-bold uppercase tracking-widest">{user.trustScore}% Trust Score</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Bio & Social */}
        <div className="md:col-span-1 flex flex-col gap-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">About Me</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {user.bio || "No bio added yet. This user prefers to let their skills do the talking!"}
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Social Links</h4>
              <div className="flex flex-col gap-3">
                <a href="#" className="flex items-center gap-3 text-sm text-white hover:text-primary transition-colors"><Github size={18}/> GitHub Profile</a>
                <a href="#" className="flex items-center gap-3 text-sm text-white hover:text-primary transition-colors"><Linkedin size={18}/> LinkedIn Profile</a>
                <a href="#" className="flex items-center gap-3 text-sm text-white hover:text-primary transition-colors"><Globe size={18}/> Personal Website</a>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-6">Badges Earned</h3>
            <div className="grid grid-cols-3 gap-4">
              {user.badges?.length > 0 ? user.badges.map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group" title={badge.name}>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:bg-primary/20 transition-all">
                    {badge.icon || '🏅'}
                  </div>
                  <span className="text-[10px] text-text-muted text-center font-bold uppercase tracking-tighter truncate w-full">{badge.name}</span>
                </div>
              )) : <p className="text-xs text-text-muted italic">No badges earned yet.</p>}
            </div>
          </div>
        </div>

        {/* Right: Skills & History */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Skills Offering
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsToTeach?.map((skill, i) => (
                      <span key={i} className="skill-badge bg-primary/10 text-primary-hover border border-primary/20 px-4 py-1.5">{skill}</span>
                    ))}
                  </div>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-accent" /> Learning Goals
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsToLearn?.map((skill, i) => (
                      <span key={i} className="skill-badge bg-accent/10 text-accent border border-accent/20 px-4 py-1.5">{skill}</span>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <UserCheck size={24} className="text-success" /> Session History
            </h3>
            <div className="flex flex-col gap-4">
              {history.length > 0 ? history.map((session, i) => (
                <div key={i} className="bg-white/5 border border-glass-border p-4 rounded-2xl flex items-center justify-between hover:bg-white/[0.08] transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-background-dark border border-white/10">
                         <img src={session.userAId?._id === user._id ? (session.userBId?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.userBId?.name}`) : (session.userAId?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.userAId?.name}`)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Exchanged {session.userAId?._id === user._id ? session.skillOfferedByA : session.skillOfferedByB}</h4>
                        <p className="text-[10px] text-text-muted">with {session.userAId?._id === user._id ? session.userBId?.name : session.userAId?.name} • {new Date(session.updatedAt).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="text-yellow-400 fill-yellow-400" />)}
                   </div>
                </div>
              )) : (
                <div className="text-center py-10 border-2 border-dashed border-glass-border rounded-3xl">
                   <p className="text-sm text-text-muted">No completed sessions found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-8 bg-gradient-to-br from-primary/5 to-transparent">
             <h3 className="text-lg font-bold text-white mb-4">Portfolio Showcase</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-video rounded-xl bg-black/40 border border-white/10 flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-all overflow-hidden relative">
                     <img src={`https://picsum.photos/seed/${user.name}${i}/400/250`} alt="Work" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                     <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 font-bold text-xs text-white bg-black/40 backdrop-blur-sm">View Project</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
