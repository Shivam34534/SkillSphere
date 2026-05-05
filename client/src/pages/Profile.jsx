import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import { User, Mail, GraduationCap, Shield, Award, Edit2, Save, X, Plus, Trash2, Github, Linkedin, Globe } from 'lucide-react';

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [newSkillToTeach, setNewSkillToTeach] = useState('');
  const [newSkillToLearn, setNewSkillToLearn] = useState('');

  if (!user) return <div style={{ padding: '5rem', textAlign: 'center', color: 'white' }}>Please log in to view your profile.</div>;

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/profile`, {
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
    <div className="profile-container" style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Profile Header Background */}
        <div style={{ height: '150px', background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '-40px', left: '2rem', display: 'flex', alignItems: 'flex-end', gap: '1.5rem' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '24px', backgroundColor: '#1e293b', border: '4px solid #0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
              {user.name?.charAt(0)}
            </div>
            <div style={{ paddingBottom: '0.5rem' }}>
              <h1 style={{ margin: 0, fontSize: '2rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{user.name}</h1>
              <p style={{ margin: 0, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={16} /> {user.department} • Level {user.xpLevel} {user.role === 'FREELANCER' ? 'Expert' : 'Learner'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="btn-primary" 
            style={{ position: 'absolute', right: '1.5rem', bottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: isEditing ? '#10b981' : 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit2 size={18} /> Edit Profile</>}
          </button>
        </div>

        {/* Profile Content */}
        <div style={{ marginTop: '50px', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Left Column: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="info-group">
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '1px' }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#cbd5e1' }}>
                  <Mail size={18} color="var(--text-muted)" /> {user.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#cbd5e1' }}>
                  <Shield size={18} color="var(--text-muted)" /> Verified Student
                </div>
              </div>
            </div>

            <div className="info-group">
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '1px' }}>Social Presence</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#cbd5e1', textDecoration: 'none' }}><Github size={18} /> GitHub</a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#cbd5e1', textDecoration: 'none' }}><Linkedin size={18} /> LinkedIn</a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#cbd5e1', textDecoration: 'none' }}><Globe size={18} /> Portfolio</a>
              </div>
            </div>

            <div className="info-group" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                <Award size={20} /> Trust Statistics
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>Reputation based on peer reviews and successful gig completion.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'white' }}>Trust Score</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{user.trustScore}%</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ width: `${user.trustScore}%`, height: '100%', background: '#10b981' }}></div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="bio-section">
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem' }}>About Me</h3>
              {isEditing ? (
                <textarea 
                  value={editedUser.bio || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', minHeight: '120px', outline: 'none' }}
                  placeholder="Tell your peers what you do best..."
                />
              ) : (
                <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                  {user.bio || "This user hasn't added a bio yet. They are likely busy mastering new skills on SkillSphere!"}
                </p>
              )}
            </div>

            <div className="skills-section">
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem' }}>Skills I'm Offering</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: isEditing ? '1rem' : 0 }}>
                {(isEditing ? editedUser.skillsToTeach : user.skillsToTeach)?.map(skill => (
                  <span key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    {skill}
                    {isEditing && <Trash2 size={14} style={{ cursor: 'pointer' }} onClick={() => removeSkillToTeach(skill)} />}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={newSkillToTeach}
                    onChange={(e) => setNewSkillToTeach(e.target.value)}
                    placeholder="Add a skill to teach..."
                    style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                  />
                  <button onClick={addSkillToTeach} className="btn-secondary" style={{ padding: '0.5rem' }}><Plus size={20} /></button>
                </div>
              )}
            </div>

            <div className="skills-section">
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem' }}>Skills I'm Learning</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: isEditing ? '1rem' : 0 }}>
                {(isEditing ? editedUser.skillsToLearn : user.skillsToLearn)?.map(skill => (
                  <span key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', color: '#a855f7', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    {skill}
                    {isEditing && <Trash2 size={14} style={{ cursor: 'pointer' }} onClick={() => removeSkillToLearn(skill)} />}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={newSkillToLearn}
                    onChange={(e) => setNewSkillToLearn(e.target.value)}
                    placeholder="Add a skill to learn..."
                    style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                  />
                  <button onClick={addSkillToLearn} className="btn-secondary" style={{ padding: '0.5rem' }}><Plus size={20} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
