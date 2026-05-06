import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, ArrowRight, Briefcase, Phone, Building, Book, GraduationCap, ChevronLeft, CheckCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { register, verifyOTP } from '../store/slices/authSlice';

function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: '',
    mobile: '', collegeName: '', department: '', year: '',
    skillsToTeach: '', skillsToLearn: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error: reduxError, successMessage } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
    
    // Process skills into arrays
    const formattedData = {
      ...formData,
      skillsToTeach: formData.skillsToTeach.split(',').map(s => s.trim()).filter(Boolean),
      skillsToLearn: formData.skillsToLearn.split(',').map(s => s.trim()).filter(Boolean)
    };

    const result = await dispatch(register(formattedData));
    if (register.fulfilled.match(result)) {
      setStep(5);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    dispatch(verifyOTP({ email: formData.email, otp: formData.otp }));
  };

  const renderTooltip = (field, text) => {
    if (focusedField === field && !formData[field]) {
      return (
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none hidden md:block">
          <div className="bg-primary/90 backdrop-blur-md text-white text-[10px] py-2 px-3 rounded-lg shadow-xl border border-white/20 whitespace-nowrap animate-in fade-in zoom-in slide-in-from-left-2 duration-300">
            {text}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-primary/90 rotate-45 border-l border-b border-white/20"></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="auth-container flex items-start justify-center min-h-screen bg-background-dark py-16 px-4 transition-all duration-700">
      <div className={`glow-sphere secondary-glow absolute top-1/3 right-1/4 opacity-20 transition-all duration-1000 ${
        formData.role === 'FREELANCER' ? 'bg-secondary' : 
        formData.role === 'CLUB' ? 'bg-accent' : 'bg-primary'
      }`}></div>
      <div className={`glow-sphere main-glow absolute bottom-1/4 left-1/4 opacity-20 transition-all duration-1000 ${
        formData.role === 'FREELANCER' ? 'bg-secondary' : 
        formData.role === 'CLUB' ? 'bg-accent' : 'bg-primary'
      }`}></div>
      
      <div className="glass-card auth-card w-full max-w-xl p-8 md:p-12 relative z-10">
        
        <button 
          type="button" 
          onClick={step === 1 ? () => navigate('/') : prevStep} 
          className="absolute top-6 left-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all z-20 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <div className="auth-header text-center mb-10">
          {step === 1 && <h2 className="text-3xl font-display font-bold text-text-main">Choose your journey</h2>}
          {step === 2 && <h2 className="text-3xl font-display font-bold text-text-main">Create your account</h2>}
          {step === 3 && <h2 className="text-3xl font-display font-bold text-text-main">Verify your campus</h2>}
          {step === 4 && <h2 className="text-3xl font-display font-bold text-text-main">Set your skills</h2>}
          {step === 5 && <h2 className="text-3xl font-display font-bold text-text-main">Verify your email</h2>}
          
          <div className="flex justify-center gap-2 mt-4">
            {[1,2,3,4,5].map(s => (
              <div key={s} className={`h-1 rounded-full transition-all duration-500 ${
                s <= step ? (
                  formData.role === 'FREELANCER' ? 'w-8 bg-secondary' : 
                  formData.role === 'CLUB' ? 'w-8 bg-accent' : 'w-8 bg-primary'
                ) : 'w-4 bg-white/10'
              }`}></div>
            ))}
          </div>
          {reduxError && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">{reduxError}</div>}
        </div>
        
        {step === 1 && (
          <div className="grid gap-4">
            <button type="button" className="glass-card p-6 flex items-start gap-4 text-left hover:border-primary transition-all bg-white/[0.02]" onClick={() => handleRoleSelect('STUDENT')}>
              <div className="bg-primary/10 p-3 rounded-xl text-primary-hover"><GraduationCap size={24} /></div>
              <div><h3 className="text-lg font-display font-semibold text-text-main mb-1">Student</h3><p className="text-text-muted text-sm leading-relaxed">I want to learn, hire peers, and build my portfolio.</p></div>
            </button>

            <button type="button" className="glass-card p-6 flex items-start gap-4 text-left hover:border-secondary transition-all bg-white/[0.02]" onClick={() => handleRoleSelect('FREELANCER')}>
              <div className="bg-secondary/10 p-3 rounded-xl text-secondary"><Briefcase size={24} /></div>
              <div><h3 className="text-lg font-display font-semibold text-text-main mb-1">Freelancer</h3><p className="text-text-muted text-sm leading-relaxed">I want to offer my skills and earn money on campus.</p></div>
            </button>

            <button type="button" className="glass-card p-6 flex items-start gap-4 text-left hover:border-accent transition-all bg-white/[0.02]" onClick={() => handleRoleSelect('CLUB')}>
              <div className="bg-accent/10 p-3 rounded-xl text-accent"><Building size={24} /></div>
              <div><h3 className="text-lg font-display font-semibold text-text-main mb-1">Campus Club / Org</h3><p className="text-text-muted text-sm leading-relaxed">I want to recruit talent and manage our internal economy.</p></div>
            </button>

            <div className="text-center mt-6">
              <p className="text-text-muted">Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link></p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="input-group relative">
              <label htmlFor="signup-name" className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 text-text-muted" size={18} />
                <input 
                  type="text" 
                  id="signup-name"
                  name="name" 
                  autocomplete="name"
                  placeholder="Alex Mercer" 
                  value={formData.name} 
                  onChange={handleChange} 
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" 
                  required 
                />
              </div>
              {renderTooltip('name', 'Enter your full legal name')}
            </div>

            <div className="input-group relative">
              <label htmlFor="signup-email" className="block text-sm font-medium text-text-muted mb-2">College or Personal Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 text-text-muted" size={18} />
                <input 
                  type="email" 
                  id="signup-email"
                  name="email" 
                  autocomplete="email"
                  placeholder="alex@example.com" 
                  value={formData.email} 
                  onChange={handleChange} 
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" 
                  required 
                />
              </div>
              {renderTooltip('email', 'Use your .edu or personal email')}
            </div>

            <div className="input-group relative">
              <label htmlFor="signup-mobile" className="block text-sm font-medium text-text-muted mb-2">Mobile Number</label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 text-text-muted" size={18} />
                <input 
                  type="tel" 
                  id="signup-mobile"
                  name="mobile" 
                  autocomplete="tel"
                  placeholder="+91 9876543210" 
                  value={formData.mobile} 
                  onChange={handleChange} 
                  onFocus={() => setFocusedField('mobile')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" 
                  required 
                />
              </div>
              {renderTooltip('mobile', 'Include country code (e.g. +91)')}
            </div>
            
            <div className="input-group relative">
              <label htmlFor="signup-password" name="password" className="block text-sm font-medium text-text-muted mb-2">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 text-text-muted" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="signup-password"
                  name="password" 
                  autocomplete="new-password"
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={handleChange} 
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-12 text-white focus:border-primary outline-none" 
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
              {renderTooltip('password', 'Min 8 characters required')}
            </div>
            
            <button 
              type="button" 
              onClick={nextStep} 
              className={`w-full py-4 mt-4 flex items-center justify-center gap-2 transition-all duration-300 rounded-xl font-bold ${
                formData.role === 'FREELANCER' ? 'bg-secondary hover:bg-secondary-hover text-white' : 
                formData.role === 'CLUB' ? 'bg-accent hover:bg-accent-hover text-white' : 
                'bg-primary hover:bg-primary-hover text-white'
              }`} 
              disabled={!formData.name || !formData.email || !formData.password || !formData.mobile}
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm">
              <CheckCircle size={20} />
              <p>Email format valid. Let's setup your campus profile.</p>
            </div>

            <div className="input-group relative">
              <label htmlFor="college-name" className="block text-sm font-medium text-text-muted mb-2">College / University Name</label>
              <div className="relative flex items-center">
                <Building className="absolute left-3 text-text-muted" size={18} />
                <input 
                  type="text" 
                  id="college-name"
                  name="collegeName" 
                  autocomplete="organization"
                  placeholder="e.g. IIT Bombay" 
                  value={formData.collegeName} 
                  onChange={handleChange} 
                  onFocus={() => setFocusedField('collegeName')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" 
                  required 
                />
              </div>
              {renderTooltip('collegeName', 'Enter official college name')}
            </div>

            <div className="input-group relative">
              <label htmlFor="signup-department" className="block text-sm font-medium text-text-muted mb-2">Department / Major</label>
              <div className="relative flex items-center">
                <Book className="absolute left-3 text-text-muted" size={18} />
                <input 
                  type="text" 
                  id="signup-department"
                  name="department" 
                  placeholder="e.g. Computer Science" 
                  value={formData.department} 
                  onChange={handleChange} 
                  onFocus={() => setFocusedField('department')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" 
                  required 
                />
              </div>
              {renderTooltip('department', 'e.g. B.Tech, MBA, etc.')}
            </div>

            {formData.role !== 'CLUB' && (
              <div className="input-group">
                <label htmlFor="signup-year" className="block text-sm font-medium text-text-muted mb-2">Year of Study</label>
                <div className="relative flex items-center">
                  <GraduationCap className="absolute left-3 text-text-muted" size={18} />
                  <select id="signup-year" name="year" value={formData.year} onChange={handleChange} className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none appearance-none" required>
                    <option value="" className="bg-background-surface">Select Year</option>
                    <option value="1" className="bg-background-surface">First Year</option>
                    <option value="2" className="bg-background-surface">Second Year</option>
                    <option value="3" className="bg-background-surface">Third Year</option>
                    <option value="4" className="bg-background-surface">Fourth Year</option>
                    <option value="Alumni" className="bg-background-surface">Alumni</option>
                  </select>
                </div>
              </div>
            )}
            
            <button 
              type="button" 
              onClick={nextStep} 
              className={`w-full py-4 mt-4 flex items-center justify-center gap-2 transition-all duration-300 rounded-xl font-bold ${
                formData.role === 'FREELANCER' ? 'bg-secondary hover:bg-secondary-hover text-white' : 
                formData.role === 'CLUB' ? 'bg-accent hover:bg-accent-hover text-white' : 
                'bg-primary hover:bg-primary-hover text-white'
              }`} 
              disabled={!formData.collegeName || !formData.department}
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            <div className="flex items-center gap-3 p-4 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary text-sm">
              <Sparkles size={20} />
              <p>This powers your peer-matching algorithm.</p>
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium text-text-muted mb-2">What can you teach? (Comma separated)</label>
              <input type="text" name="skillsToTeach" placeholder="e.g. React, UI Design" value={formData.skillsToTeach} onChange={handleChange} className="w-full bg-black/20 border border-glass-border rounded-lg py-3 px-4 text-white focus:border-primary outline-none" />
              <span className="text-xs text-text-muted mt-2 block">These skills will be listed in the Marketplace.</span>
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium text-text-muted mb-2">What do you want to learn?</label>
              <input type="text" name="skillsToLearn" placeholder="e.g. Python, Marketing" value={formData.skillsToLearn} onChange={handleChange} className="w-full bg-black/20 border border-glass-border rounded-lg py-3 px-4 text-white focus:border-primary outline-none" />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-4 mt-4 transition-all duration-300 rounded-xl font-bold text-white shadow-lg ${
                formData.role === 'FREELANCER' ? 'bg-gradient-to-r from-secondary to-pink-600' : 
                formData.role === 'CLUB' ? 'bg-gradient-to-r from-accent to-blue-600' : 
                'bg-gradient-to-r from-success to-emerald-600'
              }`}
            >
              {loading ? 'Creating Account...' : 'Complete Setup & Send OTP'}
            </button>
          </form>
        )}

        {step === 5 && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
            <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-sm">
              <Mail size={20} />
              <p>Enter the 6-digit code sent to <b className="text-white">{formData.email}</b></p>
            </div>

            <div className="input-group">
              <label htmlFor="signup-otp" className="block text-sm font-medium text-text-muted mb-2 text-center">OTP Code</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="signup-otp"
                  name="otp" 
                  autocomplete="one-time-code"
                  placeholder="000000" 
                  value={formData.otp} 
                  onChange={handleChange} 
                  maxLength={6}
                  className="w-full bg-black/20 border border-glass-border rounded-lg py-4 text-center text-4xl font-bold tracking-[1rem] text-white focus:border-primary outline-none"
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-primary w-full py-4 mt-4" disabled={loading || formData.otp.length !== 6}>
              {loading ? 'Verifying...' : 'Verify & Enter SkillSphere'}
            </button>
            
            <p className="text-center text-text-muted text-sm mt-4">
              Didn't receive the code? <button type="button" onClick={handleSignup} className="text-primary font-semibold hover:underline ml-1">Resend</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
