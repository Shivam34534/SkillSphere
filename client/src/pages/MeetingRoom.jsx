import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, Mic, MicOff, VideoOff, PhoneMissed, MessageSquare, Share, Users } from 'lucide-react';

const MeetingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [joining, setJoining] = useState(true);

  useEffect(() => {
    // Simulate connecting to a video server
    const timer = setTimeout(() => {
      setJoining(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', padding: '0.5rem', borderRadius: '8px' }}>
            <Video size={20} color="white" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>SkillSphere Barter Room</h2>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>ID: {id}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Users size={16} /> 2 Participants</span>
        </div>
      </div>

      {/* Main Video Area */}
      <div style={{ flex: 1, padding: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' }}>
        {joining ? (
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
            <p style={{ color: '#cbd5e1' }}>Connecting to secure peer-to-peer network...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {/* Peer Video */}
            <div style={{ flex: 1, height: '100%', maxWidth: '800px', backgroundColor: '#1e293b', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#475569', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: 'bold', color: '#cbd5e1' }}>
                P
              </div>
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                Peer Partner
              </div>
            </div>

            {/* My Video */}
            <div style={{ width: '300px', height: '200px', backgroundColor: '#334155', borderRadius: '12px', position: 'absolute', bottom: '100px', right: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
              {videoOn ? (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8' }}>Camera Active</span>
                </div>
              ) : (
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#475569', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  You
                </div>
              )}
              <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.7rem' }}>
                You
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls Bar */}
      <div style={{ padding: '1.5rem', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => setMicOn(!micOn)}
          style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: micOn ? '#334155' : '#ef4444', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
          {micOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>
        <button 
          onClick={() => setVideoOn(!videoOn)}
          style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: videoOn ? '#334155' : '#ef4444', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
          {videoOn ? <Video size={22} /> : <VideoOff size={22} />}
        </button>
        <button 
          style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: '#334155', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          <Share size={20} />
        </button>
        <button 
          style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: '#334155', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          <MessageSquare size={20} />
        </button>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ width: '60px', height: '50px', borderRadius: '25px', border: 'none', backgroundColor: '#ef4444', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginLeft: '2rem' }}>
          <PhoneMissed size={22} />
        </button>
      </div>
    </div>
  );
};

export default MeetingRoom;
