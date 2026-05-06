import React from 'react';
import { ArrowRight, Code, Palette, CheckCircle, Briefcase, Wallet, Shield, Bot, MessageSquare, Trophy, BarChart, Sparkles, GraduationCap, Users, ShieldCheck, Award, BookOpen, Zap, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <header className="hero-section">
        <div className="hero-bg-grid"></div>
        <div className="badge-pill">
          <span className="badge-new">NEW</span>
          <span>Verified campus-only economy is live</span>
        </div>
        
        <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-7xl px-4 font-black">
          The campus economy<br />
          <span className="gradient-text">built for students.</span>
        </h1>
        
        <p className="hero-subtitle text-base md:text-xl px-6">
          SkillSphere is the verified marketplace where students learn, earn and collaborate. Hire peers, monetize skills, recruit clubs — all inside your campus.
        </p>
        
        <div className="hero-buttons flex-col sm:flex-row w-full max-w-xs sm:max-w-none px-6">
          <Link to="/signup" className="w-full sm:w-auto">
            <button className="btn-primary large w-full justify-center">
              Join your campus <ArrowRight size={20} />
            </button>
          </Link>
          <Link to="/marketplace" className="w-full sm:w-auto">
            <button className="btn-secondary large w-full justify-center">
              Explore Marketplace <Briefcase size={20} style={{marginLeft: '0.5rem'}} />
            </button>
          </Link>
        </div>

        <div className="trust-badge">
          <ShieldCheck size={14} color="#10b981" /> College email verified · Escrow protected · Zero spam
        </div>
      </header>

      <section className="px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Live Showcase Card */}
          <div className="lg:col-span-8 feature-card p-1 bg-gradient-to-br from-primary/30 via-accent/10 to-transparent border-primary/20 overflow-hidden group">
            <div className="bg-background-dark/80 backdrop-blur-2xl rounded-[22px] p-8 md:p-12 h-full relative overflow-hidden">
               {/* Background Glows */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/30 transition-all duration-1000"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -ml-32 -mb-32 group-hover:bg-accent/30 transition-all duration-1000"></div>
               
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase tracking-widest mb-6">
                       <div className="w-1.5 h-1.5 rounded-full bg-success animate-ping"></div>
                       Live Platform Pulse
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
                       Where campus talent <span className="gradient-text">meets opportunity.</span>
                    </h2>
                    <div className="flex gap-4">
                       <div className="flex flex-col">
                          <span className="text-2xl font-black text-white tracking-tighter">1.2K+</span>
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Active Gigs</span>
                       </div>
                       <div className="w-px h-10 bg-white/10"></div>
                       <div className="flex flex-col">
                          <span className="text-2xl font-black text-white tracking-tighter">98%</span>
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Trust Score</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 relative">
                     {/* Floating Live Cards */}
                     <div className="feature-card p-5 bg-white/5 border-white/10 flex items-center gap-4 animate-float">
                        <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center text-success border border-success/20">
                           <Check size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-text-muted uppercase">New Match</p>
                           <p className="text-sm font-bold text-white">UI Design <span className="text-success ml-2">₹2,400</span></p>
                        </div>
                     </div>
                     
                     <div className="feature-card p-5 bg-white/5 border-white/10 flex items-center gap-4 animate-float" style={{animationDelay: '-2s', marginLeft: '2rem'}}>
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 font-black text-xs">
                           +10
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-text-muted uppercase">XP Earned</p>
                           <p className="text-sm font-bold text-white">Top 3% on campus</p>
                        </div>
                     </div>

                     <div className="feature-card p-5 bg-white/5 border-white/10 flex items-center gap-4 animate-float" style={{animationDelay: '-4s', marginLeft: '1rem'}}>
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent border border-accent/20">
                           <Shield size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-text-muted uppercase">Verified</p>
                           <p className="text-sm font-bold text-white">Student ID Secure</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="lg:col-span-4 space-y-6 h-full">
             <div className="feature-card p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 h-1/2 flex flex-col justify-center group">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                   <Trophy size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Campus Rankings</h3>
                <p className="text-sm text-text-muted">Join the elite 1% of campus earners and mentors.</p>
                <Link to="/leaderboard" className="mt-6 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                   View Board <ArrowRight size={14} />
                </Link>
             </div>
             
             <div className="feature-card p-8 bg-gradient-to-br from-accent/10 to-transparent border-accent/20 h-1/2 flex flex-col justify-center group">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                   <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Student Clubs</h3>
                <p className="text-sm text-text-muted">Power your organization with verified talent.</p>
                <Link to="/signup" className="mt-6 text-accent text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                   Recruit Now <ArrowRight size={14} />
                </Link>
             </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-12">
          Trusted by students across 40+ premier campuses
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {['IIT Bombay', 'BITS Pilani', 'NIT Trichy', 'VIT', 'Manipal', 'SRM', 'Ashoka', 'Christ'].map(college => (
            <span key={college} className="text-sm font-black text-white hover:text-primary transition-colors cursor-default">{college}</span>
          ))}
        </div>
      </section>

      <section className="features-section py-20" id="features">
        <div className="feature-tag mb-6 mx-auto uppercase">PLATFORM</div>
        <h2 className="section-title text-center text-3xl md:text-5xl lg:text-7xl mb-6 tracking-tighter leading-tight max-w-4xl mx-auto">
          Everything a campus needs in one <span className="gradient-text">ecosystem.</span>
        </h2>
        <p className="section-subtitle text-center text-base md:text-lg mx-auto mb-16 max-w-2xl opacity-70">
          SkillSphere unifies all campus activities—from skill sharing to club management—into a single high-trust network.
        </p>
        
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full px-4">
          <Link to="/marketplace" className="feature-card p-5 md:p-8 block no-underline transition-all hover:scale-105 active:scale-95">
            <div className="icon-box new-feature-icon w-10 h-10 md:w-11 md:h-11 rounded-xl"><Briefcase size={20} color="white" /></div>
            <h3 className="text-base md:text-xl font-bold">Gig Marketplace</h3>
            <p className="text-[12px] md:text-sm text-text-muted">Post, discover and deliver paid, barter or volunteer gigs with milestone-based escrow.</p>
          </Link>
          
          <Link to="/wallet" className="feature-card p-5 md:p-8 block no-underline transition-all hover:scale-105 active:scale-95">
            <div className="icon-box new-feature-icon w-10 h-10 md:w-11 md:h-11 rounded-xl"><Wallet size={20} color="white" /></div>
            <h3 className="text-base md:text-xl font-bold">Campus Wallet</h3>
            <p className="text-[12px] md:text-sm text-text-muted">Cash, credits and coins powered by Razorpay & Stripe with full refund protection.</p>
          </Link>

          <Link to="/dashboard" className="feature-card p-5 md:p-8 block no-underline transition-all hover:scale-105 active:scale-95">
            <div className="icon-box new-feature-icon w-10 h-10 md:w-11 md:h-11 rounded-xl"><MessageSquare size={20} color="white" /></div>
            <h3 className="text-base md:text-xl font-bold">Real-time Chat</h3>
            <p className="text-[12px] md:text-sm text-text-muted">Socket.io-powered DMs, presence and typing — built for fast collab.</p>
          </Link>

          <Link to="/leaderboard" className="feature-card p-5 md:p-8 block no-underline transition-all hover:scale-105 active:scale-95">
            <div className="icon-box new-feature-icon w-10 h-10 md:w-11 md:h-11 rounded-xl"><Trophy size={20} color="white" /></div>
            <h3 className="text-base md:text-xl font-bold">XP & Badges</h3>
            <p className="text-[12px] md:text-sm text-text-muted">Skill badges, leaderboards and weekly challenges that make growth addictive.</p>
          </Link>
        </div>
      </section>

      <section className="how-it-works-section py-20" id="how-it-works">
        <div className="feature-tag mb-6 mx-auto">HOW IT WORKS</div>
        <h2 className="section-title text-center max-w-3xl mx-auto">
          From signup to first paycheck in under <span className="gradient-text">a week.</span>
        </h2>
        
        <div className="timeline-container mt-16 max-w-3xl mx-auto space-y-6">
          <div className="timeline-item feature-card p-8 flex items-center gap-8 group">
            <div className="timeline-number w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-primary/20">01</div>
            <div className="timeline-content">
              <h3 className="text-xl font-bold text-white mb-2">Verify with college email</h3>
              <p className="text-sm text-text-muted">OTP + domain validation gates the whole platform — only real students inside.</p>
            </div>
          </div>
          
          <div className="timeline-item feature-card p-8 flex items-center gap-8 group">
            <div className="timeline-number w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-primary/20">02</div>
            <div className="timeline-content">
              <h3 className="text-xl font-bold text-white mb-2">Build your skill profile</h3>
              <p className="text-sm text-text-muted">Add skills, portfolio, availability. Our AI scores and suggests improvements.</p>
            </div>
          </div>
          
          <div className="timeline-item feature-card p-8 flex items-center gap-8 group">
            <div className="timeline-number w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-primary/20">03</div>
            <div className="timeline-content">
              <h3 className="text-xl font-bold text-white mb-2">Discover or post gigs</h3>
              <p className="text-sm text-text-muted">Match with peers, clubs and faculty. Apply, negotiate, sign milestones.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="feature-card p-12 md:p-20 bg-gradient-to-br from-white/5 to-transparent border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-primary/10 transition-all duration-1000"></div>
           
           <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 text-center">
              <div>
                 <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">40+</h3>
                 <p className="text-[10px] md:text-xs font-black text-text-muted uppercase tracking-widest">Campuses</p>
              </div>
              <div>
                 <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">12K</h3>
                 <p className="text-[10px] md:text-xs font-black text-text-muted uppercase tracking-widest">Students</p>
              </div>
              <div>
                 <h3 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter mb-2">₹38L</h3>
                 <p className="text-[10px] md:text-xs font-black text-text-muted uppercase tracking-widest">Earnings</p>
              </div>
              <div>
                 <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">4.9</h3>
                 <p className="text-[10px] md:text-xs font-black text-text-muted uppercase tracking-widest">Rating</p>
              </div>
           </div>
        </div>
      </section>

      <section className="pricing-section py-20 px-6" id="pricing">
        <div className="feature-tag mb-6 mx-auto">PRICING</div>
        <h2 className="section-title text-center max-w-4xl mx-auto mb-16">
          Free for students. Powerful <br/><span className="gradient-text">for campuses.</span>
        </h2>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Student Plan */}
          <div className="feature-card p-10 flex flex-col group">
            <h3 className="text-xl font-bold text-white mb-6">Student</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-black text-white">Free</span>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Forever</span>
            </div>
            <Link to="/signup" className="no-underline mb-8">
               <button className="btn-secondary w-full py-4 text-[10px] font-black uppercase tracking-widest">Join Platform</button>
            </Link>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-success" /> Verified identity</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-success" /> Marketplace access</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-success" /> P2P Barter hub</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-success" /> Smart wallet</li>
            </ul>
          </div>
 
          {/* Pro Plan */}
          <div className="feature-card p-10 flex flex-col border-primary/30 bg-primary/5 relative group">
            <div className="absolute top-4 right-4 text-[9px] font-black bg-primary px-3 py-1 rounded-md text-white tracking-widest uppercase">Popular</div>
            <h3 className="text-xl font-bold text-white mb-6">Synergy Pro</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-black text-white">₹149</span>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">/ Month</span>
            </div>
            <button className="btn-primary w-full py-4 text-[10px] font-black uppercase tracking-widest mb-8">Upgrade Now</button>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-white font-bold"><CheckCircle size={16} className="text-primary" /> Profile boost x10</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-primary" /> Priority matching</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-primary" /> AI listing boost</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-primary" /> Zero withdrawal fee</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-primary" /> Early gig access</li>
            </ul>
          </div>
 
          {/* Campus Plan */}
          <div className="feature-card p-10 flex flex-col group">
            <h3 className="text-xl font-bold text-white mb-6">Campus Hub</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-black text-white">Custom</span>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Enterprise</span>
            </div>
            <button className="btn-secondary w-full py-4 text-[10px] font-black uppercase tracking-widest mb-8">Contact Sales</button>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-accent" /> SSO Integration</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-accent" /> Admin dashboard</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-accent" /> Custom audit logs</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-accent" /> Managed payouts</li>
              <li className="flex items-center gap-3 text-sm text-text-muted font-medium"><CheckCircle size={16} className="text-accent" /> Dedicated support</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 flex justify-center">
        <div className="feature-card max-w-5xl w-full p-16 md:p-24 bg-gradient-to-br from-primary/20 via-background-dark to-transparent border-primary/20 text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <h2 className="text-3xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              Unlock your campus <br />
              <span className="gradient-text">potential.</span>
           </h2>
           <p className="text-text-muted text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
              Join thousands of students building the future of campus collaboration.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="no-underline">
                 <button className="btn-primary py-4 px-10 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    Get Started <ArrowRight size={18} />
                 </button>
              </Link>
              <button className="btn-secondary py-4 px-10 text-xs font-black uppercase tracking-widest">
                 Partner with us
              </button>
           </div>
        </div>
      </section>

      <footer className="border-t border-white/5 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 pr-0 lg:pr-16">
              <div className="logo mb-6">
                <div className="logo-icon new-logo"><Sparkles size={20} color="white" /></div>
                <span className="text-2xl font-black tracking-tighter">SkillSphere</span>
              </div>
              <p className="text-text-muted text-sm md:text-base leading-relaxed">
                The unified skill exchange for modern campuses. Learn, earn, and build your professional network inside your verified ecosystem.
              </p>
            </div>
 
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/marketplace" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Marketplace</Link></li>
                <li><Link to="/gigs" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Opportunities</Link></li>
                <li><Link to="/leaderboard" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Rankings</Link></li>
                <li><Link to="/barter-hub" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Barter Hub</Link></li>
              </ul>
            </div>
 
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Docs</a></li>
                <li><a href="#" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Guidelines</a></li>
                <li><a href="#" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Support</a></li>
                <li><a href="#" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Status</a></li>
              </ul>
            </div>
 
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Privacy</a></li>
                <li><a href="#" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Terms</a></li>
                <li><a href="#" className="text-text-muted text-sm hover:text-primary transition-colors no-underline font-medium">Security</a></li>
              </ul>
            </div>
          </div>
 
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-text-muted uppercase tracking-widest">
            <div>© 2026 SkillSphere. Built for the next gen.</div>
            <div className="flex items-center gap-2">
               Made with <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div> in India
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
