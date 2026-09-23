import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Mic, MicOff, Video, VideoOff, Send, Clock, Sparkles, MessageSquare, AlertCircle, StopCircle, ArrowRight } from 'lucide-react';
import './LiveInterviewStudio.css';

export default function LiveInterviewStudio({ initialStream, interviewConfig, onFinishInterview }) {
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestionText, setCurrentQuestionText] = useState(
    "Welcome! Let's begin. Could you explain the overall system architecture and technical challenges of your primary software project?"
  );

  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcript, setTranscript] = useState([
    {
      sender: 'interviewer',
      text: "Welcome to your AI Interview Session. I am your Gemini-powered Interviewer. Please take your time to answer each question thoroughly.",
      time: '00:01',
    },
    {
      sender: 'interviewer',
      text: "Q1: Could you explain the overall system architecture and technical challenges of your primary software project?",
      time: '00:05',
    },
  ]);

  const [followUpNotice, setFollowUpNotice] = useState(null);

  // Timer State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const videoRef = useRef(null);

  useEffect(() => {
    if (initialStream && videoRef.current) {
      videoRef.current.srcObject = initialStream;
    }

    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [initialStream]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendAnswer = async (e) => {
    e?.preventDefault();
    if (!candidateAnswer.trim() || isSubmitting) return;

    const userText = candidateAnswer.trim();
    setCandidateAnswer('');
    setIsSubmitting(true);

    // Append candidate answer to transcript
    const currentTimeStr = formatTime(elapsedSeconds);
    setTranscript((prev) => [
      ...prev,
      { sender: 'candidate', text: userText, time: currentTimeStr },
    ]);

    try {
      // Call LangGraph AI Interview Service Backend
      const response = await fetch('http://localhost:5000/api/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'SESSION_LIVE_123',
          questionIndex: currentQuestionNumber - 1,
          candidateAnswer: userText,
          questions: [
            "Could you explain the overall system architecture and technical challenges of your primary software project?",
            "How do you handle concurrency, caching, and database state when building web APIs under high load?",
            "Given an integer array, how do you find all unique triplets that sum to zero with optimal time complexity?",
          ],
        }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        
        if (data.evaluation?.followUpQuestion && !followUpNotice) {
          // AI generates dynamic follow-up
          setFollowUpNotice(data.evaluation.followUpQuestion);
          setTranscript((prev) => [
            ...prev,
            { sender: 'interviewer', text: `Follow-up: ${data.evaluation.followUpQuestion}`, time: currentTimeStr },
          ]);
          setCurrentQuestionText(data.evaluation.followUpQuestion);
        } else if (data.isCompleted || currentQuestionNumber >= 3) {
          // Interview complete!
          setTimeout(() => {
            onFinishInterview({ elapsedSeconds, transcript });
          }, 1200);
        } else {
          // Advance to next question
          setFollowUpNotice(null);
          const nextQNum = currentQuestionNumber + 1;
          const nextQText = data.nextQuestion || "How do you handle concurrency and database indexing under high load?";
          setCurrentQuestionNumber(nextQNum);
          setCurrentQuestionText(nextQText);
          setTranscript((prev) => [
            ...prev,
            { sender: 'interviewer', text: `Q${nextQNum}: ${nextQText}`, time: currentTimeStr },
          ]);
        }
      } else {
        // Dev fallback question progression
        if (currentQuestionNumber < 3) {
          const nextQNum = currentQuestionNumber + 1;
          const nextQText = "How do you prevent cache stampede/thundering herd problem using Redis in Node.js applications?";
          setCurrentQuestionNumber(nextQNum);
          setCurrentQuestionText(nextQText);
          setTranscript((prev) => [
            ...prev,
            { sender: 'interviewer', text: `Q${nextQNum}: ${nextQText}`, time: currentTimeStr },
          ]);
        } else {
          onFinishInterview({ elapsedSeconds, transcript });
        }
      }
    } catch (err) {
      console.warn('Live interview submit notice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="live-studio-root animate-fade-in">
      
      {/* Top Studio Control Bar */}
      <div className="studio-top-bar">
        <div className="studio-bar-info">
          <div className="status-dot-pulse"></div>
          <span className="studio-session-title">
            LIVE AI INTERVIEW • {interviewConfig?.type || 'Technical SDE-1'}
          </span>
        </div>

        <div className="studio-timer-pill">
          <Clock size={16} />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>

        <button className="end-interview-btn" onClick={() => onFinishInterview({ elapsedSeconds, transcript })}>
          <StopCircle size={18} />
          <span>End & Generate Report</span>
        </button>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="studio-main-grid">
        
        {/* Left Side: Video Streams (AI Interviewer + Candidate Camera) */}
        <div className="video-streams-col">
          
          {/* AI Interviewer Stage Box */}
          <div className="ai-interviewer-card card-base">
            <div className="ai-stage-avatar-glow">
              <Bot size={48} color="#ffffff" />
            </div>
            <div className="ai-stage-info">
              <h3 className="ai-name">Interact Gemini AI Interviewer</h3>
              <p className="ai-subtitle">● Evaluating Technical Clarity & Architecture Depth</p>
            </div>
          </div>

          {/* Candidate Live Stream Box */}
          <div className="candidate-stream-card card-base">
            <video ref={videoRef} autoPlay playsInline muted className="candidate-video-feed" />
            
            <div className="candidate-video-overlay">
              <span className="candidate-tag"><User size={14} /> You (Candidate)</span>
              
              <div className="stream-controls">
                <button className={`icon-ctrl-btn ${isMicOn ? 'active' : ''}`} onClick={() => setIsMicOn(!isMicOn)}>
                  {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button className={`icon-ctrl-btn ${isVideoOn ? 'active' : ''}`} onClick={() => setIsVideoOn(!isVideoOn)}>
                  {isVideoOn ? <Video size={16} /> : <VideoOff size={16} />}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Current Question & Answer Input Panel */}
        <div className="question-panel-col">
          
          {/* Active Question Card */}
          <div className="active-question-card card-base">
            <div className="q-badge-row">
              <span className="q-num-badge">Question {currentQuestionNumber} of 3</span>
              <span className="ai-live-badge"><Sparkles size={13} /> Gemini AI Contextual</span>
            </div>

            <h2 className="q-prompt-text">"{currentQuestionText}"</h2>

            {followUpNotice && (
              <div className="followup-alert">
                <AlertCircle size={16} />
                <span>AI Follow-Up: Please detail your specific technical approach.</span>
              </div>
            )}
          </div>

          {/* Verbal & Text Answer Input Box */}
          <div className="answer-input-card card-base">
            <h4 className="answer-card-title">Your Answer (Speak or Type)</h4>
            
            <form onSubmit={handleSendAnswer}>
              <textarea 
                className="answer-textarea"
                rows={5}
                placeholder="Speak verbally into your microphone or type your response here..."
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
              />

              <div className="answer-action-row">
                <span className="mic-hint-text">
                  <Mic size={14} style={{ color: '#22c55e', display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  Microphone active & listening...
                </span>

                <button 
                  type="submit" 
                  className="btn-primary-purple submit-q-btn"
                  disabled={!candidateAnswer.trim() || isSubmitting}
                >
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit Answer & Next'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Transcript Log Summary */}
          <div className="transcript-drawer card-base">
            <div className="transcript-header">
              <MessageSquare size={16} />
              <h4>Live Session Transcript ({transcript.length})</h4>
            </div>
            
            <div className="transcript-messages-list">
              {transcript.map((item, idx) => (
                <div key={idx} className={`transcript-row ${item.sender}`}>
                  <span className="t-time">{item.time}</span>
                  <p className="t-text"><strong>{item.sender === 'interviewer' ? 'Interviewer' : 'You'}:</strong> {item.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
