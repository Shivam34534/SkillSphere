import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Briefcase, Star, Zap, 
  DollarSign, Clock, MapPin, ChevronRight,
  TrendingUp, Shield, Bookmark, Inbox, Sparkles, ArrowRight
} from 'lucide-react';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const categories = ['All', 'Design', 'Coding', 'Writing', 'Events', 'Marketing', 'Video', 'Other'];
  const types = ['All', 'PAID', 'VOLUNTEER'];

  useEffect(() => {
    fetchGigs();
  }, [selectedCategory, selectedType]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        category: selectedCategory,
        type: selectedType
      });
      const response = await fetch(`http://localhost:5000/api/v1/gigs?${query}`);
      if (response.ok) {
        const data = await response.json();
        setGigs(data);
      }
    } catch (error) {
      console.error('Failed to fetch gigs', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = gigs.filter(gig => 
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    gig.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in-up pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
             <Sparkles size={14} /> Verified Opportunities
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">
            Campus <span className="gradient-text">Gigs</span>
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            Monetize your skills, build your portfolio, and help campus clubs grow. The professional layer of SkillSphere.
          </p>
        </div>
        <div className="flex items-center gap-6 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="text-right relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Active Pool</p>
              <p className="text-3xl font-black text-white tracking-tighter">₹1,45,000+</p>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary relative z-10 shadow-inner group-hover:scale-110 transition-transform">
              <TrendingUp size={28} />
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 mb-12 sticky top-20 z-50 shadow-2xl shadow-black/40">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search gigs, skills, or clubs..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
             <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/10 shrink-0">
                {types.map(t => (
                  <button 
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${selectedType === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
             </div>
             <div className="h-8 w-px bg-white/10 shrink-0"></div>
             <select 
               className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-sm font-bold text-white outline-none focus:border-primary shrink-0 appearance-none cursor-pointer hover:bg-white/10 transition-all"
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
             >
                {categories.map(c => <option key={c} value={c} className="bg-background-dark text-white">{c}</option>)}
             </select>
          </div>
        </div>
      </div>

      {/* Gigs List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="glass-card h-[400px] animate-pulse"></div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGigs.length > 0 ? filteredGigs.map((gig) => (
            <Link key={gig._id} to={`/gigs/${gig._id}`} className="group">
              <div className="glass-card h-full p-8 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative flex flex-col overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                   <Briefcase size={120} />
                </div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex flex-col gap-2">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg border uppercase tracking-widest w-fit ${gig.type === 'PAID' ? 'bg-success/10 text-success border-success/20 shadow-lg shadow-success/5' : 'bg-accent/10 text-accent border-accent/20 shadow-lg shadow-accent/5'}`}>
                      {gig.type}
                    </span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">{gig.category}</span>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-all">
                    <Bookmark size={20} />
                  </button>
                </div>

                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">{gig.title}</h3>
                <p className="text-sm text-text-muted mb-8 line-clamp-3 leading-relaxed flex-1 opacity-80">
                  {gig.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-10 relative z-10">
                  {gig.skillsRequired?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-text-muted group-hover:border-primary/20 transition-colors">
                      {skill}
                    </span>
                  ))}
                  {gig.skillsRequired?.length > 3 && <span className="text-[10px] text-text-muted font-bold mt-1">+{gig.skillsRequired.length - 3}</span>}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-background-dark border border-white/10 group-hover:scale-110 transition-transform shadow-xl">
                      <img src={gig.clubId?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${gig.clubId?.name}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{gig.clubId?.name}</span>
                      <span className="text-[10px] text-text-muted flex items-center gap-1 font-bold">
                        <Shield size={10} className="text-success" /> {gig.clubId?.trustScore}% Trust
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white tracking-tighter">{gig.budget > 0 ? `₹${gig.budget}` : 'Free'}</p>
                    <p className="text-[10px] text-text-muted font-bold flex items-center justify-end gap-1 uppercase tracking-widest">
                       Apply Now <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full empty-state py-32">
               <div className="empty-state-icon"><Inbox size={48} /></div>
               <h3 className="text-3xl font-black text-white mb-3">No Opportunities Found</h3>
               <p className="text-text-muted max-w-sm mx-auto mb-12">Clubs are always looking for talent. Try adjusting your filters or check back in a few hours.</p>
               <button onClick={() => {setSelectedCategory('All'); setSelectedType('All');}} className="btn-secondary px-10 py-3 font-bold">Show All Gigs</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gigs;
