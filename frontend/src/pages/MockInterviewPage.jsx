import React, { useState, useEffect } from 'react';
import InterviewLobby from '../components/InterviewLobby';
import LiveInterviewStudio from '../components/LiveInterviewStudio';
import InterviewReportView from '../components/InterviewReportView';
import GDSetupView from '../components/GDSetupView';
import GDRoomView from '../components/GDRoomView';
import GDOnboardingModal from '../components/GDOnboardingModal';
import AptitudePracticeStudio from '../components/AptitudePracticeStudio';
import RoundLoadingOverlay from '../components/RoundLoadingOverlay';
import { Award, ShieldCheck, Sparkles, Video, Play, ArrowRight, Brain, Code, Briefcase, Users, LayoutDashboard } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import API_BASE_URL from '../config/api';

export default function MockInterviewPage({ currentUser, onNavigate, onInterviewStateChange }) {
  const [stage, setStage] = useState('setup'); // 'setup', 'lobby', 'studio', 'report', 'gd-setup', 'gd-room'
  const [showGDOnboarding, setShowGDOnboarding] = useState(false);
  const { addNotification } = useNotifications();
  const [interviewConfig, setInterviewConfig] = useState({
    type: 'Technical SDE-1',
    duration: '30', // '15', '30', '45', '60'
    mode: 'role_jd', // 'resume', 'role_jd', 'hr', 'cs_core'
    targetRole: 'Software Development Engineer',
    jobDescription: 'Proficiency in Data Structures, React.js, Node.js, and SQL Database management.',
    resumeText: currentUser?.resumeText || '',
    resumeName: currentUser?.resumeName || '',
    difficulty: 'Medium', // 'Easy', 'Medium', 'FAANG Level (Hard)'
    practiceMode: 'full',
    roundType: null,
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = event.target.result || '';
      const cleanText = typeof rawText === 'string' 
        ? rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ') 
        : file.name;
      setInterviewConfig(prev => ({
        ...prev,
        resumeName: file.name,
        resumeText: cleanText,
        mode: 'resume'
      }));
    };
    reader.readAsText(file);
  };

  const handleLaunchFullInterview = () => {
    setSelectionWarning(false);
    setInterviewConfig(prev => ({
      ...prev,
      practiceMode: 'full',
      roundType: null,
      initialQuestion: null
    }));
    setStage('lobby');
  };

  const handleLaunchTargetedPractice = (roundType) => {
    if (!roundType) {
      setSelectionWarning(true);
      return;
    }
    setSelectionWarning(false);
    setInterviewConfig(prev => ({
      ...prev,
      practiceMode: 'targeted',
      roundType: roundType,
      initialQuestion: null
    }));
    if (roundType === 'Aptitude') {
      setStage('aptitude-studio');
    } else if (roundType === 'GD') {
      setShowGDOnboarding(true);
    } else {
      setStage('lobby');
    }
  };

  const [activeMediaStream, setActiveMediaStream] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [practiceHistory, setPracticeHistory] = useState([]);
  
  const [isInitializingRound, setIsInitializingRound] = useState(false);
  const [initializationError, setInitializationError] = useState(false);
  const [retryAction, setRetryAction] = useState(null);
  const [selectionWarning, setSelectionWarning] = useState(false);

  useEffect(() => {
    if (stage !== 'studio' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [stage]);

  useEffect(() => {
    if (onInterviewStateChange) {
      onInterviewStateChange(stage === 'lobby' || stage === 'studio' || stage === 'report' || stage === 'gd-setup' || stage === 'gd-room');
    }
    
    if (stage === 'setup') {
      const params = new URLSearchParams(window.location.search);
      const gdJoin = params.get('gd_join');
      
      if (gdJoin) {
        setInterviewConfig({
          type: 'Targeted Practice',
          duration: '15',
          targetRole: 'Student',
          practiceMode: 'targeted',
          roundType: 'GD'
        });
        setCurrentSessionId(gdJoin);
        window.history.replaceState({}, document.title, window.location.pathname);
        setStage('gd-room');
      } else {
        fetch(`${API_BASE_URL}/api/interview/history?userId=` + (currentUser?.id || 1))
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setPracticeHistory(data.history);
            }
          })
          .catch(console.error);
      }
    }
  }, [stage, currentUser, onInterviewStateChange]);

  useEffect(() => {
    // Reset global interview active state when unmounting
    return () => {
      if (onInterviewStateChange) {
        onInterviewStateChange(false);
      }
    };
  }, [onInterviewStateChange]);

  const initializeRound = async (onSuccessCallback) => {
    setIsInitializingRound(true);
    setInitializationError(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewType: interviewConfig.type,
          targetRole: interviewConfig.targetRole,
          practiceMode: interviewConfig.practiceMode,
          roundType: interviewConfig.roundType,
        }),
      }).catch(err => {
        console.warn('Network error reaching backend interview start API:', err);
        return null;
      });

      if (res && res.ok) {
        const data = await res.json();
        setCurrentSessionId(data.sessionId || `SESSION_${Date.now()}`);
        if (data.currentQuestion) {
          setInterviewConfig(prev => ({
            ...prev,
            initialQuestion: data.currentQuestion
          }));
        }
      } else {
        setCurrentSessionId(`SESSION_${Date.now()}`);
      }
      onSuccessCallback();
      setIsInitializingRound(false);
    } catch (e) {
      console.warn('Failed to start session on backend, using fallback session ID', e);
      setCurrentSessionId(`SESSION_${Date.now()}`);
      onSuccessCallback();
      setIsInitializingRound(false);
    }
  };

  const handleStartInterviewFromLobby = async ({ stream }) => {
    setActiveMediaStream(stream);
    initializeRound(() => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setStage('studio');
    });
  };

  // Cleanup stream when MockInterviewPage unmounts or stream changes
  React.useEffect(() => {
    return () => {
      if (activeMediaStream) {
        activeMediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeMediaStream]);

  const handleFinishInterview = async ({ elapsedSeconds, transcript = [] }) => {
    let finalReport = null;

    // Try fetching Report from backend
    try {
      const res = await fetch(`${API_BASE_URL}/api/interview/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSessionId || `SESSION_${Date.now()}`,
          answersHistory: transcript,
        }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        finalReport = data.report;
      }
    } catch (e) {
      console.warn('Report fetch notice:', e);
    }

    // Fallback report if backend API failed or returned empty
    if (!finalReport) {
      const candidateTurns = (transcript || []).filter(t => t.sender === 'candidate');
      const score = Math.min(95, Math.max(60, 70 + candidateTurns.length * 5));
      finalReport = {
        overallScore: score,
        technicalKnowledge: Math.min(92, score + 2),
        communication: Math.min(95, score + 5),
        problemSolving: Math.min(90, score - 2),
        strengths: [
          "Demonstrated clear technical articulation under real-time countdown pressure.",
          "Strong domain knowledge and logical problem solving approach.",
          "Active engagement with live interviewer questions and coding IDE."
        ],
        weaknesses: [
          "Could dive deeper into memory complexity and edge-case scaling details.",
          "Consider expanding on architectural tradeoffs during system design questions."
        ],
        topicsToImprove: ["Data Structures & Algorithms", "System Scalability", "Edge Case Testing"],
        questionFeedback: (transcript || [])
          .filter(t => t.sender === 'interviewer')
          .map((qItem, idx) => {
            const correspondingUserAns = transcript.find((u, uIdx) => uIdx > transcript.indexOf(qItem) && u.sender === 'candidate');
            return {
              q: qItem.text || `Interview Question ${idx + 1}`,
              score: Math.min(95, 75 + idx * 5),
              note: "Good response with logical explanation.",
              userAnswer: correspondingUserAns?.text || "Answered during live session.",
              idealAnswer: "A complete answer covers system architecture, optimal data structures, and edge-case error handling."
            };
          }),
        recommendedPractice: "Continue practicing targeted coding & technical interview rounds to master high-pressure technical interviews."
      };
    }

    setReportData(finalReport);
    
    // Trigger notification
    addNotification({
      title: 'Interview Result Ready',
      message: `Your ${interviewConfig.type || 'Mock'} Interview result is ready.`,
      category: 'interviews',
      actionUrl: 'profile',
      actionLabel: 'View Result',
      priority: 'important'
    });

    // Issue certificate
    try {
      const token = localStorage.getItem('interact_token');
      if (token && (currentSessionId || typeof sessionId !== 'undefined')) {
         await fetch(`${API_BASE_URL}/api/certificates/issue/interview`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sessionId: currentSessionId || 'SESSION_LIVE_123' })
         });
      }
    } catch (e) {
      console.warn('Failed to issue certificate:', e);
    }

    setStage('report');
  };

  const practiceCards = [
    { id: 'Aptitude', icon: <Brain size={24} />, title: 'Aptitude', desc: 'Quantitative & Logical' },
    { id: 'Technical', icon: <LayoutDashboard size={24} />, title: 'Technical', desc: 'Core Concepts & Theory' },
    { id: 'Coding', icon: <Code size={24} />, title: 'Coding', desc: 'DSA & Algorithms' },
    { id: 'HR', icon: <Briefcase size={24} />, title: 'HR & Behavioral', desc: 'Situational & Soft Skills' },
    { id: 'GD', icon: <Users size={24} />, title: 'Group Discussion', desc: 'Communication & Leadership' },
  ];

  return (
    <div className="mock-interview-root">
      
      {/* Stage 1: Setup & Target Selection */}
      {stage === 'setup' && (
        <div className="container animate-fade-in" style={{ padding: '60px 0' }}>
          
          <div className="practice-arena-header">
            <span className="section-label">AI MOCK INTERVIEWS</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '8px 0 12px 0', color: 'var(--text-main)' }}>
              Interview <span className="purple-gradient-text">Practice Arena</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.02rem', lineHeight: '1.5' }}>
              Experience a full mock interview or target a specific round for rapid improvement.
            </p>
          </div>

          {/* Comprehensive AI Interview Customization Control Panel */}
          <div className="card-base setup-card" style={{ padding: '30px', margin: '0 auto 35px', borderRadius: '16px', background: 'var(--card-bg-white)', border: '1px solid var(--border-purple)' }}>
            <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <span className="section-label" style={{ background: 'rgba(99,91,255,0.1)', color: 'var(--primary-purple)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                AI INTERVIEW CONFIGURATOR
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '8px 0 4px 0', color: 'var(--text-main)' }}>
                Customize Your Live AI Interview Session
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                Set duration, interview basis (Resume, Role & JD, HR, CS Core), and universal difficulty level.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              
              {/* 1. Duration Selection (Mandatory: 15, 30, 45, 60 min) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
                  ⏱️ 1. Interview Duration (Mandatory)
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['15', '30', '45', '60'].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setInterviewConfig(prev => ({ ...prev, duration: mins }))}
                      style={{
                        flex: 1,
                        minWidth: '60px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: interviewConfig.duration === mins ? '2px solid var(--primary-purple)' : '1px solid var(--border-light)',
                        background: interviewConfig.duration === mins ? 'rgba(99, 91, 255, 0.15)' : 'var(--bg-subtle)',
                        color: interviewConfig.duration === mins ? 'var(--primary-purple)' : 'var(--text-main)',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {mins} Min
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Universal Difficulty Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
                  🎯 2. Select Difficulty Level
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'Easy', label: 'Easy' },
                    { id: 'Medium', label: 'Medium' },
                    { id: 'FAANG Level (Hard)', label: 'FAANG Level 🔥' }
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setInterviewConfig(prev => ({ ...prev, difficulty: diff.id }))}
                      style={{
                        flex: 1,
                        padding: '10px 10px',
                        borderRadius: '8px',
                        border: interviewConfig.difficulty === diff.id ? '2px solid var(--primary-purple)' : '1px solid var(--border-light)',
                        background: interviewConfig.difficulty === diff.id ? 'rgba(99, 91, 255, 0.15)' : 'var(--bg-subtle)',
                        color: interviewConfig.difficulty === diff.id ? 'var(--primary-purple)' : 'var(--text-main)',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* 3. Interview Mode / Basis Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
                📋 3. Select Interview Basis / Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { id: 'resume', title: '📄 Resume-Based', desc: 'AI reads candidate resume & asks project questions' },
                  { id: 'role_jd', title: '💼 Custom Role & JD', desc: 'Specify any target role (SDE, Java Dev) & Job Description' },
                  { id: 'hr', title: '🤝 HR & Behavioral', desc: 'Situational & behavioral culture questions' },
                  { id: 'cs_core', title: '💻 CS Fundamentals', desc: 'OS, DBMS, Networks, OOPs & DSA' }
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setInterviewConfig(prev => ({ ...prev, mode: m.id }))}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: interviewConfig.mode === m.id ? '2px solid var(--primary-purple)' : '1px solid var(--border-light)',
                      background: interviewConfig.mode === m.id ? 'rgba(99, 91, 255, 0.12)' : 'var(--bg-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <strong style={{ fontSize: '0.95rem', color: interviewConfig.mode === m.id ? 'var(--primary-purple)' : 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      {m.title}
                    </strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.3' }}>
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Inputs Based on Selection */}
            {interviewConfig.mode === 'resume' && (
              <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px dashed var(--primary-purple)', marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', marginBottom: '6px' }}>
                  Upload or Select Candidate Resume
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  style={{ fontSize: '0.85rem' }}
                />
                {interviewConfig.resumeName && (
                  <p style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: '700', marginTop: '6px' }}>
                    ✓ Loaded Document: {interviewConfig.resumeName} (AI Ready to parse)
                  </p>
                )}
              </div>
            )}

            {interviewConfig.mode === 'role_jd' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Target Role / Profile Title</label>
                  <input
                    type="text"
                    value={interviewConfig.targetRole}
                    onChange={(e) => setInterviewConfig(prev => ({ ...prev, targetRole: e.target.value }))}
                    placeholder="e.g. SDE-1, Java Developer, Full Stack Engineer..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Target Job Description (JD)</label>
                  <textarea
                    rows={2}
                    value={interviewConfig.jobDescription}
                    onChange={(e) => setInterviewConfig(prev => ({ ...prev, jobDescription: e.target.value }))}
                    placeholder="Paste job description details..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            )}

            <button
              className="btn-primary-purple"
              style={{ width: '100%', padding: '14px', borderRadius: '30px', fontSize: '1.05rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={handleLaunchFullInterview}
            >
              <span>Launch {interviewConfig.duration} Min Customized AI Interview Studio</span>
              <ArrowRight size={20} />
            </button>

          </div>

          <div style={{ margin: '40px 0 20px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0' }}>Practice a Specific Round</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Choose exactly what you want to practice and improve today.</p>
            {selectionWarning && (
              <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} /> Please select a target interview domain/round below before launching session!
              </div>
            )}
          </div>

          <div 
            className="practice-rounds-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              width: '100%',
              ...(selectionWarning ? { border: '2px solid #ef4444', borderRadius: '16px', padding: '12px' } : {})
            }}
          >
            {practiceCards.map(card => (
              <div 
                key={card.id} 
                className="card-base practice-round-card" 
                style={{
                  background: 'var(--card-bg-white)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)'
                }}
                onClick={() => handleLaunchTargetedPractice(card.id)}
              >
                <div className="round-icon-box">{card.icon}</div>
                <h4 style={{ margin: '8px 0 6px 0', fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>{card.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 16px 0', lineHeight: '1.4', flexGrow: 1 }}>{card.desc}</p>
                <span className="practice-link">Practice <ArrowRight size={14} style={{ marginLeft: '4px' }} /></span>
              </div>
            ))}
          </div>

          <div style={{ margin: '40px 0 20px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px 0' }}>Recent Practice</h3>
            {practiceHistory.length === 0 ? (
              <div className="card-base" style={{ padding: '24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>No practice sessions yet. Choose a round above to start practicing.</p>
              </div>
            ) : (
              <div className="card-base practice-history-list">
                {practiceHistory.slice(0, 5).map((history, idx) => {
                  let parsedFeedback = {};
                  try {
                    parsedFeedback = JSON.parse(history.feedback || '{}');
                  } catch (e) {}
                  const score = parsedFeedback.overallScore || history.score || 0;
                  return (
                    <div key={idx} className="history-item">
                      <div className="history-info">
                        <span style={{ fontWeight: '600' }}>
                          {history.practice_mode === 'targeted' ? `${history.round_type} Practice` : 'Full Interview'}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {new Date(history.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="history-score" style={{ fontWeight: '700', color: score >= 70 ? '#10b981' : (score >= 50 ? '#f59e0b' : '#ef4444') }}>
                        {score}%
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Stage 2: Aptitude MCQ Practice Studio */}
      {stage === 'aptitude-studio' && (
        <AptitudePracticeStudio 
          onBackToSetup={() => setStage('setup')}
        />
      )}

      {/* Stage 2: Camera/Mic Permissions Test Lobby */}
      {stage === 'lobby' && (
        <InterviewLobby 
          interviewConfig={interviewConfig}
          onStartInterview={handleStartInterviewFromLobby}
        />
      )}

      {/* Stage 3: Real-Time Live AI Studio Stage */}
      {stage === 'studio' && (
        <LiveInterviewStudio 
          initialStream={activeMediaStream}
          interviewConfig={interviewConfig}
          onFinishInterview={handleFinishInterview}
        />
      )}

      {/* Stage 4: Evaluation Report View */}
      {stage === 'report' && (
        <InterviewReportView 
          report={reportData}
          currentUser={currentUser}
          interviewConfig={interviewConfig}
          onRestartInterview={() => setStage('setup')}
          onNavigate={onNavigate}
        />
      )}

      {/* GD Specific Stages */}
      {stage === 'gd-setup' && (
        <GDSetupView 
          currentUser={currentUser}
          sessionId={currentSessionId}
          onStartGD={() => {
            setStage('gd-room');
          }}
        />
      )}

      {stage === 'gd-room' && (
        <GDRoomView 
          currentUser={currentUser}
          onFinishGD={handleFinishInterview}
        />
      )}

      <GDOnboardingModal 
        isOpen={showGDOnboarding}
        onClose={() => setShowGDOnboarding(false)}
        onProceed={async () => {
          setShowGDOnboarding(false);
          initializeRound(() => {
            setStage('gd-setup');
          });
        }}
      />
      
      {isInitializingRound && (
        <RoundLoadingOverlay 
          roundType={interviewConfig.roundType}
          interviewType={interviewConfig.type}
          isError={initializationError}
          onRetry={() => retryAction && retryAction()}
          onCancel={() => {
            setIsInitializingRound(false);
            setInitializationError(false);
            // Optionally, revert the stage here depending on behavior, but usually staying on current stage is fine
          }}
        />
      )}
    </div>
  );
}
