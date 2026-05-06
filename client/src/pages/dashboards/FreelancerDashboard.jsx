import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Briefcase, DollarSign, Star, TrendingUp, Users, Activity, ExternalLink, CheckCircle, Plus, ArrowUpRight, Clock, Inbox, BarChart3 } from 'lucide-react';

const FreelancerDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data.filter(s => s.freelancerId?._id === user._id || s.freelancerId === user._id));
      }
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostService = async () => {
    const title = window.prompt("Service Title (e.g., 'React UI Design'):");
    if (!title) return;
    const description = window.prompt("Service Description:");
    const category = window.prompt("Category (e.g., 'Web Dev'):");
    const amount = window.prompt("Price in Credits/Cash (e.g., 50):");

    if (title && description && category) {
      try {
        const response = await fetch('http://localhost:5000/api/v1/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title, description, category,
            pricing: { type: 'CREDITS', amount: Number(amount) || 0 }
          })
        });

        if (response.ok) {
          alert('Service posted successfully!');
          fetchServices();
        } else {
          const err = await response.json();
          alert('Error: ' + err.message);
        }
      } catch (error) {
        alert('Failed to post service');
      }
    }
  };

  return (
    <div className="dashboard-content animate-fade-in-up">
      <div className="dashboard-header flex-col md:flex-row items-start md:items-end gap-6 mb-12">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-white">Pro Dashboard</h1>
          <p className="text-text-muted text-lg">Manage your services, track earnings, and grow your campus brand.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/wallet" className="wallet-pill px-6 py-3 bg-white/5 hover:bg-white/10 transition-all border border-white/10 group">
            <DollarSign size={20} className="text-secondary group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold text-white">₹{user.walletBalance || 0}</span>
            <span className="text-xs text-text-muted ml-2">Total Revenue</span>
          </Link>
          <div className="bg-secondary/20 text-secondary px-4 py-3 rounded-2xl border border-secondary/20 flex flex-col items-center min-w-[80px]">
             <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Level</span>
             <span className="text-xl font-black">{user.xpLevel || 1}</span>
          </div>
        </div>
      </div>

      <div className="stats-grid mb-12">
        <div className="stat-card">
          <div className="stat-card-glow bg-secondary"></div>
          <div className="relative z-10">
            <span className="text-text-muted text-sm font-medium mb-1 block">Monthly Growth</span>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">12.4%</span>
              <span className="text-success text-xs font-bold mb-2 flex items-center gap-1"><ArrowUpRight size={14}/> +4.2%</span>
            </div>
            <div className="chart-container mt-4">
               {[30, 50, 40, 80, 55, 70, 90].map((h, i) => (
                 <div key={i} className="chart-bar bg-secondary" style={{ height: `${h}%`, opacity: 0.8 }}></div>
               ))}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-glow bg-primary"></div>
          <div className="relative z-10">
            <span className="text-text-muted text-sm font-medium mb-1 block">Profile Views</span>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">1,284</span>
              <span className="text-primary text-xs font-bold mb-2">+12 today</span>
            </div>
            <div className="flex gap-1 mt-6">
               {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-yellow-400 fill-yellow-400" />)}
               <span className="text-xs text-text-muted ml-2">4.9/5 Rating</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-glow bg-accent"></div>
          <div className="relative z-10">
            <span className="text-text-muted text-sm font-medium mb-1 block">Conversion Rate</span>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">8.2%</span>
              <span className="text-accent text-xs font-bold mb-2">Excellent</span>
            </div>
            <div className="mt-8 flex items-center gap-3">
               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '65%' }}></div>
               </div>
               <span className="text-[10px] text-text-muted font-bold">65%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-column">
          <div className="section-container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white"><Briefcase className="text-secondary" /> Your Active Gigs</h2>
              <button onClick={handlePostService} className="btn-primary flex items-center gap-2 bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20">
                <Plus size={18} /> New Listing
              </button>
            </div>

            {loading ? (
              <div className="empty-state animate-pulse">
                <div className="empty-state-icon"><Clock size={32} /></div>
                <p>Syncing your services...</p>
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {services.map((service) => (
                  <div key={service._id} className="glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:bg-white/[0.03] transition-all border-l-4 border-l-secondary/40">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                        {service.category === 'Web Dev' ? <BarChart3 size={32}/> : <Briefcase size={32}/>}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-secondary transition-colors">{service.title}</h4>
                        <p className="text-sm text-text-muted mb-3 max-w-md line-clamp-1">{service.description}</p>
                        <div className="flex gap-3">
                          <span className="text-[10px] uppercase tracking-widest font-black text-secondary px-2 py-0.5 bg-secondary/10 rounded-md">
                            {service.category}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest font-black text-text-muted px-2 py-0.5 bg-white/5 rounded-md">
                             {service.deliveryTimeDays}D Delivery
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto border-t sm:border-0 pt-4 sm:pt-0 mt-4 sm:mt-0 flex sm:flex-col justify-between items-center sm:items-end gap-2">
                       <div className="text-2xl font-black text-white">₹{service.pricing?.amount}</div>
                       <button className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">Edit Listing <ArrowUpRight size={12}/></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><Inbox size={32} /></div>
                <h3 className="text-xl font-bold text-white mb-2">No Active Listings</h3>
                <p className="text-text-muted max-w-xs mx-auto mb-8">Ready to turn your skills into a side hustle? Post your first service listing now.</p>
                <button onClick={handlePostService} className="btn-primary py-3 px-8 bg-secondary hover:bg-secondary/90">Post Your First Gig</button>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar flex flex-col gap-8">
          <div className="glass-card p-8 bg-gradient-to-br from-secondary/5 to-transparent">
            <h3 className="text-xl font-bold text-white mb-6">Expertise Level</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-text-muted font-bold uppercase tracking-widest">XP Progression</span>
                  <span className="text-xs font-bold text-white">{user.xpPoints % 500}/500</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="h-full bg-gradient-to-r from-secondary to-accent rounded-full animate-pulse-slow" style={{ width: `${((user.xpPoints % 500) / 500) * 100}%` }}></div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                 <TrendingUp size={20} className="text-success" />
                 <div>
                    <p className="text-xs font-bold text-white">Rising Star Status</p>
                    <p className="text-[10px] text-text-muted">You're in the top 15% of sellers this month.</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
             <h3 className="text-xl font-bold text-white mb-6">Client Network</h3>
             <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
                      <span className="text-sm font-medium text-white">Jane Doe</span>
                   </div>
                   <span className="text-[10px] text-text-muted">3 Orders</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">MS</div>
                      <span className="text-sm font-medium text-white">Mark Smith</span>
                   </div>
                   <span className="text-[10px] text-text-muted">1 Order</span>
                </div>
             </div>
             <button className="btn-secondary w-full mt-8 py-3 text-sm flex items-center justify-center gap-2">
                <Users size={16}/> View All Clients
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
