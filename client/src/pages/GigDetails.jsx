import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Briefcase, Calendar, DollarSign, Users, Shield, 
  CheckCircle, ArrowLeft, Send, Clock, Award, 
  MapPin, Bookmark, Share2, AlertCircle
} from 'lucide-react';

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/gigs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGig(data);
        
        // Check if user has already applied
        const userApp = data.applicants.find(a => a.userId?._id === user?._id);
        if (userApp) setHasApplied(true);
        
        // Check if saved
        if (data.savedBy?.includes(user?._id)) setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to fetch gig details', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!token) return navigate('/login');
    
    setApplying(true);
    try {
      const response = await fetch(`http://localhost:5000/api/v1/gigs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ coverLetter, resume: portfolioLink })
      });
      
      if (response.ok) {
        setHasApplied(true);
        alert('Application submitted successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to apply');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setApplying(false);
    }
  };

  const toggleSave = async () => {
    if (!token) return navigate('/login');
    const endpoint = isSaved ? 'unsave' : 'save';
    try {
      const response = await fetch(`http://localhost:5000/api/v1/gigs/${id}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) setIsSaved(!isSaved);
    } catch (error) {
      console.error('Toggle save failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="spinner"></div></div>;
  if (!gig) return <div className="p-20 text-center text-white text-2xl font-bold">Gig Not Found</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass-card p-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 flex gap-3">
                <button 
                  onClick={toggleSave}
                  className={`p-3 rounded-2xl border ${isSaved ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-text-muted'} hover:scale-105 transition-all`}
                >
                   <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                </button>
                <button className="p-3 rounded-2xl border bg-white/5 border-white/10 text-text-muted hover:scale-105 transition-all">
                   <Share2 size={20} />
                </button>
             </div>

             <div className="flex items-center gap-3 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${gig.type === 'PAID' ? 'bg-success/10 text-success border border-success/20' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                   {gig.type} Opportunity
                </span>
                <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium text-text-muted">
                   {gig.category}
                </span>
             </div>

             <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight">{gig.title}</h1>
             
             <div className="flex flex-wrap gap-8 py-6 border-y border-white/5 mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <DollarSign size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Budget</p>
                      <p className="text-lg font-bold text-white">{gig.budget > 0 ? `₹${gig.budget}` : 'Volunteer'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                      <Calendar size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Deadline</p>
                      <p className="text-lg font-bold text-white">{gig.deadline ? new Date(gig.deadline).toLocaleDateString() : 'No deadline'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                      <Users size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Applicants</p>
                      <p className="text-lg font-bold text-white">{gig.applicants?.length || 0} applied</p>
                   </div>
                </div>
             </div>

             <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-bold text-white mb-4">Project Description</h3>
                <p className="text-text-muted leading-relaxed mb-8">{gig.description}</p>
                
                <h3 className="text-xl font-bold text-white mb-4">Requirements & Skills</h3>
                <div className="flex flex-wrap gap-3 mb-8">
                   {gig.skillsRequired?.map((skill, i) => (
                     <span key={i} className="skill-badge bg-white/5 border border-white/10 px-4 py-2">{skill}</span>
                   ))}
                </div>

                {gig.requirements?.length > 0 && (
                   <ul className="space-y-3 mb-8">
                      {gig.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
                           <CheckCircle size={18} className="text-success flex-shrink-0 mt-0.5" />
                           {req}
                        </li>
                      ))}
                   </ul>
                )}
             </div>
          </div>

          {/* Application Form */}
          {user?.role === 'STUDENT' && !hasApplied && gig.status === 'OPEN' && (
             <div className="glass-card p-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                   <Send size={24} className="text-primary" /> Apply for this Gig
                </h3>
                <form onSubmit={handleApply} className="flex flex-col gap-6">
                   <div>
                      <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block">Cover Letter / Pitch</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary transition-all outline-none min-h-[150px]"
                        placeholder="Explain why you are the best fit for this project..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        required
                      ></textarea>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block">Portfolio / Resume Link</label>
                      <input 
                        type="url"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary transition-all outline-none"
                        placeholder="https://yourportfolio.com or GitHub profile"
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        required
                      />
                   </div>
                   <button type="submit" disabled={applying} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3">
                      {applying ? <div className="spinner-sm"></div> : <><Send size={20} /> Submit Application</>}
                   </button>
                </form>
             </div>
          )}

          {hasApplied && (
            <div className="glass-card p-8 border-success/30 bg-success/5 flex items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center text-success">
                  <CheckCircle size={32} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white mb-1">Application Submitted!</h3>
                  <p className="text-sm text-text-muted">The club has been notified. You'll receive a notification once they review your profile.</p>
               </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-8">
           <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-white mb-6">About the Club</h3>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-14 h-14 rounded-2xl overflow-hidden bg-background-dark border border-white/10">
                    <img src={gig.clubId?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${gig.clubId?.name}`} alt="" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white">{gig.clubId?.name}</h4>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                       <Shield size={12} className="text-success" /> {gig.clubId?.trustScore}% Trust Score
                    </p>
                 </div>
              </div>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                 {gig.clubId?.bio || "Active campus club dedicated to professional growth and student collaboration."}
              </p>
              <Link to={`/profile/${gig.clubId?._id}`} className="btn-secondary w-full text-center py-2.5 text-sm">View Club Profile</Link>
           </div>

           <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-white mb-6">Gig Safety Info</h3>
              <div className="space-y-4">
                 <div className="flex gap-3">
                    <Shield size={18} className="text-primary flex-shrink-0" />
                    <div>
                       <p className="text-xs font-bold text-white mb-1">Milestone Payments</p>
                       <p className="text-[10px] text-text-muted">Credits are held in escrow until the project is verified by both parties.</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <Award size={18} className="text-accent flex-shrink-0" />
                    <div>
                       <p className="text-xs font-bold text-white mb-1">XP Guarantee</p>
                       <p className="text-[10px] text-text-muted">Earn up to 300 XP on successful completion to level up your campus rank.</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <Clock size={18} className="text-yellow-500 flex-shrink-0" />
                    <div>
                       <p className="text-xs font-bold text-white mb-1">Dispute Resolution</p>
                       <p className="text-[10px] text-text-muted">Dedicated campus admins available to resolve any project conflicts.</p>
                    </div>
                 </div>
              </div>
           </div>

           {gig.status !== 'OPEN' && (
             <div className="glass-card p-6 border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-500 flex-shrink-0 mt-1" />
                <p className="text-xs text-text-muted">This gig is currently <strong>{gig.status.replace('_', ' ')}</strong> and not accepting new applications.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
