import React, { useState, useContext } from 'react';
import { User, Mail, Lock, ArrowRight, Briefcase, Phone, Building, Book, GraduationCap, ChevronLeft, CheckCircle, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: '',
    mobile: '', collegeName: '', department: '', year: '',
    skillsToTeach: '', skillsToLearn: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
    setStep(2);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Process skills into arrays
    const formattedData = {
      ...formData,
      skillsToTeach: formData.skillsToTeach.split(',').map(s => s.trim()).filter(Boolean),
      skillsToLearn: formData.skillsToLearn.split(',').map(s => s.trim()).filter(Boolean)
    };

    const result = await register(formattedData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{padding: '4rem 2rem', alignItems: 'flex-start'}}>
      <div className="glow-sphere secondary-glow" style={{ top: '30%', right: '20%' }}></div>
      <div className="glow-sphere main-glow" style={{ bottom: '10%', left: '10%' }}></div>
      
      <div className="glass-card auth-card" style={{maxWidth: '600px', width: '100%'}}>
        
        {step > 1 && (
          <button type="button" onClick={prevStep} style={{background: 'transparent', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem'}}>
            <ChevronLeft size={16} /> Back
          </button>
        )}

        <div className="auth-header">
          {step === 1 && <h2>Choose your journey</h2>}
          {step === 2 && <h2>Create your account</h2>}
          {step === 3 && <h2>Verify your campus</h2>}
          {step === 4 && <h2>Set your skills</h2>}
          
          <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem'}}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{width: '40px', height: '4px', borderRadius: '2px', background: s <= step ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}}></div>
            ))}
          </div>
          {error && <div style={{color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px'}}>{error}</div>}
        </div>
        
        {step === 1 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <button type="button" className="glass-card" onClick={() => handleRoleSelect('STUDENT')} style={{padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', background: 'rgba(255,255,255,0.02)'}} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
              <div style={{background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '12px', color: '#c4b5fd'}}>
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 style={{color: 'white', marginBottom: '0.5rem'}}>Student</h3>
                <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0}}>I want to learn, hire peers, and build my portfolio.</p>
              </div>
            </button>

            <button type="button" className="glass-card" onClick={() => handleRoleSelect('FREELANCER')} style={{padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', background: 'rgba(255,255,255,0.02)'}} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--secondary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
              <div style={{background: 'rgba(217, 70, 239, 0.1)', padding: '1rem', borderRadius: '12px', color: '#f5d0fe'}}>
                <Briefcase size={24} />
              </div>
              <div>
                <h3 style={{color: 'white', marginBottom: '0.5rem'}}>Freelancer</h3>
                <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0}}>I want to offer my skills and earn money on campus.</p>
              </div>
            </button>

            <button type="button" className="glass-card" onClick={() => handleRoleSelect('CLUB')} style={{padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', background: 'rgba(255,255,255,0.02)'}} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
              <div style={{background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px', color: '#bfdbfe'}}>
                <Building size={24} />
              </div>
              <div>
                <h3 style={{color: 'white', marginBottom: '0.5rem'}}>Campus Club / Org</h3>
                <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0}}>I want to recruit talent and manage our internal economy.</p>
              </div>
            </button>

            <div className="auth-footer" style={{marginTop: '1rem'}}>
              <p>Already have an account? <Link to="/login" className="gradient-text">Log in</Link></p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="auth-form">
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
              <label>Mobile Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input type="tel" name="mobile" placeholder="+91 9876543210" value={formData.mobile} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            
            <button type="button" onClick={nextStep} className="btn-primary full-width" style={{ marginTop: '1rem', padding: '1rem' }} disabled={!formData.name || !formData.email || !formData.password || !formData.mobile}>
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="auth-form">
            <div style={{background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
              <CheckCircle size={24} color="#10b981" />
              <div style={{color: '#10b981', fontSize: '0.9rem'}}>Email verified successfully. Let's setup your campus profile.</div>
            </div>

            <div className="input-group">
              <label>College / University Name</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={18} />
                <input type="text" name="collegeName" placeholder="e.g. IIT Bombay" value={formData.collegeName} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Department / Major</label>
              <div className="input-wrapper">
                <Book className="input-icon" size={18} />
                <input type="text" name="department" placeholder="e.g. Computer Science" value={formData.department} onChange={handleChange} required />
              </div>
            </div>

            {formData.role !== 'CLUB' && (
              <div className="input-group">
                <label>Year of Study</label>
                <div className="input-wrapper">
                  <GraduationCap className="input-icon" size={18} />
                  <select name="year" value={formData.year} onChange={handleChange} required>
                    <option value="">Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
              </div>
            )}
            
            <button type="button" onClick={nextStep} className="btn-primary full-width" style={{ marginTop: '1rem', padding: '1rem' }} disabled={!formData.collegeName || !formData.department}>
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSignup} className="auth-form">
            <div style={{background: 'rgba(217, 70, 239, 0.1)', border: '1px solid rgba(217, 70, 239, 0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
              <Sparkles size={24} color="#d946ef" />
              <div style={{color: '#f5d0fe', fontSize: '0.9rem'}}>This powers your gig matching algorithm.</div>
            </div>

            <div className="input-group">
              <label>What can you teach or offer? (Comma separated)</label>
              <div className="input-wrapper">
                <input type="text" name="skillsToTeach" placeholder="e.g. React, UI Design, Video Editing" value={formData.skillsToTeach} onChange={handleChange} style={{paddingLeft: '1rem'}} />
              </div>
              <span style={{fontSize: '0.8rem', color: '#64748b'}}>These are skills you can monetize.</span>
            </div>

            <div className="input-group">
              <label>What do you want to learn? (Comma separated)</label>
              <div className="input-wrapper">
                <input type="text" name="skillsToLearn" placeholder="e.g. Python, Machine Learning, Marketing" value={formData.skillsToLearn} onChange={handleChange} style={{paddingLeft: '1rem'}} />
              </div>
            </div>
            
            <button type="submit" className="btn-primary full-width" style={{ marginTop: '1rem', padding: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Setup & Enter Dashboard'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
