import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Wallet as WalletIcon, Briefcase, Zap } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (link) => {
    if (link) navigate(link);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="nav-link relative p-2 rounded-full hover:bg-white/5 transition-all">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center border-2 border-background-dark font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 glass-card p-0 overflow-hidden shadow-2xl z-[100] animate-in fade-in zoom-in slide-in-from-top-2">
          <div className="p-4 border-b border-glass-border flex justify-between items-center bg-white/5">
            <h3 className="font-bold text-sm">Notifications</h3>
            <button onClick={markAllRead} className="text-[10px] text-primary hover:underline font-bold uppercase tracking-widest">Mark all as read</button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  onClick={() => handleNotificationClick(n.link)}
                  className={`p-4 border-b border-glass-border cursor-pointer hover:bg-white/5 transition-colors flex gap-3 ${!n.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    n.type === 'MATCH' ? 'bg-blue-500/20 text-blue-400' :
                    n.type === 'GIG' ? 'bg-purple-500/20 text-purple-400' :
                    n.type === 'WALLET' ? 'bg-success/20 text-success' :
                    'bg-white/10 text-white'
                  }`}>
                    {n.type === 'MATCH' ? <Zap size={18} /> : 
                     n.type === 'GIG' ? <Briefcase size={18} /> :
                     n.type === 'WALLET' ? <WalletIcon size={18} /> :
                     <Bell size={18} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">{n.title}</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed">{n.message}</p>
                    <span className="text-[9px] text-text-muted mt-2 block">{new Date(n.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto mb-3 text-white/10" />
                <p className="text-xs text-text-muted">No notifications yet</p>
              </div>
            )}
          </div>
          <div className="p-3 bg-white/5 text-center">
             <button className="text-[10px] text-text-muted hover:text-white transition-colors">View All Notifications</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
