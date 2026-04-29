import React, { useContext, useEffect, useState } from 'react';
import { Search, Bell, Wallet, Star, Code, Edit, Video, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [gigForm, setGigForm] = useState({ title: '', description: '', category: 'Coding', budget: '', deadline: '' });

  const fetchGigs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/gigs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.length > 0) {
        setGigs(data);
      }
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  useEffect(() => {
    if (token) fetchGigs();
  }, [token]);

  const handlePostGig = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/v1/gigs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(gigForm)
      });
      if (response.ok) {
        setShowModal(false);
        fetchGigs(); // Refresh feed
        alert("Gig posted successfully!");
      }
    } catch (error) {
      alert("Error posting gig");
    }
  };

  const handleApply = async (gigId) => {
    const pitch = prompt("Enter a short pitch for why you should be hired:");
    if (!pitch) return;
    try {
      const response = await fetch(`http://localhost:5000/api/v1/gigs/${gigId}/apply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ pitch })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Applied successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error applying");
    }
  };

  // Fallback dummy data if no gigs exist yet
  const displayGigs = gigs.length > 0 ? gigs : [
    { _id: '1', category: 'Coding', budget: 3000, title: 'Need a Portfolio Website', description: 'Looking for a React developer to build my photography portfolio.', deadline: new Date(Date.now() + 3*86400000).toISOString() },
    { _id: '2', category: 'Video Editing', budget: 1500, title: 'Edit Tech Fest Highlights', description: 'Require someone proficient in Premiere Pro for a 2-min highlight reel.', deadline: new Date(Date.now() + 5*86400000).toISOString() }
  ];

  if (!user) {
    return <div className="dashboard-container" style={{paddingTop: '4rem'}}><h2>Please Log In to view your dashboard.</h2></div>;
  }

  return (
    <div className="dashboard-container">
      
      {/* Post Gig Modal */}
      {showModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div className="glass-card" style={{width: '500px', position: 'relative'}}>
            <button onClick={() => setShowModal(false)} style={{position: 'absolute', right: '1rem', top: '1rem', background: 'transparent', color: 'white'}}><X size={20} /></button>
            <h2 style={{marginBottom: '1rem'}}>Post a New Gig</h2>
            <form onSubmit={handlePostGig} className="auth-form">
              <input type="text" placeholder="Gig Title" required className="role-select" style={{paddingLeft: '1rem', backgroundImage: 'none'}} onChange={e => setGigForm({...gigForm, title: e.target.value})} />
              <textarea placeholder="Description" required className="role-select" style={{paddingLeft: '1rem', backgroundImage: 'none', height: '100px'}} onChange={e => setGigForm({...gigForm, description: e.target.value})}></textarea>
              <select className="role-select" onChange={e => setGigForm({...gigForm, category: e.target.value})}>
                <option value="Coding">Coding</option>
                <option value="Design">Design</option>
                <option value="Video Editing">Video Editing</option>
              </select>
              <input type="number" placeholder="Budget (₹)" required className="role-select" style={{paddingLeft: '1rem', backgroundImage: 'none'}} onChange={e => setGigForm({...gigForm, budget: e.target.value})} />
              <input type="date" required className="role-select" style={{paddingLeft: '1rem', backgroundImage: 'none'}} onChange={e => setGigForm({...gigForm, deadline: e.target.value})} />
              <button type="submit" className="btn-primary" style={{marginTop: '1rem'}}>Publish Gig</button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar / Quick Stats */}
      <div className="dashboard-sidebar">
        <div className="glass-card profile-summary">
          <div className="avatar large-avatar"></div>
          <h3>{user.name}</h3>
          <p className="text-muted">{user.role}</p>
          <div className="trust-score">
            <Star size={16} className="text-emerald" /> {user.trustScore || 'New User'}
          </div>
        </div>

        <div className="glass-card wallet-card">
          <div className="wallet-header">
            <Wallet size={20} className="purple-text" />
            <span>Balance</span>
          </div>
          <h2>₹ {user.walletBalance || 0}</h2>
          <div className="wallet-actions">
            <button className="btn-secondary small" onClick={() => alert("Payment gateway (Razorpay/Stripe) will be integrated here!")}>Add Funds</button>
            <button className="btn-ghost small" onClick={() => alert("Withdrawal feature active in production.")}>Withdraw</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Welcome back, {user.name.split(' ')[0]}! 👋</h2>
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search for skills, freelancers..." />
          </div>
          <button className="icon-btn"><Bell size={20} /></button>
        </div>

        {/* Featured Gigs / Feed */}
        <div className="feed-section">
          <div className="feed-header">
            <h3>Recommended Gigs</h3>
            <button className="btn-primary" onClick={() => setShowModal(true)}>Post a Request</button>
          </div>

          <div className="gig-grid">
            {displayGigs.map(gig => (
              <div className="glass-card gig-card" key={gig._id}>
                <div className="gig-header">
                  <span className={`tag ${gig.category === 'Coding' ? 'blue' : 'purple'}`}>{gig.category || 'General'}</span>
                  <span className="price">₹ {gig.budget}</span>
                </div>
                <h4>{gig.title}</h4>
                <p className="text-muted text-sm">{gig.description}</p>
                <div className="gig-footer">
                  <span>Due: {new Date(gig.deadline).toLocaleDateString()}</span>
                  <button className="btn-secondary small" onClick={() => handleApply(gig._id)}>Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
