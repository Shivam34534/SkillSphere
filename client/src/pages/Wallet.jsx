import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowUpRight, ArrowDownLeft, Zap, Clock, Send, Shield, TrendingUp, History, Inbox, Wallet as WalletIcon } from 'lucide-react';
import { updateUser } from '../store/slices/authSlice';
import { API_URL } from '../config';

const Wallet = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({ receiverEmail: '', amount: '', reason: '' });
  const [transferLoading, setTransferLoading] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [summaryRes, transRes] = await Promise.all([
        fetch(`${API_URL}/transactions/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (summaryRes.ok && transRes.ok) {
        const summaryData = await summaryRes.json();
        const transData = await transRes.json();
        setSummary(summaryData);
        setTransactions(transData);
      }
    } catch (error) {
      console.error('Failed to fetch wallet data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransferLoading(true);
    try {
      const response = await fetch(`${API_URL}/transactions/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(transferData)
      });

      if (response.ok) {
        alert('Credits transferred successfully!');
        setShowTransferModal(false);
        setTransferData({ receiverEmail: '', amount: '', reason: '' });
        fetchWalletData();
        dispatch(updateUser({ walletBalance: user.walletBalance - Number(transferData.amount) }));
      } else {
        const err = await response.json();
        alert(err.message);
      }
    } catch (error) {
      alert('Transfer failed');
    } finally {
      setTransferLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
       <div className="icon-box new-feature-icon w-20 h-20 rounded-3xl animate-pulse mb-8">
          <WalletIcon size={32} color="white" />
       </div>
       <p className="text-text-muted font-black tracking-widest uppercase text-xs">Accessing vault...</p>
    </div>
  );

  return (
    <div className="wallet-container px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <div className="feature-tag mb-4">FINANCE</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Campus <span className="gradient-text">Wallet.</span>
          </h1>
          <p className="text-text-muted max-w-xl text-base md:text-lg leading-relaxed">
            Manage your earnings, spendings, and XP rewards in a single high-trust environment.
          </p>
        </div>
        <button 
          onClick={() => setShowTransferModal(true)}
          className="btn-primary flex items-center gap-3 py-4 px-10 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs"
        >
          <Send size={18} /> Send Credits
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="feature-card p-8 bg-gradient-to-br from-yellow-400/10 to-transparent border-yellow-400/20 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center text-yellow-400 border border-yellow-400/20">
              <Zap size={24} />
            </div>
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Balance</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform origin-left">{summary?.balance || 0}</h2>
          <p className="text-[10px] text-text-muted font-bold mt-2 uppercase tracking-widest">Available Credits</p>
        </div>

        <div className="feature-card p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <Shield size={24} />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Experience</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform origin-left">{summary?.xp || 0}</h2>
          <p className="text-[10px] text-text-muted font-bold mt-2 uppercase tracking-widest">XP Points</p>
        </div>

        <div className="feature-card p-8 bg-gradient-to-br from-success/10 to-transparent border-success/20 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center text-success border border-success/20">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black text-success uppercase tracking-widest">Income</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform origin-left">+{summary?.totalEarned || 0}</h2>
          <p className="text-[10px] text-text-muted font-bold mt-2 uppercase tracking-widest">Total Earned</p>
        </div>

        <div className="feature-card p-8 bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20">
              <Clock size={24} />
            </div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Expense</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform origin-left">-{summary?.totalSpent || 0}</h2>
          <p className="text-[10px] text-text-muted font-bold mt-2 uppercase tracking-widest">Total Spent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="feature-card p-0 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <History size={24} className="text-primary" />
                History
              </h3>
              <div className="flex gap-2">
                <button className="text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-lg bg-primary text-white">All</button>
                <button className="text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-lg bg-white/5 text-text-muted hover:bg-white/10">In</button>
                <button className="text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-lg bg-white/5 text-text-muted hover:bg-white/10">Out</button>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {transactions.length > 0 ? transactions.map((tx) => {
                const isReceived = tx.receiverId?._id === user._id;
                return (
                  <div key={tx._id} className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isReceived ? 'bg-success/10 text-success border-success/20' : 'bg-secondary/10 text-secondary border-secondary/20'}`}>
                        {isReceived ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1 group-hover:text-primary transition-colors">{tx.reason}</h4>
                        <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">
                          {isReceived ? `From: ${tx.senderId?.name}` : `To: ${tx.receiverId?.name}`} • {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-black ${isReceived ? 'text-success' : 'text-white'}`}>
                        {isReceived ? '+' : '-'}{tx.amount}
                      </div>
                      <span className="text-[9px] text-text-muted font-black uppercase tracking-widest">Credits</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <Inbox size={48} className="text-text-muted/20" />
                  <p className="text-text-muted font-bold">No transactions recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="flex flex-col gap-12">
          <div className="feature-card p-10 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 relative overflow-hidden group">
            <TrendingUp className="absolute -bottom-10 -right-10 text-primary/5 group-hover:scale-150 transition-transform duration-1000" size={150} />
            <h3 className="text-2xl font-black text-white mb-8">Boost Earnings</h3>
            <ul className="space-y-6 relative z-10">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xs font-black">1</div>
                <p className="text-sm text-text-muted font-medium leading-relaxed">List high-demand skills in the marketplace.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xs font-black">2</div>
                <p className="text-sm text-text-muted font-medium leading-relaxed">Complete barter sessions to build trust score.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xs font-black">3</div>
                <p className="text-sm text-text-muted font-medium leading-relaxed">Participate in club-hosted gigs for bulk XP.</p>
              </li>
            </ul>
          </div>

          <div className="feature-card p-8 border-white/5 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white mb-6">Security Shield</h3>
            <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl text-xs text-text-muted leading-relaxed border border-white/5">
              <Shield size={20} className="text-success shrink-0" />
              <p className="font-medium">Every credit transfer is immutable and cryptographically linked to your verified student identity. Always double-check recipient emails.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowTransferModal(false)}></div>
          <div className="feature-card w-full max-w-lg relative z-10 p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-white mb-8 tracking-tighter">Send Credits</h2>
            <form onSubmit={handleTransfer} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Recipient Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@college.edu"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-primary outline-none transition-all"
                  value={transferData.receiverEmail}
                  onChange={(e) => setTransferData({...transferData, receiverEmail: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Amount</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-primary outline-none transition-all"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Reason</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Design Gig"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-primary outline-none transition-all"
                    value={transferData.reason}
                    onChange={(e) => setTransferData({...transferData, reason: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={transferLoading}
                  className="flex-1 btn-primary py-4 rounded-2xl text-xs"
                >
                  {transferLoading ? 'Verifying...' : 'Authorize Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
