import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Mic, MicOff, Video, VideoOff, Play, Code, CheckSquare, Clock, ArrowRight, MessageSquare, AlertCircle, StopCircle, Maximize2, Settings, ChevronRight, ShieldCheck, Lightbulb, PhoneOff } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import './LiveInterviewStudio.css';

export default function LiveInterviewStudio({ initialStream, interviewConfig, onFinishInterview, isSequential }) {
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestionText, setCurrentQuestionText] = useState(
    "Welcome! Let's begin. Could you explain the overall system architecture and technical challenges of your primary software project?"
  );

  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcript, setTranscript] = useState([
    {
      sender: 'interviewer',
      text: "Welcome to your AI Interview Session. Click 'Start Interview' to connect to Vapi.",
      time: '00:00',
    }
  ]);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [currentRound, setCurrentRound] = useState(isSequential ? 'Aptitude' : null);

  const [callStatus, setCallStatus] = useState('inactive');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  
  const videoRef = useRef(null);
  const vapiRef = useRef(null);
  const elapsedRef = useRef(0);
  
  const isCoding = isSequential ? currentRound === 'Coding' : (interviewConfig?.roundType === 'Coding' || interviewConfig?.type?.includes('Coding'));
  const isHR = isSequential ? currentRound === 'HR' : (interviewConfig?.roundType === 'HR' || interviewConfig?.roundType === 'Behavioral' || interviewConfig?.type?.includes('HR') || interviewConfig?.type?.includes('Behavioral'));
  const isAptitude = isSequential ? currentRound === 'Aptitude' : (interviewConfig?.roundType === 'Aptitude' || interviewConfig?.type?.includes('Aptitude'));
  const isGD = isSequential ? currentRound === 'GD' : (interviewConfig?.roundType === 'GD' || interviewConfig?.type?.includes('GD'));
  const isTechnical = isSequential ? currentRound === 'Technical' : (!isCoding && !isHR && !isAptitude && !isGD);

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  useEffect(() => {
    if (initialStream) {
      initialStream.getAudioTracks().forEach(t => t.enabled = isMicOn);
      // Also notify Vapi if it's connected
      if (vapiRef.current && callStatus === 'active') {
        try {
          vapiRef.current.setMuted(!isMicOn);
        } catch (e) {
          console.warn('Vapi mute warning:', e);
        }
      }
    }
  }, [isMicOn, initialStream, callStatus]);

  useEffect(() => {
    if (initialStream) {
      initialStream.getVideoTracks().forEach(t => t.enabled = isVideoOn);
    }
  }, [isVideoOn, initialStream]);

  // Monitor stream track ended events
  useEffect(() => {
    if (!initialStream) return;

    const handleTrackEnded = () => {
      console.warn('A media track ended unexpectedly.');
      // Keep UI somewhat in sync, though tracks can't easily restart without full renegotiation
    };

    initialStream.getTracks().forEach(track => {
      track.addEventListener('ended', handleTrackEnded);
    });

    return () => {
      initialStream.getTracks().forEach(track => {
        track.removeEventListener('ended', handleTrackEnded);
      });
    };
  }, [initialStream]);

  // Cleanup stream on unmount handled by MockInterviewPage now


  // 1. Attach Video Stream
  useEffect(() => {
    if (initialStream && videoRef.current) {
      videoRef.current.srcObject = initialStream;
      videoRef.current.play().catch(e => console.warn('Main video play blocked:', e));
    }
  }, [initialStream, currentRound]);

  // 2. Timer Interval
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // 3. Vapi Initialization
  useEffect(() => {
    if (isAptitude) return;

    const VapiClass = Vapi.default || Vapi;
    const vapi = new VapiClass(import.meta.env.VITE_VAPI_PUBLIC_KEY || 'mock-vapi-key');
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setCallStatus('active');
    });

    vapi.on('call-end', () => {
      setCallStatus('inactive');
    });

    vapi.on('speech-start', () => setIsAiSpeaking(true));
    vapi.on('speech-end', () => setIsAiSpeaking(false));

    vapi.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const text = message.transcript;
        const sender = message.role === 'assistant' ? 'interviewer' : 'candidate';
        const m = Math.floor(elapsedRef.current / 60).toString().padStart(2, '0');
        const s = (elapsedRef.current % 60).toString().padStart(2, '0');
        setTranscript(prev => [...prev, { sender, text, time: `${m}:${s}` }]);
      }
    });

    vapi.on('error', (e) => {
      console.error('Vapi Error:', e);
      setCallStatus('inactive');
    });

    return () => {
      if (vapi) {
        vapi.removeAllListeners();
        vapi.stop();
      }
    };
  }, [isAptitude]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleVapiCall = () => {
    if (callStatus === 'active' || callStatus === 'loading') {
      setCallStatus('loading');
      vapiRef.current?.stop();
    } else {
      setCallStatus('loading');
      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID || 'mock-assistant-id';
      vapiRef.current?.start(assistantId);
    }
  };

  const handleNextRound = () => {
    if (currentRound === 'Aptitude') {
      setCurrentRound('HR');
      setCurrentQuestionNumber(1);
    } else if (currentRound === 'HR') {
      setCurrentRound('Technical');
      setCurrentQuestionNumber(1);
    } else if (currentRound === 'Technical') {
      setCurrentRound('Coding');
      setCurrentQuestionNumber(1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionNumber >= 3) {
      if (isSequential && currentRound !== 'Coding') {
        handleNextRound();
      } else {
        onFinishInterview({ elapsedSeconds, transcript });
      }
    } else {
      setCurrentQuestionNumber(prev => prev + 1);
    }
  };

  const renderCodingLayout = () => (
    <div className="layout-coding">
      <div className="coding-header">
        <div className="header-left">
          <button className="nav-btn" onClick={() => onFinishInterview({ elapsedSeconds, transcript })}>Back</button>
          <span className="round-indicator">Coding Round 1</span>
          <span className="session-id">ID: SESSION_LIVE_123</span>
        </div>
        <div className="header-right">
          <button 
            className={`ai-voice-btn ${callStatus === 'active' ? 'active-call' : ''}`} 
            onClick={toggleVapiCall}
            disabled={callStatus === 'loading'}
          >
            {callStatus === 'loading' ? 'Connecting...' : (callStatus === 'active' ? 'AI Voice: ON' : 'AI Voice: OFF (Start)')}
          </button>
          <button className="end-btn" onClick={() => onFinishInterview({ elapsedSeconds, transcript })}>End Interview</button>
          <div className="timer-pill"><Clock size={16}/> {formatTime(elapsedSeconds)}</div>
          <select className="lang-select"><option>JavaScript</option><option>Python</option></select>
          <button className="action-btn">Help/Hints</button>
          <button className="run-btn"><Play size={16}/> Run Code</button>
          <button className="submit-btn"><CheckSquare size={16}/> Submit</button>
        </div>
      </div>
      
      <div className="coding-workspace">
        <div className="workspace-left">
          <div className="tabs-header">
            <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Problem Details</button>
            <button className={activeTab === 'examples' ? 'active' : ''} onClick={() => setActiveTab('examples')}>Examples</button>
            <button className={activeTab === 'hints' ? 'active' : ''} onClick={() => setActiveTab('hints')}>Hints</button>
          </div>
          <div className="tab-content">
            {activeTab === 'details' && (
              <div>
                <h2>Two Sum</h2>
                <p>Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="workspace-right">
          <div className="code-editor-panel">
            <div className="editor-header">Code Editor</div>
            <textarea className="editor-textarea" defaultValue={"function twoSum(nums, target) {\n  \n}"}></textarea>
          </div>
          <div className="test-cases-panel">
            <div className="test-header">Test Cases</div>
            <div className="test-content">
              <p>Case 1: Input: nums = [2,7,11,15], target = 9</p>
              <p>Expected Output: [0,1]</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Overlays */}
      <div className="pip-camera">
        <video ref={videoRef} autoPlay playsInline muted className="pip-video" />
      </div>
      <div className="transcript-overlay">
        <h4>Transcript</h4>
        {transcript.map((t, i) => <div key={i}>[{t.time}] {t.text}</div>)}
      </div>
    </div>
  );

  const handleEndCallClick = () => {
    if (showEndConfirm) {
      onFinishInterview({ elapsedSeconds, transcript });
    } else {
      setShowEndConfirm(true);
      setTimeout(() => setShowEndConfirm(false), 4000);
    }
  };

  const renderHRTechnicalLayout = (layoutType) => (
    <div className="layout-hr-tech">
      <div className="hr-header">
        <div className="header-left">
          <button className="nav-btn" onClick={() => onFinishInterview({ elapsedSeconds, transcript })}>Exit</button>
          <span className="round-indicator">{layoutType === 'Aptitude' ? 'Aptitude Round' : (layoutType === 'HR' ? 'HR Screening' : (layoutType === 'GD' ? 'Group Discussion' : 'Technical Round'))}</span>
          <span className="desc-text">{interviewConfig?.type}</span>
        </div>
        <div className="header-right">
          <div className="timer-pill"><Clock size={16}/> {formatTime(elapsedSeconds)}</div>
          <div className="progress-bar">Q{currentQuestionNumber}/3</div>
          {isSequential && layoutType !== 'Coding' && (
            <button className="next-round-btn" onClick={handleNextRound}>
              {layoutType === 'Aptitude' ? 'HR Round' : (layoutType === 'HR' ? 'Technical Round' : 'Coding Round')} <ArrowRight size={16}/>
            </button>
          )}
        </div>
      </div>

      <div className="hr-main-area">
        <div className="interview-video-workspace">
          <div className="video-panel">
            <video ref={videoRef} autoPlay playsInline muted className="main-video" />
            <div className="connection-badge">
              <span className={`status-dot ${callStatus === 'active' ? 'online' : 'offline'}`}></span>
              {callStatus === 'active' ? 'AI Connected' : (callStatus === 'loading' ? 'Connecting...' : 'AI Ready')}
            </div>
            
            <div className="video-call-controls">
              <button 
                className={`call-ctrl-btn ${isMicOn ? 'on' : 'off'}`} 
                onClick={() => setIsMicOn(!isMicOn)}
                title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
                aria-label={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              
              <button 
                className={`call-ctrl-btn ${isVideoOn ? 'on' : 'off'}`} 
                onClick={() => setIsVideoOn(!isVideoOn)}
                title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                aria-label={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              
              <div className="tips-container">
                <button 
                  className={`call-ctrl-btn tips-btn ${showTips ? 'active' : ''}`}
                  onClick={() => setShowTips(!showTips)}
                  title="Interview tips"
                  aria-label="Interview tips"
                >
                  <Lightbulb size={20} />
                </button>
                {showTips && (
                  <div className="tips-popover">
                    <h4>Interview Tips</h4>
                    <ul>
                      <li>Be concise and clear.</li>
                      <li>Use the STAR method for behavioral questions.</li>
                      <li>Always clarify assumptions.</li>
                    </ul>
                    <h4>Technical Focus</h4>
                    <div className="tips-chips">
                      <span>System Design</span>
                      <span>Architecture</span>
                      <span>Problem-Solving</span>
                      <span>Fundamentals</span>
                    </div>
                  </div>
                )}
              </div>

              <button 
                className={`call-ctrl-btn end-call-btn ${showEndConfirm ? 'confirm' : ''}`}
                onClick={handleEndCallClick}
                title="End interview"
                aria-label="End interview"
              >
                {showEndConfirm ? 'Confirm End?' : <PhoneOff size={20} />}
              </button>
            </div>
          </div>

          <div className="interview-bottom-controls">
            <button 
              className={`control-btn ${callStatus === 'active' ? 'active-call' : ''}`} 
              onClick={toggleVapiCall}
              disabled={callStatus === 'loading'}
            >
              {callStatus === 'loading' ? 'Connecting...' : (callStatus === 'active' ? 'Stop AI Voice' : 'Start Interview (Vapi)')}
            </button>
            <button className="control-btn" onClick={handleNextQuestion}>Next Question</button>
          </div>

          {(layoutType === 'HR' || layoutType === 'GD') && (
            <div className="current-question-panel">
              <h3 style={{fontSize: '14px', color: '#94a3b8', marginBottom: '8px', marginTop: 0}}>Current AI Prompt</h3>
              <p className="question-text" style={{fontSize: '16px', margin: 0}}>{currentQuestionText}</p>
            </div>
          )}
        </div>

        <div className="interview-transcript-workspace">
          <div className="sidebar-transcript full-height">
            <h3>Live Transcript</h3>
            <div className="transcript-list">
              {transcript.map((item, idx) => (
                <div key={idx} className={`transcript-row ${item.sender}`}>
                  <span className="t-time">{item.time}</span>
                  <p><strong>{item.sender === 'interviewer' ? 'AI' : 'You'}:</strong> {item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAptitudeLayout = () => (
    <div className="layout-aptitude">
      <div className="hr-header">
        <div className="header-left">
          <button className="nav-btn" onClick={() => onFinishInterview({ elapsedSeconds, transcript })}>Exit</button>
          <span className="round-indicator">Aptitude Assessment</span>
          <span className="desc-text">{interviewConfig?.type}</span>
        </div>
        <div className="header-right">
          <div className="timer-pill"><Clock size={16}/> {formatTime(elapsedSeconds)}</div>
          <div className="progress-bar">Q{currentQuestionNumber}/10</div>
          {isSequential && (
            <button className="next-round-btn" onClick={handleNextRound}>
              HR Round <ArrowRight size={16}/>
            </button>
          )}
        </div>
      </div>

      <div className="aptitude-main-area">
        <div className="aptitude-column-left">
          <div className="question-card card-base">
            <h3 className="aptitude-q-title">Question {currentQuestionNumber}</h3>
            <p className="aptitude-q-text">If a pipe A can fill a tank in 10 hours and pipe B can fill it in 15 hours, how long will it take if both pipes are opened together?</p>
            
            <div className="aptitude-options">
              <label className="option-label">
                <input type="radio" name="aptitude" /> <span>5 hours</span>
              </label>
              <label className="option-label">
                <input type="radio" name="aptitude" /> <span>6 hours</span>
              </label>
              <label className="option-label">
                <input type="radio" name="aptitude" /> <span>8 hours</span>
              </label>
              <label className="option-label">
                <input type="radio" name="aptitude" /> <span>12 hours</span>
              </label>
            </div>
            
            <div className="aptitude-actions">
              <button className="control-btn primary" onClick={handleNextQuestion}>Save & Next</button>
            </div>
          </div>
        </div>

        <div className="aptitude-column-right">
          <div className="question-palette card-base">
            <h3>Question Palette</h3>
            <div className="palette-grid">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <div key={n} className={`palette-box ${n === currentQuestionNumber ? 'active' : ''} ${n < currentQuestionNumber ? 'answered' : ''}`}>
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="live-studio-root animate-fade-in">
      {isCoding && renderCodingLayout()}
      {isAptitude && renderAptitudeLayout()}
      {isHR && renderHRTechnicalLayout('HR')}
      {isGD && renderHRTechnicalLayout('GD')}
      {isTechnical && renderHRTechnicalLayout('Technical')}
    </div>
  );
}
