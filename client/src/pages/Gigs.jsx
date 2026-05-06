import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Briefcase, Star, Zap, 
  DollarSign, Clock, MapPin, ChevronRight,
  TrendingUp, Shield, Bookmark
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
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
            Campus <span className="gradient-text">Gigs</span>
          </h1>
          <p className="text-lg text-text-muted">
            Monetize your skills, build your portfolio, and help campus clubs grow. Verified student opportunities only.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
           <div className="text-right">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active Pool</p>
              <p className="text-2xl font-black text-primary">₹1,45,000+</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <TrendingUp size={24} />
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 mb-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search gigs, skills, or clubs..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
              {types.map(t => (
                <button 
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedType === t ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
           </div>
           <div className="h-8 w-px bg-white/10"></div>
           <select 
             className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary"
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
           >
              {categories.map(c => <option key={c} value={c} className="bg-background-dark text-white">{c}</option>)}
           </select>
        </div>
      </div>

      {/* Gigs List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <div className="spinner mb-4"></div>
           <p className="text-text-muted animate-pulse">Scanning campus for opportunities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGigs.length > 0 ? filteredGigs.map((gig) => (
            <Link key={gig._id} to={`/gigs/${gig._id}`} className="group">
              <div className="glass-card h-full p-6 hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-[0.98] relative flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-tighter w-fit ${gig.type === 'PAID' ? 'bg-success/10 text-success border-success/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                      {gig.type}
                    </span>
                    <span className="text-[10px] font-bold text-text-muted ml-1">{gig.category}</span>
                  </div>
                  <button className="text-text-muted hover:text-primary transition-colors">
                    <Bookmark size={20} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-1">{gig.title}</h3>
                <p className="text-sm text-text-muted mb-8 line-clamp-3 leading-relaxed flex-1">
                  {gig.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {gig.skillsRequired?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-text-muted">
                      {skill}
                    </span>
                  ))}
                  {gig.skillsRequired?.length > 3 && <span className="text-[10px] text-text-muted">+{gig.skillsRequired.length - 3} more</span>}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-background-dark border border-white/10">
                      <img src={gig.clubId?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${gig.clubId?.name}`} alt="" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{gig.clubId?.name}</span>
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Shield size={10} className="text-success" /> {gig.clubId?.trustScore}% Trust
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">{gig.budget > 0 ? `₹${gig.budget}` : 'Free'}</p>
                    <p className="text-[10px] text-text-muted flex items-center justify-end gap-1">
                      <Clock size={10} /> {new Date(gig.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center glass-card border-dashed">
               <Briefcase size={48} className="mx-auto mb-4 text-white/10" />
               <h3 className="text-2xl font-bold text-white mb-2">No gigs found</h3>
               <p className="text-text-muted">Try changing your filters or check back later for new club opportunities.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gigs;
