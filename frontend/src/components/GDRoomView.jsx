import React, { useState, useEffect, useRef } from 'react';
import { Users, Clock, ShieldCheck, Mic, MicOff, Video, VideoOff, LogOut, Bot } from 'lucide-react';
import Vapi from '@vapi-ai/web';

export default function GDRoomView({ currentUser, onFinishGD }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [topic, setTopic] = useState('Should artificial intelligence replace traditional software development jobs?');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  
  const [callStatus, setCallStatus] = useState('loading');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState([]);
  
  const videoRef = useRef(null);
  const vapiRef = useRef(null);
  const elapsedRef = useRef(0);
  const streamRef = useRef(null);

  // 1. Setup Camera
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(e => console.warn('GD Camera access denied or failed', e));

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => t.enabled = isMicOn);
      streamRef.current.getVideoTracks().forEach(t => t.enabled = isVideoOn);
      if (vapiRef.current && callStatus === 'active') {
        try { vapiRef.current.setMuted(!isMicOn); } catch (e) {}
      }
    }
  }, [isMicOn, isVideoOn, callStatus]);

  // 2. Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;

    // Trigger conclusion near end (e.g., at 9 mins = 540s)
    if (elapsedSeconds === 540) {
      if (vapiRef.current && callStatus === 'active') {
        vapiRef.current.send({
          type: 'add-message',
          message: {
            role: 'system',
            content: `Time is almost up. Break your silence. Ask ${currentUser?.fullName || 'the participant'} to summarize and conclude the discussion.`
          }
        });
      }
    }

    if (elapsedSeconds >= 600) {
      onFinishGD({ elapsedSeconds, transcript });
    }
  }, [elapsedSeconds, callStatus, currentUser, transcript, onFinishGD]);

  // 3. Vapi Moderator Setup
  useEffect(() => {
    const VapiClass = Vapi.default || Vapi;
    const vapi = new VapiClass(import.meta.env.VITE_VAPI_PUBLIC_KEY || 'mock-vapi-key');
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setCallStatus('active');
      // Instruct Vapi to be a GD moderator
      setTimeout(() => {
        vapi.send({
          type: 'add-message',
          message: {
            role: 'system',
            content: `You are the AI Moderator for a Group Discussion. Topic: "${topic}". 
PHASE 1: Welcome everyone and ask them to introduce themselves.
PHASE 2: Announce the topic clearly.
PHASE 3 (SILENT MODE): After announcing the topic, YOU MUST GO COMPLETELY SILENT. Do not speak. Let participants discuss. Do not acknowledge points or say 'next'.
PHASE 4: You will receive another system message when it's time to conclude.`
          }
        });
      }, 1000);
    });

    vapi.on('call-end', () => setCallStatus('inactive'));
    vapi.on('speech-start', () => setIsAiSpeaking(true));
    vapi.on('speech-end', () => setIsAiSpeaking(false));
    vapi.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const text = message.transcript;
        const sender = message.role === 'assistant' ? 'AI Moderator' : (currentUser?.fullName || 'Candidate');
        setTranscript(prev => [...prev, { sender, text }]);
      }
    });

    // Start Vapi
    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID || 'mock-assistant-id';
    vapi.start(assistantId).catch(e => {
      console.warn('Vapi start failed (mocking local setup):', e);
      setCallStatus('active');
    });

    return () => {
      if (vapi) {
        vapi.removeAllListeners();
        vapi.stop();
      }
    };
  }, [topic, currentUser]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const participants = [
    { id: 'you', name: currentUser?.fullName || 'You', isHost: true }
    // Friends would be mapped here if a real-time backend existed
  ];

  return (
    <div className="gd-room-root" style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>GROUP DISCUSSION</span>
          <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} /> {formatTime(elapsedSeconds)}
          </span>
        </div>
        <div>
          <button 
            style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
            onClick={() => {
              if (vapiRef.current) {
                vapiRef.current.send({
                  type: 'add-message',
                  message: { role: 'system', content: 'Say: "Thank you everyone. That concludes today\'s group discussion." and then stop speaking.' }
                });
                setTimeout(() => onFinishGD({ elapsedSeconds, transcript }), 3000);
              } else {
                onFinishGD({ elapsedSeconds, transcript });
              }
            }}
          >
            <LogOut size={16} /> Leave GD
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', gap: '24px' }}>
        
        {/* Topic Banner */}
        <div style={{ background: '#1a1a1a', border: '1px solid #333', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <h4 style={{ color: '#888', margin: '0 0 8px 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Discussion Topic</h4>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#fff' }}>"{topic}"</h2>
        </div>

        {/* AI Moderator Panel */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: isAiSpeaking ? 'rgba(139, 92, 246, 0.2)' : '#1a1a1a', border: `1px solid ${isAiSpeaking ? '#8b5cf6' : '#333'}`, padding: '16px 32px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s ease' }}>
            <div style={{ background: isAiSpeaking ? '#8b5cf6' : '#444', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} color="#fff" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>AI Moderator {isAiSpeaking ? '(Speaking...)' : '(Listening)'}</span>
          </div>
        </div>

        {/* Participants Grid */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginTop: '20px' }}>
          {participants.map(p => (
            <div key={p.id} style={{ width: '280px', height: '200px', background: '#222', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid #444' }}>
              {p.id === 'you' ? (
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333' }}>
                  <Users size={48} color="#666" />
                </div>
              )}
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.9rem', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{p.name} {p.isHost && '(Host)'}</span>
                {p.id === 'you' && !isMicOn && <MicOff size={14} color="#ef4444" />}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Controls Footer */}
      <div style={{ padding: '24px', background: '#111', borderTop: '1px solid #222', display: 'flex', justifyContent: 'center', gap: '24px' }}>
        <button 
          onClick={() => setIsMicOn(!isMicOn)}
          style={{ width: '56px', height: '56px', borderRadius: '50%', background: isMicOn ? '#333' : '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <button 
          onClick={() => setIsVideoOn(!isVideoOn)}
          style={{ width: '56px', height: '56px', borderRadius: '50%', background: isVideoOn ? '#333' : '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
        </button>
      </div>

    </div>
  );
}
