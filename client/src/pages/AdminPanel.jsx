import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { 
  Users, Shield, AlertTriangle, BarChart3, TrendingUp, 
  Search, CheckCircle, XCircle, Ban, Eye, Filter,
  DollarSign, Briefcase, FileText, Settings
} from 'lucide-react';

const AdminPanel = () => {
  const { token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [token, activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers }),
        fetch(`${API_URL}/admin/users`, { headers }),
        fetch(`${API_URL}/admin/reports`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
    } catch (error) {
      console.error('Admin fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, status) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchAdminData();
    } catch (error) {
      alert('Update failed');
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchAdminData();
    } catch (error) {
      alert('Resolve failed');
    }
  };

  if (loading && !stats) return <div className="p-20 text-center"><div className="spinner mx-auto"></div></div>;

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black text-white mb-2">Campus <span className="text-primary">Admin</span></h1>
          <p className="text-text-muted">Platform governance, safety moderation, and system analytics.</p>
        </div>
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
           {['overview', 'users', 'reports', 'gigs'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-8 flex justify-between items-center bg-primary/5">
               <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Total Students</p>
                  <p className="text-3xl font-black text-white">{stats?.totalUsers}</p>
               </div>
               <Users size={40} className="text-primary opacity-20" />
            </div>
            <div className="glass-card p-8 flex justify-between items-center bg-accent/5">
               <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Live Gigs</p>
                  <p className="text-3xl font-black text-white">{stats?.totalGigs}</p>
               </div>
               <Briefcase size={40} className="text-accent opacity-20" />
            </div>
            <div className="glass-card p-8 flex justify-between items-center bg-success/5">
               <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Completed Exchanges</p>
                  <p className="text-3xl font-black text-white">{stats?.totalMatches}</p>
               </div>
               <TrendingUp size={40} className="text-success opacity-20" />
            </div>
            <div className="glass-card p-8 flex justify-between items-center bg-red-500/5">
               <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Active Reports</p>
                  <p className="text-3xl font-black text-white">{stats?.activeReports}</p>
               </div>
               <AlertTriangle size={40} className="text-red-500 opacity-20" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <BarChart3 size={24} className="text-primary" /> Revenue Insights
                </h3>
                <div className="h-64 flex items-end justify-between gap-4 py-4">
                   {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                     <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group transition-all hover:bg-primary/40 cursor-help" style={{ height: `${h}%` }}>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{(h*120).toLocaleString()}</span>
                     </div>
                   ))}
                </div>
                <div className="flex justify-between text-[10px] text-text-muted font-bold uppercase tracking-widest mt-4">
                   <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
             </div>

             <div className="glass-card p-8 bg-gradient-to-br from-white/5 to-transparent">
                <h3 className="text-xl font-bold text-white mb-6">Recent Platform Activity</h3>
                <div className="space-y-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                        <div className="w-10 h-10 rounded-full bg-background-dark border border-white/10 flex items-center justify-center text-primary">
                           <FileText size={18} />
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-bold text-white">New Gig Posted: Graphic Design for Tech Fest</p>
                           <p className="text-[10px] text-text-muted">By Coding Club • 2 mins ago</p>
                        </div>
                        <div className="text-[10px] font-bold text-success uppercase">Verified</div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                 <tr>
                    <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">User</th>
                    <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Trust Score</th>
                    <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {users.map(u => (
                   <tr key={u._id} className="hover:bg-white/[0.02] transition-all">
                      <td className="p-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/20">
                               {u.name.charAt(0)}
                            </div>
                            <div>
                               <p className="font-bold text-white">{u.name}</p>
                               <p className="text-xs text-text-muted">{u.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="p-6">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.accountStatus === 'active' ? 'bg-success/10 text-success border border-success/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {u.accountStatus}
                         </span>
                      </td>
                      <td className="p-6">
                         <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${u.trustScore}%` }}></div>
                         </div>
                         <span className="text-[10px] font-bold text-text-muted mt-1 block">{u.trustScore}% Verified</span>
                      </td>
                      <td className="p-6">
                         <div className="flex gap-2">
                            <button onClick={() => handleStatusUpdate(u._id, u.accountStatus === 'active' ? 'banned' : 'active')} className={`p-2 rounded-lg border transition-all ${u.accountStatus === 'active' ? 'border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white' : 'border-success/30 text-success hover:bg-success hover:text-white'}`}>
                               {u.accountStatus === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                            </button>
                            <Link to={`/profile/${u._id}`} className="p-2 rounded-lg border border-white/10 text-text-muted hover:text-white hover:border-white/30">
                               <Eye size={16} />
                            </Link>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {reports.length > 0 ? reports.map(report => (
             <div key={report._id} className={`glass-card p-8 border-l-4 ${report.status === 'PENDING' ? 'border-l-red-500 animate-pulse-slow' : 'border-l-success'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                         <AlertTriangle size={20} />
                      </div>
                      <div>
                         <h4 className="font-bold text-white">{report.reason}</h4>
                         <p className="text-xs text-text-muted">Target: <span className="text-white">{report.targetUserId?.name}</span></p>
                      </div>
                   </div>
                   <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${report.status === 'PENDING' ? 'bg-red-500 text-white' : 'bg-success text-white'}`}>
                      {report.status}
                   </span>
                </div>
                <p className="text-sm text-text-muted bg-white/5 p-4 rounded-xl mb-6 italic leading-relaxed">
                   "{report.details || "No additional details provided."}"
                </p>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                   <div className="text-[10px] text-text-muted font-bold">
                      Reported by {report.reporterId?.name}
                   </div>
                   {report.status === 'PENDING' && (
                     <div className="flex gap-3">
                        <button onClick={() => handleResolveReport(report._id, 'RESOLVED')} className="btn-primary py-2 px-5 text-[10px]">Resolve</button>
                        <button onClick={() => handleResolveReport(report._id, 'DISMISSED')} className="btn-ghost py-2 px-5 text-[10px] border border-white/10">Dismiss</button>
                     </div>
                   )}
                </div>
             </div>
           )) : (
             <div className="col-span-full py-20 text-center glass-card border-dashed">
                <Shield size={48} className="mx-auto mb-4 text-white/10" />
                <h3 className="text-2xl font-bold text-white mb-2">No active reports</h3>
                <p className="text-text-muted">Great job! The campus is currently safe and secure.</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
