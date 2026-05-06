import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, Mic, MicOff, VideoOff, PhoneMissed, MessageSquare, Share, Users, X, Send } from 'lucide-react';
import io from 'socket.io-client';
import { SOCKET_URL, API_URL } from '../config';

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
    socketRef.current = io(SOCKET_URL);
    
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

  const handleCompleteSession = async () => {
    if (window.confirm("Ready to complete this session? You will earn XP and increase your Trust Score!")) {
      try {
        const response = await fetch(`${API_URL}/matches/${id}/complete`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          alert("Session completed! 🚀 Rewards added to your profile.");
          navigate('/dashboard');
        } else {
          const err = await response.json();
          alert(err.message);
        }
      } catch (error) {
        alert("Failed to complete session");
      }
    }
  };

  return (
    <div className="h-screen w-full bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 flex justify-between items-center border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
            <Video size={18} color="white" className="md:w-5 md:h-5" />
          </div>
          <h2 className="m-0 text-sm md:text-lg font-bold">SkillSphere LIVE</h2>
          <span className="hidden sm:inline-block bg-white/10 px-3 py-1 rounded-full text-[10px] md:text-xs text-slate-300">Room: {id}</span>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1.5 bg-success/20 px-3 py-1 rounded-full border border-success/30">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-success uppercase tracking-widest">Connected</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Video Area */}
        <div className="flex-1 p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center bg-slate-900 relative">
          {joining ? (
             <div className="text-center">
               <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
               <p className="text-slate-400 text-sm">Initializing encrypted P2P stream...</p>
             </div>
          ) : (
            <>
              {/* Peer Video */}
              <div className="flex-1 w-full h-full max-w-5xl bg-slate-800 rounded-2xl md:rounded-3xl flex justify-center items-center relative overflow-hidden border border-white/10 shadow-2xl">
                <video playsInline autoPlay ref={userVideo} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10">
                  Peer Partner
                </div>
              </div>

              {/* My Video (PIP) */}
              <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-32 h-44 sm:w-48 sm:h-32 md:w-64 md:h-44 bg-slate-700 rounded-xl md:rounded-2xl flex justify-center items-center border-2 border-white/20 shadow-2xl overflow-hidden z-20">
                <video playsInline muted autoPlay ref={myVideo} className={`w-full h-full object-cover ${videoOn ? 'block' : 'hidden'}`} />
                {!videoOn && (
                  <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-lg font-bold">You</div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-medium border border-white/10">
                  You {!micOn && <MicOff size={10} className="inline ml-1 text-red-500" />}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Chat Panel */}
        {chatOpen && (
          <div className="fixed inset-y-0 right-0 z-[100] w-full sm:w-[350px] bg-slate-900 border-l border-white/10 flex flex-col animate-scale-in">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="m-0 text-lg font-bold">Live Chat</h3>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`max-w-[85%] ${msg.sender === 'You' ? 'self-end' : 'self-start'}`}>
                  <div className={`text-[10px] text-slate-400 mb-1 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                    {msg.sender} • {msg.time}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'You' ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-800 text-white rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                />
                <button type="submit" className="p-3 bg-primary rounded-xl hover:bg-primary-hover transition-all shrink-0">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="px-4 py-6 md:py-8 bg-slate-950 flex flex-wrap justify-center items-center gap-3 md:gap-6 border-t border-white/10 shrink-0 z-[110]">
        <button onClick={toggleMic} className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-500 shadow-lg shadow-red-500/20'}`}>
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button onClick={toggleVideo} className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${videoOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-500 shadow-lg shadow-red-500/20'}`}>
          {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button onClick={() => setChatOpen(!chatOpen)} className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${chatOpen ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-800 hover:bg-slate-700'}`}>
          <MessageSquare size={20} />
        </button>
        
        <div className="w-px h-8 bg-white/10 mx-2 hidden sm:block"></div>

        <button onClick={() => navigate('/dashboard')} className="w-16 md:w-20 h-12 md:h-14 rounded-3xl bg-slate-800 hover:bg-red-500 transition-all flex items-center justify-center group">
          <PhoneMissed size={20} className="group-hover:scale-110 transition-transform" />
        </button>
        
        <button onClick={handleCompleteSession} className="btn-primary h-12 md:h-14 px-6 md:px-8 rounded-3xl text-xs md:text-sm font-black uppercase tracking-widest bg-gradient-to-r from-success to-emerald-600 shadow-lg shadow-success/20">
          Complete Session
        </button>
      </div>
    </div>
  );
};

export default MeetingRoom;
