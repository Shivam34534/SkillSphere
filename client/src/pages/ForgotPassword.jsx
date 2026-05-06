import React, { useState } from 'react';
import { Mail, ArrowRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setSubmitted(true);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container flex items-center justify-center min-h-screen bg-background-dark p-4">
      <div className="glow-sphere main-glow absolute top-1/4 left-1/3 opacity-30"></div>
      <div className="glass-card auth-card w-full max-w-md p-8 relative z-10">
        <Link 
          to="/login" 
          className="absolute top-6 left-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all z-20 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        
        <div className="auth-header text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-text-main mb-2">Account Recovery</h2>
          <p className="text-text-muted">Enter your campus email to receive a password reset link.</p>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-success border border-success/20">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Check your inbox</h3>
            <p className="text-text-muted mb-8">{message}</p>
            <Link to="/login" className="btn-primary w-full py-3 flex items-center justify-center">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form flex flex-col gap-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="input-group">
              <label htmlFor="forgot-email" className="block text-sm font-medium text-text-muted mb-2">College Email</label>
              <div className="input-wrapper relative flex items-center">
                <Mail className="input-icon absolute left-3 text-text-muted" size={18} />
                <input 
                  type="email" 
                  id="forgot-email"
                  name="email"
                  autocomplete="email"
                  placeholder="alex@college.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? 'Sending link...' : <>Send Reset Link <ArrowRight size={18} /></>}
            </button>
          </form>
        )}
        
        <div className="auth-footer text-center mt-8 pt-6 border-t border-glass-border">
          <p className="text-text-muted">Remembered your password? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
