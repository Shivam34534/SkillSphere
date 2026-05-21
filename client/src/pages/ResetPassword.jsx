import React, { useState } from 'react';
import { Lock, ArrowRight, ChevronLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract email and otp from navigation state (passed from ForgotPassword)
  const { email, otp } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      // Send email and otp to match the backend reset-password endpoint
      const payload = email && otp ? { email, otp, password } : { token, password };

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
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
    <div className="auth-container flex items-center justify-center min-h-screen bg-background-dark py-12 px-4">
      <div className="glow-sphere main-glow absolute top-1/4 left-1/4 opacity-20 bg-primary"></div>
      <div className="glow-sphere secondary-glow absolute bottom-1/4 right-1/4 opacity-20 bg-secondary"></div>
      
      <div className="glass-card auth-card w-full max-w-md p-8 relative z-10">
        {!success && (
          <Link 
            to="/login" 
            className="absolute top-6 left-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
        )}

        <div className="auth-header text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-display font-bold text-text-main mb-2">Set New Password</h2>
          <p className="text-text-muted">Choose a strong password for your SkillSphere account.</p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 text-success mb-4 animate-bounce">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Password Reset Successful!</h3>
            <p className="text-text-muted mb-8">Your account security has been updated.</p>
            <p className="text-xs text-text-muted italic mb-4">Redirecting to login...</p>
            <Link to="/login" className="btn-primary w-full py-3 flex items-center justify-center shadow-lg shadow-primary/20">
              Go to Login Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form flex flex-col gap-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            <div className="input-group">
              <label htmlFor="reset-password" name="password" className="block text-sm font-medium text-text-muted mb-2">New Password</label>
              <div className="input-wrapper relative flex items-center">
                <Lock className="input-icon absolute left-3 text-text-muted" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="reset-password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-2.5 pl-10 pr-12 text-white focus:border-primary outline-none transition-all"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-text-muted hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password" name="confirmPassword" className="block text-sm font-medium text-text-muted mb-2">Confirm Password</label>
              <div className="input-wrapper relative flex items-center">
                <Lock className="input-icon absolute left-3 text-text-muted" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="confirm-password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-2.5 pl-10 pr-12 text-white focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
            >
              {loading ? 'Updating...' : 'Reset Password'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
