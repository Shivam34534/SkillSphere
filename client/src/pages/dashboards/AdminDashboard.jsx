import React from 'react';
import { useSelector } from 'react-redux';
import { Shield, AlertTriangle, Users, Database, Activity, Lock, ArrowUpRight, BarChart3, Terminal, Inbox, Server } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="dashboard-content animate-fade-in-up pb-20">
      <div className="dashboard-header flex-col md:flex-row items-start md:items-end gap-6 mb-16">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest mb-6">
             <Shield size={14} /> System Governance Portal
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">Command <span className="text-red-500">Center</span></h1>
          <p className="text-lg text-text-muted max-w-2xl leading-relaxed">System Administrator mode active. Monitoring campus ecosystem health and security protocols.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
            <Lock size={20} className="text-red-500" />
            <span className="text-lg font-black text-white uppercase tracking-widest">God Mode</span>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="stats-grid mb-12">
        <div className="stat-card border-red-500/20">
          <div className="stat-card-glow bg-red-500 opacity-10"></div>
          <div className="relative z-10">
            <span className="text-text-muted text-sm font-bold uppercase tracking-widest mb-1 block">Live Nodes</span>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">1,245</span>
              <span className="text-success text-xs font-bold mb-2 flex items-center gap-1"><ArrowUpRight size={14}/> +12%</span>
            </div>
            <div className="chart-container mt-6">
               {[60, 40, 70, 50, 80, 90, 100].map((h, i) => (
                 <div key={i} className="chart-bar bg-red-500" style={{ height: `${h}%`, opacity: 0.8 }}></div>
               ))}
            </div>
          </div>
        </div>
        <div className="stat-card border-primary/20">
          <div className="stat-card-glow bg-primary opacity-10"></div>
          <div className="relative z-10">
            <span className="text-text-muted text-sm font-bold uppercase tracking-widest mb-1 block">Verifications</span>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">89</span>
              <span className="text-primary text-xs font-bold mb-2">Pending Review</span>
            </div>
            <div className="flex gap-1 mt-8">
               <Users size={16} className="text-primary" />
               <span className="text-xs text-text-muted">High priority queue active</span>
            </div>
          </div>
        </div>
        <div className="stat-card border-accent/20">
          <div className="stat-card-glow bg-accent opacity-10"></div>
          <div className="relative z-10">
            <span className="text-text-muted text-sm font-bold uppercase tracking-widest mb-1 block">System Load</span>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">2.4ms</span>
              <span className="text-accent text-xs font-bold mb-2">Stable</span>
            </div>
            <div className="mt-8 flex items-center gap-3">
               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '15%' }}></div>
               </div>
               <span className="text-[10px] text-text-muted font-bold">15%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-column">
          <div className="section-container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                 <AlertTriangle size={24} className="text-yellow-500" /> Action Required
              </h2>
              <button className="text-xs font-bold text-primary hover:underline">View All Alerts</button>
            </div>
            
            <div className="empty-state py-20 bg-white/[0.02]">
              <div className="empty-state-icon"><Inbox size={32} /></div>
              <h3 className="text-xl font-bold text-white mb-2">System Healthy</h3>
              <p className="text-text-muted max-w-xs mx-auto">No pending critical alerts or disputes require immediate attention.</p>
            </div>
          </div>

          <div className="section-container mt-16">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
               <Activity size={24} className="text-primary" /> Global Activity
            </h2>
            <div className="glass-card p-8 border-white/5">
               <div className="flex flex-col gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted">
                             <Terminal size={18} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white">New user registered via SSO</p>
                             <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Today • 14:2{i} PM</p>
                          </div>
                       </div>
                       <ArrowRight size={16} className="text-text-muted opacity-30" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="sidebar flex flex-col gap-8">
          <div className="glass-card p-8 bg-gradient-to-br from-red-500/5 to-transparent">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
               <Server size={20} className="text-red-500" /> Infrastructure
            </h3>
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Main DB</span>
                  <span className="flex items-center gap-1.5 text-success text-[10px] font-black uppercase">
                     <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div> Online
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Auth Service</span>
                  <span className="flex items-center gap-1.5 text-success text-[10px] font-black uppercase">
                     <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div> Online
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Socket IO</span>
                  <span className="flex items-center gap-1.5 text-success text-[10px] font-black uppercase">
                     <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div> Online
                  </span>
               </div>
            </div>
          </div>

          <div className="glass-card p-8">
             <h3 className="text-xl font-bold text-white mb-8">Admin Tools</h3>
             <div className="flex flex-col gap-3">
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-primary hover:border-primary transition-all flex items-center justify-center gap-3">
                   <Users size={18}/> Manage Users
                </button>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-secondary hover:border-secondary transition-all flex items-center justify-center gap-3">
                   <BarChart3 size={18}/> Analytics Export
                </button>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-red-500 hover:border-red-500 transition-all flex items-center justify-center gap-3">
                   <Database size={18}/> System Backup
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
