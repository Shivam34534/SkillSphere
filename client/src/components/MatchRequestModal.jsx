import React, { useState } from 'react';
import Modal from './Modal';
import { Mail, Zap, Target, Send, Loader2 } from 'lucide-react';

const MatchRequestModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    userBEmail: '',
    skillOfferedByA: '',
    skillOfferedByB: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Synergy Request">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-4 mb-8">
           <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <Zap size={20} />
           </div>
           <div>
              <p className="text-xs font-bold text-white mb-1">Initiate a Skill Swap</p>
              <p className="text-[10px] text-text-muted leading-relaxed">Match with a peer to exchange skills without spending credits.</p>
           </div>
        </div>

        <div className="space-y-5">
          <div className="input-group">
            <label className="block text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest ml-1">
              Student Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="email"
                name="userBEmail"
                required
                placeholder="campus-buddy@university.edu"
                value={formData.userBEmail}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary outline-none transition-all placeholder:text-text-muted/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="block text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest ml-1 text-secondary">
                You Teach
              </label>
              <div className="relative group">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={16} />
                <input
                  type="text"
                  name="skillOfferedByA"
                  required
                  placeholder="e.g. Photoshop"
                  value={formData.skillOfferedByA}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-secondary outline-none transition-all placeholder:text-text-muted/30"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="block text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest ml-1 text-accent">
                You Learn
              </label>
              <div className="relative group">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={16} />
                <input
                  type="text"
                  name="skillOfferedByB"
                  required
                  placeholder="e.g. Calculus"
                  value={formData.skillOfferedByB}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-accent outline-none transition-all placeholder:text-text-muted/30"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-4 mt-8 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Processing...
            </>
          ) : (
            <>
              <Send size={18} /> Send Synergy Request
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default MatchRequestModal;
