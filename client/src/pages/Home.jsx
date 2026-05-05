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
        
        <h1 className="hero-title">
          The campus economy<br />
          <span className="gradient-text">built for students.</span>
        </h1>
        
        <p className="hero-subtitle">
          SkillSphere is the verified marketplace where students learn, earn and collaborate. Hire peers, monetize skills, recruit clubs — all inside your campus.
        </p>
        
        <div className="hero-buttons">
          <Link to="/signup">
            <button className="btn-primary large">
              Join your campus <ArrowRight size={20} />
            </button>
          </Link>
          <Link to="/marketplace">
            <button className="btn-secondary large">
              Explore Marketplace <Briefcase size={20} style={{marginLeft: '0.5rem'}} />
            </button>
          </Link>
        </div>

        <div className="trust-badge">
          <ShieldCheck size={14} color="#10b981" /> College email verified · Escrow protected · Zero spam
        </div>
      </header>

      <section style={{maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 4rem', position: 'relative', zIndex: 10}}>
        <div className="hero-visual-container">
          <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(17, 14, 23, 0.4)'}}></div>
          
          <div className="floating-stat-card" style={{ top: '2rem', left: '-2rem' }}>
            <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981'}}></div>
            <div>
              <div style={{color: '#94a3b8', fontSize: '0.75rem'}}>New gig matched</div>
              <div style={{color: '#f8f8fa', fontSize: '0.9rem', fontWeight: '600'}}>UI design - ₹2,400</div>
            </div>
          </div>

          <div className="floating-stat-card" style={{ bottom: '3rem', right: '-2rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.4rem',
              borderRadius: '8px'
            }}>+10</div>
            <div>
              <div style={{color: '#94a3b8', fontSize: '0.75rem'}}>XP earned today</div>
              <div style={{color: '#f8f8fa', fontSize: '0.9rem', fontWeight: '600'}}>Top 3% on campus</div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '4rem', textAlign: 'center'}}>
          <div style={{color: '#64748b', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem'}}>
            Trusted by students across 40+ campuses
          </div>
          <div style={{
            display: 'flex', 
            justifyContent: 'space-around', 
            alignItems: 'center', 
            color: '#94a3b8', 
            fontWeight: '600',
            opacity: '0.6',
            fontSize: '1rem',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <span>IIT Bombay</span>
            <span>BITS Pilani</span>
            <span>NIT Trichy</span>
            <span>VIT</span>
            <span>Manipal</span>
            <span>SRM</span>
            <span>Ashoka</span>
            <span>Christ</span>
          </div>
        </div>
      </section>

      <section className="features-section" id="features" style={{paddingTop: '6rem'}}>
        <div className="feature-tag">PLATFORM</div>
        <h2 className="section-title" style={{textAlign: 'left', marginBottom: '1rem', fontSize: '3rem', maxWidth: '800px', lineHeight: '1.1'}}>
          Everything a campus needs in one <span className="gradient-text">ecosystem.</span>
        </h2>
        <p className="section-subtitle" style={{textAlign: 'left', margin: '0 0 4rem 0', maxWidth: '800px'}}>
          A full operating system for student talent — from first gig to first paycheck.
        </p>
        
        <div className="features-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', width: '100%'}}>
          <div className="feature-card" style={{padding: '2rem 1.5rem'}}>
            <div className="icon-box new-feature-icon" style={{width: '44px', height: '44px', borderRadius: '12px'}}><Briefcase size={22} color="white" /></div>
            <h3 style={{fontSize: '1.1rem'}}>Gig Marketplace</h3>
            <p style={{fontSize: '0.85rem'}}>Post, discover and deliver paid, barter or volunteer gigs with milestone-based escrow.</p>
          </div>
          
          <div className="feature-card" style={{padding: '2rem 1.5rem'}}>
            <div className="icon-box new-feature-icon" style={{width: '44px', height: '44px', borderRadius: '12px'}}><Wallet size={22} color="white" /></div>
            <h3 style={{fontSize: '1.1rem'}}>Campus Wallet</h3>
            <p style={{fontSize: '0.85rem'}}>Cash, credits and coins powered by Razorpay & Stripe with full refund protection.</p>
          </div>

          <div className="feature-card" style={{padding: '2rem 1.5rem'}}>
            <div className="icon-box new-feature-icon" style={{width: '44px', height: '44px', borderRadius: '12px'}}><MessageSquare size={22} color="white" /></div>
            <h3 style={{fontSize: '1.1rem'}}>Real-time Chat</h3>
            <p style={{fontSize: '0.85rem'}}>Socket.io-powered DMs, presence and typing — built for fast collab.</p>
          </div>

          <div className="feature-card" style={{padding: '2rem 1.5rem'}}>
            <div className="icon-box new-feature-icon" style={{width: '44px', height: '44px', borderRadius: '12px'}}><Trophy size={22} color="white" /></div>
            <h3 style={{fontSize: '1.1rem'}}>XP & Badges</h3>
            <p style={{fontSize: '0.85rem'}}>Skill badges, leaderboards and weekly challenges that make growth addictive.</p>
          </div>
          
          <div className="feature-card" style={{padding: '2rem 1.5rem'}}>
            <div className="icon-box new-feature-icon" style={{width: '44px', height: '44px', borderRadius: '12px'}}><Shield size={22} color="white" /></div>
            <h3 style={{fontSize: '1.1rem'}}>Verified Only</h3>
            <p style={{fontSize: '0.85rem'}}>College-email gated. RBAC, audit logs, fraud detection, dispute resolution.</p>
          </div>

          <div className="feature-card" style={{padding: '2rem 1.5rem'}}>
            <div className="icon-box new-feature-icon" style={{width: '44px', height: '44px', borderRadius: '12px'}}><Bot size={22} color="white" /></div>
            <h3 style={{fontSize: '1.1rem'}}>AI Matching</h3>
            <p style={{fontSize: '0.85rem'}}>Smart gig recommendations, pricing suggestions and resume scoring.</p>
          </div>

          <div className="feature-card" style={{padding: '2rem 1.5rem'}}>
            <div className="icon-box new-feature-icon" style={{width: '44px', height: '44px', borderRadius: '12px'}}><Users size={22} color="white" /></div>
            <h3 style={{fontSize: '1.1rem'}}>Clubs & Teams</h3>
            <p style={{fontSize: '0.85rem'}}>Recruit talent, plan events, manage budgets and assemble project teams.</p>
          </div>

          <div className="feature-card" style={{padding: '2rem 1.5rem'}}>
            <div className="icon-box new-feature-icon" style={{width: '44px', height: '44px', borderRadius: '12px', transform: 'none'}}><Zap size={22} color="white" /></div>
            <h3 style={{fontSize: '1.1rem'}}>Mobile + PWA</h3>
            <p style={{fontSize: '0.85rem'}}>Same API across web, PWA and React Native — install on any device.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section" id="how-it-works" style={{paddingTop: '4rem', paddingBottom: '4rem'}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
          <div style={{color: '#c4b5fd', fontWeight: '600', letterSpacing: '1.5px', fontSize: '0.8rem', textTransform: 'uppercase'}}>
            HOW IT WORKS
          </div>
        </div>
        <h2 className="section-title">
          From signup to first paycheck in under <span className="gradient-text">a week.</span>
        </h2>
        
        <div className="timeline-container" style={{marginTop: '4rem'}}>
          <div className="timeline-item">
            <div className="timeline-number">01</div>
            <div className="timeline-content">
              <h3>Verify with college email</h3>
              <p>OTP + domain validation gates the whole platform — only real students inside.</p>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-number">02</div>
            <div className="timeline-content">
              <h3>Build your skill profile</h3>
              <p>Add skills, portfolio, availability. Our AI scores and suggests improvements.</p>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-number">03</div>
            <div className="timeline-content">
              <h3>Discover or post gigs</h3>
              <p>Match with peers, clubs and faculty. Apply, negotiate, sign milestones.</p>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-number">04</div>
            <div className="timeline-content">
              <h3>Deliver, get paid, level up</h3>
              <p>Escrow releases on approval. Earn XP, badges and climb the campus leaderboard.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="roles-section" id="roles" style={{paddingTop: '6rem', paddingBottom: '6rem'}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
          <div style={{color: '#c4b5fd', fontWeight: '600', letterSpacing: '1.5px', fontSize: '0.8rem', textTransform: 'uppercase'}}>
            ROLE-BASED
          </div>
        </div>
        <h2 className="section-title" style={{marginBottom: '4rem', fontSize: '3.5rem', lineHeight: '1.1'}}>
          Built for every campus <br/><span className="gradient-text">persona.</span>
        </h2>
        
        <div className="roles-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', width: '100%'}}>
          <div className="role-card" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div><GraduationCap size={28} color="#f8f8fa" /></div>
            <h3 style={{fontSize: '1.5rem', margin: 0}}>Student</h3>
            <ul className="role-list" style={{margin: 0}}>
              <li>Browse skills</li>
              <li>Hire peers</li>
              <li>Track learning</li>
            </ul>
          </div>
          
          <div className="role-card" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div><Code size={28} color="#f8f8fa" /></div>
            <h3 style={{fontSize: '1.5rem', margin: 0}}>Freelancer</h3>
            <ul className="role-list" style={{margin: 0}}>
              <li>List services</li>
              <li>Manage orders</li>
              <li>Earn & withdraw</li>
            </ul>
          </div>

          <div className="role-card" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div><Users size={28} color="#f8f8fa" /></div>
            <h3 style={{fontSize: '1.5rem', margin: 0}}>Club</h3>
            <ul className="role-list" style={{margin: 0}}>
              <li>Recruit talent</li>
              <li>Plan events</li>
              <li>Track budget</li>
            </ul>
          </div>

          <div className="role-card" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div><ShieldCheck size={28} color="#f8f8fa" /></div>
            <h3 style={{fontSize: '1.5rem', margin: 0}}>Admin</h3>
            <ul className="role-list" style={{margin: 0}}>
              <li>Verify users</li>
              <li>Moderate</li>
              <li>Revenue ops</li>
            </ul>
          </div>

          <div className="role-card" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div><Award size={28} color="#f8f8fa" /></div>
            <h3 style={{fontSize: '1.5rem', margin: 0}}>Alumni</h3>
            <ul className="role-list" style={{margin: 0}}>
              <li>Mentor</li>
              <li>Workshops</li>
              <li>Referrals</li>
            </ul>
          </div>

          <div className="role-card" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div><BookOpen size={28} color="#f8f8fa" /></div>
            <h3 style={{fontSize: '1.5rem', margin: 0}}>Faculty</h3>
            <ul className="role-list" style={{margin: 0}}>
              <li>Research gigs</li>
              <li>Supervise</li>
              <li>Mentor</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 6rem'}}>
        <div style={{
          background: '#161320', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '4rem 6rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div style={{textAlign: 'left'}}>
            <h3 style={{fontSize: '3.5rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#f8f8fa', letterSpacing: '-1px'}}>40+</h3>
            <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontWeight: '500'}}>Campuses onboarded</p>
          </div>
          
          <div style={{textAlign: 'left'}}>
            <h3 style={{fontSize: '3.5rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#f8f8fa', letterSpacing: '-1px'}}>12k</h3>
            <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontWeight: '500'}}>Verified students</p>
          </div>

          <div style={{textAlign: 'left'}}>
            <h3 style={{fontSize: '3.5rem', fontWeight: '700', margin: '0 0 0.5rem 0', letterSpacing: '-1px', background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>₹38L</h3>
            <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontWeight: '500'}}>Earned by students</p>
          </div>

          <div style={{textAlign: 'left'}}>
            <h3 style={{fontSize: '3.5rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#f8f8fa', letterSpacing: '-1px'}}>4.9</h3>
            <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontWeight: '500'}}>Avg gig rating</p>
          </div>
        </div>
      </section>

      <section className="pricing-section" id="pricing" style={{paddingTop: '4rem', paddingBottom: '8rem'}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
          <div style={{color: '#c4b5fd', fontWeight: '600', letterSpacing: '1.5px', fontSize: '0.8rem', textTransform: 'uppercase'}}>
            PRICING
          </div>
        </div>
        <h2 className="section-title" style={{fontSize: '3.5rem', lineHeight: '1.1', maxWidth: '800px', margin: '0 auto'}}>
          Free for students. Powerful <br/><span className="gradient-text">for campuses.</span>
        </h2>

        <div className="pricing-grid">
          {/* Student Plan */}
          <div className="pricing-card">
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>Student</h3>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem'}}>
              <span style={{fontSize: '3.5rem', fontWeight: '700', lineHeight: '1'}}>Free</span>
              <span style={{color: '#94a3b8', fontSize: '0.9rem'}}>Forever</span>
            </div>
            <button className="btn-secondary" style={{width: '100%', padding: '0.75rem', marginBottom: '1rem'}}>Start free</button>
            <ul className="pricing-features">
              <li><Check size={18} color="#10b981" /> Verified profile</li>
              <li><Check size={18} color="#10b981" /> Browse & apply to gigs</li>
              <li><Check size={18} color="#10b981" /> Wallet & escrow</li>
              <li><Check size={18} color="#10b981" /> Community chat</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card popular">
            <div className="popular-badge">MOST POPULAR</div>
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>Pro</h3>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem'}}>
              <span style={{fontSize: '3.5rem', fontWeight: '700', lineHeight: '1'}}>₹149</span>
              <span style={{color: '#94a3b8', fontSize: '0.9rem'}}>/month</span>
            </div>
            <button className="btn-primary" style={{width: '100%', padding: '0.75rem', marginBottom: '1rem'}}>Go Pro</button>
            <ul className="pricing-features">
              <li><Check size={18} color="#10b981" /> Everything in Student</li>
              <li><Check size={18} color="#10b981" /> Featured profile boost</li>
              <li><Check size={18} color="#10b981" /> Priority gig matching</li>
              <li><Check size={18} color="#10b981" /> AI resume scoring</li>
              <li><Check size={18} color="#10b981" /> 0% withdrawal fees</li>
            </ul>
          </div>

          {/* Campus Plan */}
          <div className="pricing-card">
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>Campus</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem'}}>
              <span style={{fontSize: '3.5rem', fontWeight: '700', lineHeight: '1'}}>Custom</span>
              <span style={{color: '#94a3b8', fontSize: '0.8rem', maxWidth: '80px', lineHeight: '1.2'}}>For colleges & clubs</span>
            </div>
            <button className="btn-secondary" style={{width: '100%', padding: '0.75rem', marginBottom: '1rem'}}>Talk to us</button>
            <ul className="pricing-features">
              <li><Check size={18} color="#10b981" /> SSO & domain controls</li>
              <li><Check size={18} color="#10b981" /> Admin dashboard</li>
              <li><Check size={18} color="#10b981" /> Bulk verification</li>
              <li><Check size={18} color="#10b981" /> Analytics & exports</li>
              <li><Check size={18} color="#10b981" /> Dedicated success manager</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{padding: '4rem 2rem 8rem', display: 'flex', justifyContent: 'center'}}>
        <div style={{
          background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, rgba(17, 14, 23, 0.8) 70%), #110e17',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          padding: '6rem 2rem',
          maxWidth: '1000px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-1px'}}>
            Your campus has untapped <br/>
            <span className="gradient-text">talent.</span><br/>
            Let's unlock it.
          </h2>
          <p style={{color: '#94a3b8', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 3rem', lineHeight: '1.6'}}>
            Bring SkillSphere to your college and turn skills into a thriving internal economy.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <button className="btn-primary" style={{padding: '0.8rem 1.5rem'}}>
              Launch on your campus <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" style={{padding: '0.8rem 1.5rem'}}>
              Book a demo
            </button>
          </div>
        </div>
      </section>

      <footer style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem', paddingBottom: '2rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '4rem'}}>
            
            <div style={{paddingRight: '2rem'}}>
              <div className="logo" style={{marginBottom: '1rem'}}>
                <div className="logo-icon new-logo"><Sparkles size={20} color="white" /></div>
                <span>SkillSphere</span>
              </div>
              <p style={{color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6'}}>
                Learn. Earn. Collaborate. The verified campus skill exchange.
              </p>
            </div>

            <div>
              <h4 style={{color: '#f8f8fa', fontWeight: '600', marginBottom: '1.5rem', fontSize: '1rem'}}>Product</h4>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Features</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Pricing</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Roadmap</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Mobile app</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{color: '#f8f8fa', fontWeight: '600', marginBottom: '1.5rem', fontSize: '1rem'}}>Company</h4>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>About</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Blog</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Careers</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Press</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{color: '#f8f8fa', fontWeight: '600', marginBottom: '1.5rem', fontSize: '1rem'}}>Resources</h4>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Docs</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Community</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Support</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Status</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{color: '#f8f8fa', fontWeight: '600', marginBottom: '1.5rem', fontSize: '1rem'}}>Legal</h4>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Privacy</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Terms</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Security</a></li>
                <li><a href="#" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s'}}>Cookies</a></li>
              </ul>
            </div>
          </div>

          <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem'}}>
            <div>© 2026 SkillSphere. Built for students, by students.</div>
            <div>Made with care in India TN</div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
