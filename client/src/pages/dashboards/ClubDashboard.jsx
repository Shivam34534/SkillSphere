import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Building, Users, Calendar, Target, DollarSign, ArrowRight, Activity, Plus, X, Sparkles, MapPin, Tag, Shield } from 'lucide-react';
import { API_URL } from '../../config';
import Modal from '../../components/Modal';

const ClubDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [gigs, setGigs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isGigModalOpen, setIsGigModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Form States
  const [gigData, setGigData] = useState({ title: '', description: '', type: 'VOLUNTEER', budget: 0, skill: '' });
  const [eventData, setEventData] = useState({ title: '', description: '', date: '', location: '', type: 'WORKSHOP' });

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gigRes, eventRes] = await Promise.all([
        fetch(`${API_URL}/gigs/my-gigs`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/events/my-events`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (gigRes.ok) {
        const data = await gigRes.json();
        setGigs(data);
      }
      if (eventRes.ok) {
        const data = await eventRes.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGig = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/gigs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...gigData,
          skillsRequired: [gigData.skill]
        })
      });
      if (response.ok) {
        setIsGigModalOpen(false);
        setGigData({ title: '', description: '', type: 'VOLUNTEER', budget: 0, skill: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to post gig', error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(eventData)
      });
      if (response.ok) {
        setIsEventModalOpen(false);
        setEventData({ title: '', description: '', date: '', location: '', type: 'WORKSHOP' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to schedule event', error);
    }
  };

  const handleCompleteGig = async (gigId) => {
    if (!window.confirm("Mark this gig as completed? This will distribute the rewards (XP/₹) to the student.")) return;
    try {
      const response = await fetch(`${API_URL}/gigs/${gigId}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Gig completed! Rewards distributed.');
        fetchData();
      } else {
        const err = await response.json();
        alert('Error: ' + err.message);
      }
    } catch (error) {
      console.error('Failed to complete gig', error);
    }
  };

  const handleHireApplicant = async (gigId, userId) => {
    try {
      const response = await fetch(`${API_URL}/gigs/${gigId}/hire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      if (response.ok) {
        alert('Freelancer hired!');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to hire', error);
    }
  };

  const renderTooltip = (field, text, currentData) => {
    if (focusedField === field && !currentData[field]) {
      return (
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none hidden md:block">
          <div className="bg-primary/90 backdrop-blur-md text-white text-[10px] py-2 px-3 rounded-lg shadow-xl border border-white/20 whitespace-nowrap animate-in fade-in zoom-in slide-in-from-left-2 duration-300">
            {text}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-primary/90 rotate-45 border-l border-b border-white/20"></div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!user) return <div className="p-10 text-white text-center">Loading Profile...</div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, {user.name}</h1>
          <p className="text-text-muted mt-1">Club / Organization • Verified Campus Org</p>
        </div>
        <Link to="/wallet" className="wallet-pill bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all text-decoration-none">
          <Users size={16} className="text-primary" />
          <span className="text-primary-hover">Manage Community Wallet</span>
          <span className="xp-badge bg-primary">+{Math.floor((user.xpLevel || 1) * 100)} XP</span>
        </Link>
      </div>

      <div className="dashboard-grid mt-8">
        <div className="main-column flex flex-col gap-8">

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 group hover:border-primary/40 transition-all">
              <Target size={28} className="text-primary mb-4" />
              <h3 className="text-xl font-bold text-white">Post Opportunity</h3>
              <p className="text-sm text-text-muted mb-6">Find talent for events/projects</p>
              <button onClick={() => setIsGigModalOpen(true)} className="btn-primary w-full py-3 bg-gradient-to-r from-primary to-primary-hover border-none shadow-lg shadow-primary/20">Create Post</button>
            </div>

            <div className="glass-card p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 group hover:border-secondary/40 transition-all">
              <Calendar size={28} className="text-secondary mb-4" />
              <h3 className="text-xl font-bold text-white">Plan Event</h3>
              <p className="text-sm text-text-muted mb-6">Organize workshops & fests</p>
              <button onClick={() => setIsEventModalOpen(true)} className="btn-primary w-full py-3 bg-gradient-to-r from-secondary to-pink-600 border-none shadow-lg shadow-secondary/20">Schedule Event</button>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="section-container">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Activity size={20} className="text-primary" /> Active Recruitments</h2>
            <div className="glass-card p-6">
              {loading ? (
                <p className="text-text-muted text-center py-8">Loading opportunities...</p>
              ) : gigs.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {gigs.map((gig, idx) => (
                    <div key={gig._id} className={idx !== gigs.length - 1 ? 'border-b border-glass-border pb-6' : ''}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{gig.title}</h4>
                          <p className="text-sm text-text-muted mt-1">{gig.description}</p>
                          <div className="flex gap-2 mt-3">
                            <span className="skill-badge bg-primary/10 text-primary-hover text-[10px]">{gig.type}</span>
                            {gig.skillsRequired?.map((skill, i) => (
                              <span key={i} className="skill-badge bg-white/5 text-white text-[10px]">{skill}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${gig.type === 'PAID' ? 'text-success' : 'text-text-muted'}`}>
                            {gig.type === 'PAID' ? `₹${gig.budget}` : 'Unpaid'}
                          </div>
                          <div className="text-xs text-text-muted mt-1">Status: {gig.status}</div>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        {gig.status === 'OPEN' ? (
                          <div>
                            <h5 className="text-xs font-bold text-text-muted uppercase mb-3">Applicants ({gig.applicants?.length || 0})</h5>
                            {gig.applicants?.length > 0 ? (
                              <div className="flex flex-col gap-3">
                                {gig.applicants.map((app) => (
                                  <div key={app._id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-glass-border">
                                    <div className="flex items-center gap-2 text-sm text-white">
                                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">{app.userId?.name?.charAt(0) || 'U'}</div>
                                      <span>{app.userId?.name || 'Applicant'}</span>
                                    </div>
                                    <button onClick={() => handleHireApplicant(gig._id, app.userId?._id || app.userId)} className="text-[10px] bg-primary/20 text-primary-hover px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-all font-bold uppercase tracking-wider">Hire Me</button>
                                  </div>
                                ))}
                              </div>
                            ) : <p className="text-xs text-text-muted italic">Waiting for applicants...</p>}
                          </div>
                        ) : gig.status === 'IN_PROGRESS' ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Activity className="text-success animate-pulse" size={16} />
                              <span className="text-xs text-success font-medium">Work in Progress...</span>
                            </div>
                            <button onClick={() => handleCompleteGig(gig._id)} className="btn-primary py-2 px-4 bg-success hover:bg-emerald-600 text-[10px] font-bold border-none uppercase tracking-widest">Mark Completed & Pay</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-text-muted text-xs">
                            <Shield size={14} /> This gig was successfully completed.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-text-muted mb-4">No active posts right now. Start recruiting volunteers or freelancers!</p>
                  <button onClick={() => setIsGigModalOpen(true)} className="text-primary font-semibold hover:underline">Create your first gig</button>
                </div>
              )}
            </div>
          </div>

          {/* Scheduled Events */}
          <div className="section-container">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Calendar size={20} className="text-secondary" /> Scheduled Events</h2>
            <div className="glass-card p-6">
              {loading ? (
                <p className="text-text-muted text-center py-8">Loading events...</p>
              ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <div key={event._id} className="p-4 rounded-xl bg-white/5 border border-glass-border">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{event.type}</span>
                        <span className="text-[10px] text-text-muted">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-white font-semibold mb-1">{event.title}</h4>
                      <p className="text-xs text-text-muted mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-text-muted">
                        <MapPin size={12} /> {event.location}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-text-muted">No events scheduled yet. Start planning your next campus fest!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar flex flex-col gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-6">Organization Profile</h3>
            <div className="mb-6">
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Talent We Need</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {user.skillsToLearn?.length > 0 ? user.skillsToLearn.map((skill, i) => (
                  <span key={i} className="skill-badge bg-primary/10 text-primary-hover border border-primary/20">{skill}</span>
                )) : <span className="text-xs text-text-muted">None added yet</span>}
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Trust & Growth</h3>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-text-muted">Campus Trust Score</span>
              <span className="font-bold text-success">{user.trustScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-success transition-all duration-1000" style={{ width: `${user.trustScore}%` }}></div>
            </div>

            <div className="mt-6 flex items-center justify-between mb-2 text-sm">
              <span className="text-text-muted">Successful Gigs</span>
              <span className="font-bold text-primary">{user.completedGigs || 0}</span>
            </div>

            {user.badges?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-glass-border">
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-4">Club Achievements</span>
                <div className="flex gap-3">
                  {user.badges.map((badge, i) => (
                    <div key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl" title={badge.name}>
                      {badge.icon || '🏅'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Post Gig Modal */}
      <Modal isOpen={isGigModalOpen} onClose={() => setIsGigModalOpen(false)} title="Create Opportunity">
        <form onSubmit={handleCreateGig} className="flex flex-col gap-5">
          <div className="input-group relative">
            <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Gig Title</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="e.g. Graphic Designer for TechFest"
                value={gigData.title}
                onChange={(e) => setGigData({ ...gigData, title: e.target.value })}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-black/40 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary outline-none"
                required
              />
              {renderTooltip('title', 'Short & catchy title', gigData)}
            </div>
          </div>

          <div className="input-group relative">
            <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Description</label>
            <textarea
              placeholder="Detail the tasks and requirements..."
              value={gigData.description}
              onChange={(e) => setGigData({ ...gigData, description: e.target.value })}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              className="w-full bg-black/40 border border-glass-border rounded-xl py-3 px-4 text-white focus:border-primary outline-none min-h-[100px]"
              required
            ></textarea>
            {renderTooltip('description', 'Be specific about the role', gigData)}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Type</label>
              <select
                value={gigData.type}
                onChange={(e) => setGigData({ ...gigData, type: e.target.value })}
                className="w-full bg-black/40 border border-glass-border rounded-xl py-3 px-4 text-white focus:border-primary outline-none appearance-none"
              >
                <option value="VOLUNTEER" className="bg-background-dark">Volunteer</option>
                <option value="PAID" className="bg-background-dark">Paid</option>
              </select>
            </div>
            <div className="input-group">
              <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Budget (₹)</label>
              <input
                type="number"
                disabled={gigData.type === 'VOLUNTEER'}
                value={gigData.budget}
                onChange={(e) => setGigData({ ...gigData, budget: e.target.value })}
                className="w-full bg-black/40 border border-glass-border rounded-xl py-3 px-4 text-white focus:border-primary outline-none disabled:opacity-30"
              />
            </div>
          </div>

          <div className="input-group relative">
            <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Primary Skill Required</label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="e.g. Photoshop, React"
                value={gigData.skill}
                onChange={(e) => setGigData({ ...gigData, skill: e.target.value })}
                onFocus={() => setFocusedField('skill')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-black/40 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary outline-none"
                required
              />
              {renderTooltip('skill', 'Main skill needed', gigData)}
            </div>
          </div>

          <button type="submit" className="btn-primary py-4 mt-2 bg-gradient-to-r from-primary to-primary-hover border-none font-bold">Post Opportunity</button>
        </form>
      </Modal>

      {/* Schedule Event Modal */}
      <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Schedule Event">
        <form onSubmit={handleCreateEvent} className="flex flex-col gap-5">
          <div className="input-group relative">
            <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Event Title</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="e.g. Annual Science Fest 2026"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                onFocus={() => setFocusedField('eventTitle')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-black/40 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary outline-none"
                required
              />
              {renderTooltip('eventTitle', 'Make it sound exciting!', { eventTitle: eventData.title })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Event Type</label>
              <select
                value={eventData.type}
                onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
                className="w-full bg-black/40 border border-glass-border rounded-xl py-3 px-4 text-white focus:border-secondary outline-none appearance-none"
              >
                <option value="WORKSHOP" className="bg-background-dark">Workshop</option>
                <option value="FEST" className="bg-background-dark">Fest</option>
                <option value="SEMINAR" className="bg-background-dark">Seminar</option>
                <option value="COMPETITION" className="bg-background-dark">Competition</option>
              </select>
            </div>
            <div className="input-group">
              <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Date</label>
              <input
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                className="w-full bg-black/40 border border-glass-border rounded-xl py-3 px-4 text-white focus:border-secondary outline-none"
                required
              />
            </div>
          </div>

          <div className="input-group relative">
            <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="e.g. Main Auditorium, Hall A"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-black/40 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-secondary outline-none"
                required
              />
              {renderTooltip('location', 'Where will it happen?', { location: eventData.location })}
            </div>
          </div>

          <div className="input-group relative">
            <label className="text-xs font-bold text-text-muted uppercase mb-2 block">About Event</label>
            <textarea
              placeholder="What is this event about?"
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              onFocus={() => setFocusedField('eventDesc')}
              onBlur={() => setFocusedField(null)}
              className="w-full bg-black/40 border border-glass-border rounded-xl py-3 px-4 text-white focus:border-secondary outline-none min-h-[80px]"
              required
            ></textarea>
            {renderTooltip('eventDesc', 'Brief overview', { eventDesc: eventData.description })}
          </div>

          <button type="submit" className="btn-primary py-4 mt-2 bg-gradient-to-r from-secondary to-pink-600 border-none font-bold shadow-lg shadow-secondary/20">Schedule Event</button>
        </form>
      </Modal>
    </div>
  );
};

export default ClubDashboard;
