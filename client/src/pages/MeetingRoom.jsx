import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, Mic, MicOff, VideoOff, PhoneMissed, MessageSquare, Share, Users, X, Send } from 'lucide-react';
import io from 'socket.io-client';

const MeetingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [joining, setJoining] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'System', text: 'Secure P2P connection established.', time: new Date().toLocaleTimeString() }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef();
  const myStreamRef = useRef();

  useEffect(() => {
    // 1. Initialize Socket
    socketRef.current = io('http://localhost:5000');
    
    // 2. Get User Media gracefully
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        return stream;
      } catch (err) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          return stream;
        } catch (err2) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return stream;
          } catch (err3) {
            return null; // Return null silently if no devices exist
          }
        }
      }
    };

    getMedia().then((stream) => {
      setJoining(false);
      
      if (stream) {
        myStreamRef.current = stream;
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      } else {
        // Force video/audio off states if no hardware found
        setVideoOn(false);
        setMicOn(false);
      }

      // 3. Join Room
      socketRef.current.emit('join-room', id, socketRef.current.id);

      // 4. WebRTC Signaling Logic
      socketRef.current.on('user-connected', async (userId) => {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        if (stream) {
          stream.getTracks().forEach(track => peer.addTrack(track, stream));
        }

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit('ice-candidate', { target: userId, candidate: event.candidate });
          }
        };

        peer.ontrack = (event) => {
          if (userVideo.current) userVideo.current.srcObject = event.streams[0];
        };

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socketRef.current.emit('offer', { target: userId, caller: socketRef.current.id, sdp: offer });
        
        connectionRef.current = peer;
      });

      socketRef.current.on('offer', async (payload) => {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        if (stream) {
          stream.getTracks().forEach(track => peer.addTrack(track, stream));
        }

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit('ice-candidate', { target: payload.caller, candidate: event.candidate });
          }
        };

        peer.ontrack = (event) => {
          if (userVideo.current) userVideo.current.srcObject = event.streams[0];
        };

        await peer.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socketRef.current.emit('answer', { target: payload.caller, sdp: answer });

        connectionRef.current = peer;
      });

      socketRef.current.on('answer', async (payload) => {
        if (connectionRef.current && connectionRef.current.signalingState !== 'stable') {
          try {
            await connectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
          } catch (e) {} // ignore race conditions
        }
      });

      socketRef.current.on('ice-candidate', async (payload) => {
        if (connectionRef.current && payload.candidate && connectionRef.current.remoteDescription) {
          try {
            await connectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
          } catch (e) {}
        }
      });
    });

    // Chat listener
    socketRef.current.on('receive-chat', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (myStreamRef.current) myStreamRef.current.getTracks().forEach(track => track.stop());
      if (socketRef.current) socketRef.current.disconnect();
      if (connectionRef.current) connectionRef.current.close();
    };
  }, [id]);

  const toggleVideo = () => {
    if (myStreamRef.current) {
      const videoTrack = myStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoOn;
        setVideoOn(!videoOn);
      }
    }
  };

  const toggleMic = () => {
    if (myStreamRef.current) {
      const audioTrack = myStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msgObj = { sender: 'Peer Partner', text: newMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    
    // Send to peer
    socketRef.current.emit('send-chat', id, msgObj);
    
    // Add to my UI
    setMessages([...messages, { sender: 'You', text: newMessage, time: msgObj.time }]);
    setNewMessage('');
  };

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', padding: '0.5rem', borderRadius: '8px' }}>
            <Video size={20} color="white" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>SkillSphere LIVE</h2>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>Room: {id}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main Video Area */}
        <div style={{ flex: 1, padding: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617', position: 'relative' }}>
          {joining ? (
             <div style={{ textAlign: 'center' }}>
               <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
               <p style={{ color: '#cbd5e1' }}>Allow camera access & connecting to network...</p>
               <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
             </div>
          ) : (
            <>
              {/* Peer Video */}
              <div style={{ flex: 1, height: '100%', maxWidth: '1000px', backgroundColor: '#1e293b', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <video playsInline autoPlay ref={userVideo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                  Peer Partner
                </div>
              </div>

              {/* My Video */}
              <div style={{ width: '250px', height: '160px', backgroundColor: '#334155', borderRadius: '12px', position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden', zIndex: 10 }}>
                <video playsInline muted autoPlay ref={myVideo} style={{ width: '100%', height: '100%', objectFit: 'cover', display: videoOn ? 'block' : 'none' }} />
                {!videoOn && (
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#475569', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>You</div>
                )}
                <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.7rem' }}>
                  You {!micOn && <MicOff size={10} style={{ marginLeft: '4px', display: 'inline' }} color="#ef4444" />}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Chat Panel */}
        {chatOpen && (
          <div style={{ width: '350px', backgroundColor: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Live Chat</h3>
              <button onClick={() => setChatOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem', textAlign: msg.sender === 'You' ? 'right' : 'left' }}>
                    {msg.sender} • {msg.time}
                  </div>
                  <div style={{ padding: '0.8rem 1rem', borderRadius: '12px', backgroundColor: msg.sender === 'You' ? '#3b82f6' : '#1e293b', color: 'white', fontSize: '0.9rem' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a message..." 
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: '#1e293b', color: 'white', outline: 'none' }}
                />
                <button type="submit" style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer' }}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ padding: '1.5rem', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <button onClick={toggleMic} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: micOn ? '#334155' : '#ef4444', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          {micOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>
        <button onClick={toggleVideo} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: videoOn ? '#334155' : '#ef4444', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          {videoOn ? <Video size={22} /> : <VideoOff size={22} />}
        </button>
        <button onClick={() => setChatOpen(!chatOpen)} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: chatOpen ? '#3b82f6' : '#334155', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          <MessageSquare size={20} />
        </button>
        <button onClick={() => navigate('/dashboard')} style={{ width: '60px', height: '50px', borderRadius: '25px', border: 'none', backgroundColor: '#ef4444', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginLeft: '2rem' }}>
          <PhoneMissed size={22} />
        </button>
      </div>
    </div>
  );
};

export default MeetingRoom;
