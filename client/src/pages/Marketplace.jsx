import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Star, Zap, Code, Palette, Presentation, Languages, Music, Video, User, Inbox, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const Marketplace = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Web Dev', 'Design', 'Tutoring', 'Writing', 'Music', 'Video', 'Other'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="marketplace-container animate-fade-in-up pb-20">
      <div className="marketplace-header mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
           <Sparkles size={14} /> The Campus Economy
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tighter px-4">
          Discover <span className="gradient-text">Top Talent</span>
        </h1>
        <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed px-6">
          The ultimate marketplace for student freelancers, peer tutors, and campus creators. Get things done with SkillSphere.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 mb-12 sticky top-20 z-50 shadow-2xl shadow-black/40">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="search-input-wrapper flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search for skills, services, or names..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  selectedCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="glass-card h-[380px] animate-pulse">
                <div className="h-48 bg-white/5 rounded-t-2xl"></div>
                <div className="p-6 space-y-4">
                   <div className="h-6 w-3/4 bg-white/5 rounded-md"></div>
                   <div className="h-4 w-full bg-white/5 rounded-md"></div>
                   <div className="h-4 w-5/6 bg-white/5 rounded-md"></div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.length > 0 ? filteredServices.map((service) => (
            <div key={service._id} className="glass-card group overflow-hidden border border-white/10 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
              <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/5 relative overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                    {service.category === 'Web Dev' && <Code size={120} />}
                    {service.category === 'Design' && <Palette size={120} />}
                    {service.category === 'Tutoring' && <Presentation size={120} />}
                    {service.category === 'Music' && <Music size={120} />}
                    {service.category === 'Video' && <Video size={120} />}
                    {!['Web Dev', 'Design', 'Tutoring', 'Music', 'Video'].includes(service.category) && <Zap size={120} />}
                 </div>
                 <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
                       {service.category}
                    </span>
                 </div>
                 <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">4.9</span>
                 </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors line-clamp-1">{service.title}</h3>
                <p className="text-text-muted text-sm mb-6 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                   <Link to={`/profile/${service.freelancerId?._id || service.freelancerId}`} className="flex items-center gap-2 group/author">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-xs text-primary group-hover/author:bg-primary group-hover/author:text-white transition-all">
                        {service.freelancerId?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs text-white font-medium group-hover/author:text-primary transition-colors">{service.freelancerId?.name || 'Anonymous'}</span>
                   </Link>
                   <div className="text-right">
                      <p className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Starting at</p>
                      <p className="text-lg font-black text-white">₹{service.pricing?.amount}</p>
                   </div>
                </div>
              </div>
              
              <Link to="/login" className="w-full py-4 bg-white/5 border-t border-white/10 text-center text-sm font-bold text-white group-hover:bg-primary group-hover:border-primary transition-all flex items-center justify-center gap-2">
                 Book Service <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )) : (
            <div className="col-span-full py-32 flex flex-col items-center">
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-text-muted/30 mb-8">
                 <Inbox size={48} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 text-center">No skills found</h3>
              <p className="text-text-muted text-center max-w-sm mb-12">Adjust your filters or try a different search term to discover hidden talent on campus.</p>
              <button onClick={() => {setSearchTerm(''); setSelectedCategory('All');}} className="btn-secondary px-8 py-3">Clear All Filters</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
