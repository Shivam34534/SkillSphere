import React, { useState } from 'react';
import { Lock, ArrowRight, ChevronLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
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
    <div className="auth-container flex items-center justify-center min-h-screen bg-background-dark p-4">
      <div className="glow-sphere main-glow absolute top-1/4 left-1/3 opacity-30"></div>
      <div className="glass-card auth-card w-full max-w-md p-8 relative z-10">
        <div className="auth-header text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-text-main mb-2">New Password</h2>
          <p className="text-text-muted">Set a strong password to protect your SkillSphere account.</p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-success border border-success/20">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
            <p className="text-text-muted mb-8">Your account security has been updated. Redirecting to login...</p>
            <Link to="/login" className="btn-primary w-full py-3 flex items-center justify-center">
              Go to Login
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
              <label htmlFor="reset-password" name="password" className="block text-sm font-medium text-text-muted mb-2">New Password</label>
              <div className="input-wrapper relative flex items-center">
                <Lock className="input-icon absolute left-3 text-text-muted" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="reset-password"
                  name="password"
                  autocomplete="new-password"
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
                  autocomplete="new-password"
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-2.5 pl-10 pr-12 text-white focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? 'Updating...' : <>Reset Password <ArrowRight size={18} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
