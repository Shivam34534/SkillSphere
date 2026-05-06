import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Zap, Clock, Send, Plus, Shield, TrendingUp, History } from 'lucide-react';
import { updateUser } from '../store/slices/authSlice';

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
        fetch('http://localhost:5000/api/v1/transactions/summary', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/v1/transactions', {
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
      const response = await fetch('http://localhost:5000/api/v1/transactions/transfer', {
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
        // Update global user state
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
    <div className="flex items-center justify-center min-h-screen bg-background-dark">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text-main mb-2">Campus Wallet</h1>
          <p className="text-text-muted">Manage your earnings, spendings, and XP rewards.</p>
        </div>
        <button 
          onClick={() => setShowTransferModal(true)}
          className="btn-primary flex items-center gap-2 py-3 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Send size={18} /> Transfer Credits
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 border-l-4 border-yellow-400 bg-gradient-to-br from-yellow-400/5 to-transparent">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400">
              <Zap size={24} />
            </div>
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Balance</span>
          </div>
          <h2 className="text-3xl font-bold text-text-main">{summary?.balance || 0}</h2>
          <p className="text-xs text-text-muted mt-1">Available Credits</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-primary bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Shield size={24} />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">XP Points</span>
          </div>
          <h2 className="text-3xl font-bold text-text-main">{summary?.xp || 0}</h2>
          <p className="text-xs text-text-muted mt-1">Total Experience</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-success bg-gradient-to-br from-success/5 to-transparent">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-bold text-success uppercase tracking-widest">Earnings</span>
          </div>
          <h2 className="text-3xl font-bold text-text-main">+{summary?.totalEarned || 0}</h2>
          <p className="text-xs text-text-muted mt-1">Total Earned</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-secondary bg-gradient-to-br from-secondary/5 to-transparent">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <Clock size={24} />
            </div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Spent</span>
          </div>
          <h2 className="text-3xl font-bold text-text-main">-{summary?.totalSpent || 0}</h2>
          <p className="text-xs text-text-muted mt-1">Total Spent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-glass-border flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <History size={20} className="text-primary" />
                Transaction History
              </h3>
              <div className="flex gap-2">
                <button className="text-xs py-1 px-3 rounded-full bg-white/5 hover:bg-white/10 text-text-muted">All</button>
                <button className="text-xs py-1 px-3 rounded-full bg-white/5 hover:bg-white/10 text-text-muted">Earned</button>
                <button className="text-xs py-1 px-3 rounded-full bg-white/5 hover:bg-white/10 text-text-muted">Spent</button>
              </div>
            </div>
            <div className="divide-y divide-glass-border">
              {transactions.length > 0 ? transactions.map((tx) => {
                const isReceived = tx.receiverId?._id === user._id;
                return (
                  <div key={tx._id} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${isReceived ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'}`}>
                        {isReceived ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <h4 className="text-text-main font-semibold">{tx.reason}</h4>
                        <p className="text-xs text-text-muted">
                          {isReceived ? `From: ${tx.senderId?.name}` : `To: ${tx.receiverId?.name}`} • {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${isReceived ? 'text-success' : 'text-text-main'}`}>
                        {isReceived ? '+' : '-'}{tx.amount}
                      </div>
                      <span className="text-[10px] text-text-muted uppercase tracking-tighter">Credits</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-12 text-center text-text-muted">
                  <p>No transactions yet. Start learning or teaching to earn credits!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-transparent">
            <h3 className="text-lg font-bold mb-4">How to Earn?</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">1</div>
                <p className="text-text-muted">List your skills and teach peers to earn credits.</p>
              </li>
              <li className="flex gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">2</div>
                <p className="text-text-muted">Join campus gigs and complete tasks.</p>
              </li>
              <li className="flex gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">3</div>
                <p className="text-text-muted">Complete skill exchange sessions to gain XP.</p>
              </li>
            </ul>
          </div>

          <div className="glass-card p-6 border border-glass-border">
            <h3 className="text-lg font-bold mb-4">Wallet Security</h3>
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl text-xs text-text-muted leading-relaxed">
              <Shield size={16} className="text-success shrink-0" />
              <p>Transactions are encrypted and linked to your student ID. Always verify the receiver's email before transferring credits.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTransferModal(false)}></div>
          <div className="glass-card w-full max-w-md relative z-10 p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-text-main mb-6">Transfer Credits</h2>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Receiver Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="student@college.edu"
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                  value={transferData.receiverEmail}
                  onChange={(e) => setTransferData({...transferData, receiverEmail: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Amount</label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                  value={transferData.amount}
                  onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Reason</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Web Dev session"
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                  value={transferData.reason}
                  onChange={(e) => setTransferData({...transferData, reason: e.target.value})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 btn-ghost py-3 rounded-xl border border-glass-border"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={transferLoading}
                  className="flex-1 btn-primary py-3 rounded-xl"
                >
                  {transferLoading ? 'Processing...' : 'Confirm Transfer'}
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
