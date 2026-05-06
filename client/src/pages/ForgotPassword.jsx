import React, { useState } from 'react';
import { Mail, ArrowRight, ChevronLeft, CheckCircle, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
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
        setStep(2);
      } else {
        setError(data.message || 'Could not send verification code.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3);
      } else {
        setError(data.message || 'Invalid verification code.');
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
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
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password updated successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Reset failed.');
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container flex items-center justify-center min-h-screen bg-background-dark py-12 px-4">
      <div className="glow-sphere main-glow absolute top-1/4 left-1/4 opacity-20 bg-primary"></div>
      <div className="glow-sphere secondary-glow absolute bottom-1/4 right-1/4 opacity-20 bg-secondary"></div>
      
      <div className="glass-card auth-card w-full max-w-md p-8 relative z-10">
        <Link 
          to="/login" 
          className="absolute top-6 left-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </Link>

        <div className="auth-header text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            {step === 1 && <Mail size={32} />}
            {step === 2 && <ShieldCheck size={32} />}
            {step === 3 && <Lock size={32} />}
          </div>
          <h2 className="text-3xl font-display font-bold text-text-main">
            {step === 1 && "Account Recovery"}
            {step === 2 && "Verify Code"}
            {step === 3 && "Set New Password"}
          </h2>
          <p className="text-text-muted mt-2">
            {step === 1 && "Enter your campus email to receive a 6-digit reset code."}
            {step === 2 && `We've sent a 6-digit code to ${email}`}
            {step === 3 && "Choose a strong password for your SkillSphere account."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {message && step !== 3 && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 text-success rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle size={18} />
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-6">
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

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
            >
              {loading ? 'Sending code...' : 'Send Reset Code'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="input-group">
              <label htmlFor="reset-otp" className="block text-sm font-medium text-text-muted mb-2 text-center">Enter 6-Digit Code</label>
              <input 
                type="text" 
                id="reset-otp"
                name="otp"
                maxLength={6}
                placeholder="000000" 
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-black/20 border border-glass-border rounded-lg py-4 text-center text-3xl font-bold tracking-[0.5rem] text-white focus:border-primary outline-none transition-all"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || otp.length !== 6} 
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="w-full text-sm text-text-muted hover:text-white transition-colors"
            >
              Change Email Address
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            {message ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 text-success mb-4 animate-bounce">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                <p className="text-text-muted">{message}</p>
                <p className="text-xs text-text-muted mt-4 italic">Redirecting to login...</p>
              </div>
            ) : (
              <>
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

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                >
                  {loading ? 'Updating...' : 'Reset Password'}
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </>
            )}
          </form>
        )}

        <div className="auth-footer mt-8 pt-6 border-t border-glass-border text-center">
          <p className="text-text-muted text-sm">
            Remembered your password? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
