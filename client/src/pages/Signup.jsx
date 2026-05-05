import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, ArrowRight, Briefcase, Phone, Building, Book, GraduationCap, ChevronLeft, CheckCircle, Sparkles } from 'lucide-react';
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
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error: reduxError } = useSelector((state) => state.auth);

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

  return (
    <div className="auth-container flex items-start justify-center min-h-screen bg-background-dark py-16 px-4">
      <div className="glow-sphere secondary-glow absolute top-1/3 right-1/4 opacity-20"></div>
      <div className="glow-sphere main-glow absolute bottom-1/4 left-1/4 opacity-20"></div>
      
      <div className="glass-card auth-card w-full max-w-xl p-8 md:p-12 relative z-10">
        
        {step > 1 && step < 5 && (
          <button type="button" onClick={prevStep} className="flex items-center gap-2 text-text-muted hover:text-white transition-all mb-8">
            <ChevronLeft size={16} /> Back
          </button>
        )}

        <div className="auth-header text-center mb-10">
          {step === 1 && <h2 className="text-3xl font-bold text-white">Choose your journey</h2>}
          {step === 2 && <h2 className="text-3xl font-bold text-white">Create your account</h2>}
          {step === 3 && <h2 className="text-3xl font-bold text-white">Verify your campus</h2>}
          {step === 4 && <h2 className="text-3xl font-bold text-white">Set your skills</h2>}
          {step === 5 && <h2 className="text-3xl font-bold text-white">Verify your email</h2>}
          
          <div className="flex justify-center gap-2 mt-4">
            {[1,2,3,4,5].map(s => (
              <div key={s} className={`h-1 rounded-full transition-all ${s <= step ? 'w-8 bg-primary' : 'w-4 bg-white/10'}`}></div>
            ))}
          </div>
          {reduxError && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">{reduxError}</div>}
        </div>
        
        {step === 1 && (
          <div className="grid gap-4">
            <button type="button" className="glass-card p-6 flex items-start gap-4 text-left hover:border-primary transition-all bg-white/[0.02]" onClick={() => handleRoleSelect('STUDENT')}>
              <div className="bg-primary/10 p-3 rounded-xl text-primary-hover"><GraduationCap size={24} /></div>
              <div><h3 className="text-lg font-semibold text-white mb-1">Student</h3><p className="text-text-muted text-sm leading-relaxed">I want to learn, hire peers, and build my portfolio.</p></div>
            </button>

            <button type="button" className="glass-card p-6 flex items-start gap-4 text-left hover:border-secondary transition-all bg-white/[0.02]" onClick={() => handleRoleSelect('FREELANCER')}>
              <div className="bg-secondary/10 p-3 rounded-xl text-secondary"><Briefcase size={24} /></div>
              <div><h3 className="text-lg font-semibold text-white mb-1">Freelancer</h3><p className="text-text-muted text-sm leading-relaxed">I want to offer my skills and earn money on campus.</p></div>
            </button>

            <button type="button" className="glass-card p-6 flex items-start gap-4 text-left hover:border-accent transition-all bg-white/[0.02]" onClick={() => handleRoleSelect('CLUB')}>
              <div className="bg-accent/10 p-3 rounded-xl text-accent"><Building size={24} /></div>
              <div><h3 className="text-lg font-semibold text-white mb-1">Campus Club / Org</h3><p className="text-text-muted text-sm leading-relaxed">I want to recruit talent and manage our internal economy.</p></div>
            </button>

            <div className="text-center mt-6">
              <p className="text-text-muted">Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link></p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="input-group">
              <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 text-text-muted" size={18} />
                <input type="text" name="name" placeholder="Alex Mercer" value={formData.name} onChange={handleChange} className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" required />
              </div>
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium text-text-muted mb-2">College or Personal Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 text-text-muted" size={18} />
                <input type="email" name="email" placeholder="alex@example.com" value={formData.email} onChange={handleChange} className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" required />
              </div>
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium text-text-muted mb-2">Mobile Number</label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 text-text-muted" size={18} />
                <input type="tel" name="mobile" placeholder="+91 9876543210" value={formData.mobile} onChange={handleChange} className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" required />
              </div>
            </div>
            
            <div className="input-group">
              <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 text-text-muted" size={18} />
                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" required />
              </div>
            </div>
            
            <button type="button" onClick={nextStep} className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2" disabled={!formData.name || !formData.email || !formData.password || !formData.mobile}>
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

            <div className="input-group">
              <label className="block text-sm font-medium text-text-muted mb-2">College / University Name</label>
              <div className="relative flex items-center">
                <Building className="absolute left-3 text-text-muted" size={18} />
                <input type="text" name="collegeName" placeholder="e.g. IIT Bombay" value={formData.collegeName} onChange={handleChange} className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" required />
              </div>
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium text-text-muted mb-2">Department / Major</label>
              <div className="relative flex items-center">
                <Book className="absolute left-3 text-text-muted" size={18} />
                <input type="text" name="department" placeholder="e.g. Computer Science" value={formData.department} onChange={handleChange} className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none" required />
              </div>
            </div>

            {formData.role !== 'CLUB' && (
              <div className="input-group">
                <label className="block text-sm font-medium text-text-muted mb-2">Year of Study</label>
                <div className="relative flex items-center">
                  <GraduationCap className="absolute left-3 text-text-muted" size={18} />
                  <select name="year" value={formData.year} onChange={handleChange} className="w-full bg-black/20 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none appearance-none" required>
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
            
            <button type="button" onClick={nextStep} className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2" disabled={!formData.collegeName || !formData.department}>
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
            
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-4 bg-gradient-to-r from-success to-emerald-600 border-none">
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
              <label className="block text-sm font-medium text-text-muted mb-2 text-center">OTP Code</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="otp" 
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
