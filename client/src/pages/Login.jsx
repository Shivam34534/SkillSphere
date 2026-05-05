import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error: reduxError } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password, rememberMe }));
  };

  return (
    <div className="auth-container flex items-center justify-center min-h-screen bg-background-dark p-4">
      <div className="glow-sphere main-glow absolute top-1/4 left-1/3 opacity-30"></div>
      <div className="glass-card auth-card w-full max-w-md p-8 relative z-10">
        <Link 
          to="/" 
          className="absolute top-6 left-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all z-20 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <div className="auth-header text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-text-muted">Enter your credentials to access your SkillSphere account.</p>
        </div>
        
        <form onSubmit={handleLogin} className="auth-form flex flex-col gap-6">
          {reduxError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm">
              {reduxError}
            </div>
          )}
          
          <div className="input-group">
            <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
            <div className="input-wrapper relative flex items-center">
              <Mail className="input-icon absolute left-3 text-text-muted" size={18} />
              <input 
                type="email" 
                placeholder="alex@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-glass-border rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-primary outline-none transition-all"
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
            <div className="input-wrapper relative flex items-center">
              <Lock className="input-icon absolute left-3 text-text-muted" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
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
          
          <div className="auth-options flex items-center justify-between text-sm">
            <label className="checkbox-container flex items-center gap-2 cursor-pointer text-text-muted">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-glass-border bg-black/20 text-primary"
              /> Remember me
            </label>
            <a href="#" className="forgot-link text-primary hover:underline transition-all">Forgot password?</a>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>
        
        <div className="auth-footer text-center mt-8 pt-6 border-t border-glass-border">
          <p className="text-text-muted">Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
