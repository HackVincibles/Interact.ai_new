import React, { useState, useEffect } from 'react';
import InterviewLobby from '../components/InterviewLobby';
import LiveInterviewStudio from '../components/LiveInterviewStudio';
import InterviewReportView from '../components/InterviewReportView';
import GDSetupView from '../components/GDSetupView';
import GDRoomView from '../components/GDRoomView';
import GDOnboardingModal from '../components/GDOnboardingModal';
import RoundLoadingOverlay from '../components/RoundLoadingOverlay';
import { Award, ShieldCheck, Sparkles, Video, Play, ArrowRight, Brain, Code, Briefcase, Users, LayoutDashboard } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import './MockInterviewPage.css';

export default function MockInterviewPage({ currentUser, onNavigate, onInterviewStateChange }) {
  const [stage, setStage] = useState('setup'); // 'setup', 'lobby', 'studio', 'report', 'gd-setup', 'gd-room'
  const [showGDOnboarding, setShowGDOnboarding] = useState(false);
  const { addNotification } = useNotifications();
  const [interviewConfig, setInterviewConfig] = useState({
    type: 'Technical SDE-1',
    duration: '30',
    targetRole: 'Software Development Engineer',
    practiceMode: 'full', // 'full' or 'targeted'
    roundType: null, // 'Aptitude', 'Technical', 'Coding', 'HR', 'GD'
  });

  const [activeMediaStream, setActiveMediaStream] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [practiceHistory, setPracticeHistory] = useState([]);
  
  const [isInitializingRound, setIsInitializingRound] = useState(false);
  const [initializationError, setInitializationError] = useState(false);
  const [retryAction, setRetryAction] = useState(null);

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
        fetch('http://localhost:5000/api/interview/history?userId=' + (currentUser?.id || 1))
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

  const handleLaunchFullInterview = () => {
    setInterviewConfig({
      type: 'Technical SDE-1',
      duration: '30',
      targetRole: 'Software Development Engineer',
      practiceMode: 'full',
      roundType: null
    });
    setStage('lobby');
  };

  const handleLaunchTargetedPractice = (roundType) => {
    setInterviewConfig({
      type: 'Targeted Practice',
      duration: '15',
      targetRole: 'Student',
      practiceMode: 'targeted',
      roundType: roundType
    });
    if (roundType === 'GD') {
      setShowGDOnboarding(true);
    } else {
      setStage('lobby');
    }
  };

  const initializeRound = async (onSuccessCallback) => {
    setIsInitializingRound(true);
    setInitializationError(false);
    try {
      const res = await fetch('http://localhost:5000/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewType: interviewConfig.type,
          targetRole: interviewConfig.targetRole,
          practiceMode: interviewConfig.practiceMode,
          roundType: interviewConfig.roundType,
        }),
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setCurrentSessionId(data.sessionId);
      onSuccessCallback();
      setIsInitializingRound(false);
    } catch (e) {
      console.warn('Failed to start session on backend', e);
      setInitializationError(true);
      setRetryAction(() => () => initializeRound(onSuccessCallback));
    }
  };

  const handleStartInterviewFromLobby = async ({ stream }) => {
    setActiveMediaStream(stream);
    initializeRound(() => {
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

  const handleFinishInterview = async ({ elapsedSeconds, transcript }) => {
    // Generate Report
    try {
      const res = await fetch('http://localhost:5000/api/interview/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSessionId || 'SESSION_LIVE_123',
          answersHistory: transcript,
        }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        setReportData(data.report);
      }
    } catch (e) {
      console.warn('Report fetch notice:', e);
    }
    
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
         await fetch('http://localhost:5000/api/certificates/issue/interview', {
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

          <div className="card-base setup-card full-interview-card" style={{ padding: '30px', margin: '0 auto 30px', cursor: 'pointer' }} onClick={handleLaunchFullInterview}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 8px 0' }}>Complete Mock Interview</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Experience a complete, end-to-end interview process across all areas.</p>
              </div>
              <button className="btn-primary-purple" style={{ padding: '12px 24px', borderRadius: '30px' }}>
                Start Full Interview
              </button>
            </div>
          </div>

          <div style={{ margin: '40px 0 20px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0' }}>Practice a Specific Round</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Choose exactly what you want to practice and improve today.</p>
          </div>

          <div className="practice-rounds-grid">
            {practiceCards.map(card => (
              <div 
                key={card.id} 
                className="card-base practice-round-card" 
                onClick={() => handleLaunchTargetedPractice(card.id)}
              >
                <div className="round-icon-box">{card.icon}</div>
                <h4 style={{ margin: '16px 0 4px 0', fontSize: '1.1rem' }}>{card.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 16px 0' }}>{card.desc}</p>
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
