import React, { useState, useContext } from 'react';
import { User, Mail, Lock, ArrowRight, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="glow-sphere secondary-glow" style={{ top: '30%', right: '20%' }}></div>
      <div className="glass-card auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join the most exclusive campus marketplace.</p>
        </div>
        
        <form onSubmit={handleSignup} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input type="text" name="name" placeholder="Alex Mercer" value={formData.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>College Email (.edu required)</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input type="email" name="email" placeholder="alex@university.edu" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>I want to join as a:</label>
            <div className="input-wrapper">
              <Briefcase className="input-icon" size={18} />
              <select name="role" value={formData.role} onChange={handleChange} className="role-select">
                <option value="STUDENT">Student (Hire/Learn)</option>
                <option value="FREELANCER">Freelancer (Offer Skills)</option>
                <option value="CLUB">Campus Club (Recruit)</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn-primary full-width" style={{ marginTop: '1rem' }}>
            Create Account <ArrowRight size={18} />
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="gradient-text">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
