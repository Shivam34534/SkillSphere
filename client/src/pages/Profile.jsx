import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import { Mail, GraduationCap, Shield, Award, Edit2, Save, Plus, Trash2, Github, Linkedin, Globe, Zap, Inbox } from 'lucide-react';
import { API_URL } from '../config';

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [newSkillToTeach, setNewSkillToTeach] = useState('');
  const [newSkillToLearn, setNewSkillToLearn] = useState('');

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
       <div className="icon-box new-feature-icon w-20 h-20 rounded-3xl mb-8 opacity-20">
          <Shield size={32} color="white" />
       </div>
       <h2 className="text-3xl font-black text-white mb-4">Access Restricted</h2>
       <p className="text-text-muted max-w-sm mb-8">Please log in to your SkillSphere account to view and manage your profile identity.</p>
       <button className="btn-primary px-10 py-4 text-xs">Log In Now</button>
    </div>
  );

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editedUser)
      });

      if (response.ok) {
        const updatedData = await response.json();
        dispatch(updateUser(updatedData));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred while updating profile');
    }
  };

  const addSkillToTeach = () => {
    if (newSkillToTeach && !editedUser.skillsToTeach.includes(newSkillToTeach)) {
      setEditedUser({
        ...editedUser,
        skillsToTeach: [...editedUser.skillsToTeach, newSkillToTeach]
      });
      setNewSkillToTeach('');
    }
  };

  const removeSkillToTeach = (skill) => {
    setEditedUser({
      ...editedUser,
      skillsToTeach: editedUser.skillsToTeach.filter(s => s !== skill)
    });
  };

  const addSkillToLearn = () => {
    if (newSkillToLearn && !editedUser.skillsToLearn.includes(newSkillToLearn)) {
      setEditedUser({
        ...editedUser,
        skillsToLearn: [...editedUser.skillsToLearn, newSkillToLearn]
      });
      setNewSkillToLearn('');
    }
  };

  const removeSkillToLearn = (skill) => {
    setEditedUser({
      ...editedUser,
      skillsToLearn: editedUser.skillsToLearn.filter(s => s !== skill)
    });
  };

  return (
    <div className="profile-container px-6 py-12 md:px-12 lg:px-24 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="feature-card p-0 overflow-hidden mb-12">
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary via-accent to-secondary relative group">
           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-700"></div>
           <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6 md:gap-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-background-dark border-4 border-background-dark shadow-2xl relative group/avatar">
                 <img src={user.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-full h-full object-cover rounded-2xl" />
                 {isEditing && (
                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                      <Edit2 size={24} className="text-white" />
                   </div>
                 )}
              </div>
              <div className="pb-4">
                 <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-1">{user.name}</h1>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80 flex items-center gap-1">
                       <GraduationCap size={12} /> {user.department || 'Campus Student'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Lvl {user.xpLevel} Elite</span>
                 </div>
              </div>
           </div>
           <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`absolute right-8 bottom-8 flex items-center gap-2 py-3 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all ${
               isEditing ? 'bg-success text-white shadow-success/20' : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
            }`}
          >
            {isEditing ? <><Save size={16} /> Update Identity</> : <><Edit2 size={16} /> Edit Profile</>}
          </button>
        </div>

        <div className="pt-24 pb-12 px-8 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Sidebar Info */}
           <div className="space-y-10">
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5 pb-4">Verification</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 text-white/80 group">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted group-hover:text-primary group-hover:bg-primary/10 transition-all border border-white/5">
                          <Mail size={18} />
                       </div>
                       <span className="text-sm font-bold truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/80 group">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-success bg-success/10 border border-success/20">
                          <Shield size={18} />
                       </div>
                       <span className="text-sm font-bold">Verified Persona</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5 pb-4">Synergy Links</h3>
                 <div className="grid grid-cols-3 gap-4">
                    <a href="#" className="w-full h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all border border-white/5">
                       <Github size={20} />
                    </a>
                    <a href="#" className="w-full h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all border border-white/5">
                       <Linkedin size={20} />
                    </a>
                    <a href="#" className="w-full h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all border border-white/5">
                       <Globe size={20} />
                    </a>
                 </div>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-success/10 to-transparent border border-success/20 relative overflow-hidden group">
                 <Award className="absolute -bottom-6 -right-6 text-success/5 group-hover:scale-150 transition-transform duration-1000" size={100} />
                 <div className="flex items-center gap-3 text-success font-black text-xs uppercase tracking-widest mb-4">
                    <Award size={18} /> Reputation
                 </div>
                 <div className="flex justify-between items-end mb-4">
                    <span className="text-4xl font-black text-white tracking-tighter">{user.trustScore}%</span>
                    <span className="text-[10px] font-bold text-success uppercase">Trust Score</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: `${user.trustScore}%` }}></div>
                 </div>
              </div>
           </div>

           {/* Main Profile Info */}
           <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5 pb-4">Personal Narrative</h3>
                 {isEditing ? (
                   <textarea 
                     id="profile-bio"
                     name="bio"
                     value={editedUser.bio || ''}
                     onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:border-primary outline-none min-h-[150px] transition-all"
                     placeholder="Tell your campus story..."
                   />
                 ) : (
                   <p className="text-text-muted leading-relaxed text-base">
                     {user.bio || "No narrative established yet. This user is actively building their presence on SkillSphere."}
                   </p>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-4">Skills I Offer</h3>
                    <div className="flex flex-wrap gap-2">
                       {(isEditing ? editedUser.skillsToTeach : user.skillsToTeach)?.map(skill => (
                         <span key={skill} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10 flex items-center gap-3">
                           {skill}
                           {isEditing && <Trash2 size={12} className="cursor-pointer hover:text-white" onClick={() => removeSkillToTeach(skill)} />}
                         </span>
                       ))}
                       {isEditing && (
                         <div className="flex w-full gap-2 mt-4">
                           <input 
                             type="text" 
                             id="add-skill-teach"
                             name="newSkillToTeach"
                             value={newSkillToTeach}
                             onChange={(e) => setNewSkillToTeach(e.target.value)}
                             className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-primary outline-none"
                             placeholder="Add skill..."
                           />
                           <button onClick={addSkillToTeach} className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center"><Plus size={18} /></button>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-accent uppercase tracking-widest border-b border-accent/10 pb-4">Skills I Seek</h3>
                    <div className="flex flex-wrap gap-2">
                       {(isEditing ? editedUser.skillsToLearn : user.skillsToLearn)?.map(skill => (
                         <span key={skill} className="px-4 py-2 rounded-xl bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest border border-accent/10 flex items-center gap-3">
                           {skill}
                           {isEditing && <Trash2 size={12} className="cursor-pointer hover:text-white" onClick={() => removeSkillToLearn(skill)} />}
                         </span>
                       ))}
                       {isEditing && (
                         <div className="flex w-full gap-2 mt-4">
                           <input 
                             type="text" 
                             id="add-skill-learn"
                             name="newSkillToLearn"
                             value={newSkillToLearn}
                             onChange={(e) => setNewSkillToLearn(e.target.value)}
                             className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-accent outline-none"
                             placeholder="Add skill..."
                           />
                           <button onClick={addSkillToLearn} className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center"><Plus size={18} /></button>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
