import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Star, Zap, Code, Palette, Presentation, Languages, Music, Video, User } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      const response = await fetch('http://localhost:5000/api/v1/services');
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
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h1 className="gradient-text">
          Explore the Campus Economy
        </h1>
        <p>
          Find the perfect tutor, freelancer, or collaborator for your next project.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search for skills, services, or names..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filters">
          <Filter size={18} className="text-text-muted mr-2" />
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'btn-primary py-2 px-5 rounded-full text-sm' : 'btn-ghost py-2 px-5 rounded-full text-sm'}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-text-muted">Fetching the best talent on campus...</p>
        </div>
      ) : (
        <div className="services-grid">
          {filteredServices.length > 0 ? filteredServices.map((service) => (
            <div key={service._id} className="glass-card service-card">
              <div className="service-card-content">
                <div className="flex justify-between items-start mb-4">
                  <span className="skill-badge bg-primary/10 text-primary">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star size={14} fill="currentColor" />
                    <span className="font-bold">{service.freelancerId?.trustScore ? (service.freelancerId.trustScore / 20).toFixed(1) : '5.0'}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-main">{service.title}</h3>
                <p className="text-text-muted text-sm mb-6 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                <Link to={`/profile/${service.freelancerId?._id || service.freelancerId}`} className="flex items-center gap-3 no-underline group">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-xs text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    {service.freelancerId?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm text-text-main font-medium group-hover:text-primary transition-colors">{service.freelancerId?.name || 'Anonymous'}</span>
                </Link>
              </div>
              <div className="service-card-footer">
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Starting from</span>
                  <span className="text-xl font-bold text-yellow-400">{service.pricing?.amount} {service.pricing?.type}</span>
                </div>
                <Link to="/login" className="btn-primary py-2 px-5 text-sm">
                  View Gigs
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20">
              <Zap size={48} className="text-text-muted mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl text-text-main mb-2">No services found</h3>
              <p className="text-text-muted">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
