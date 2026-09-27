import React, { useState } from 'react';
import InterviewLobby from '../components/InterviewLobby';
import LiveInterviewStudio from '../components/LiveInterviewStudio';
import InterviewReportView from '../components/InterviewReportView';
import { Award, ShieldCheck, Sparkles, Video, Play, ArrowRight } from 'lucide-react';
import './MockInterviewPage.css';

export default function MockInterviewPage({ currentUser, onNavigate }) {
  const [stage, setStage] = useState('setup'); // 'setup', 'lobby', 'studio', 'report'
  const [interviewConfig, setInterviewConfig] = useState({
    type: 'Technical SDE-1',
    duration: '30',
    targetRole: 'Software Development Engineer',
  });

  const [activeMediaStream, setActiveMediaStream] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const handleLaunchLobby = (cfg) => {
    setInterviewConfig((prev) => ({ ...prev, ...cfg }));
    setStage('lobby');
  };

  const handleStartInterviewFromLobby = async ({ stream }) => {
    setActiveMediaStream(stream);
    try {
      const res = await fetch('http://localhost:5000/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewType: interviewConfig.type,
          targetRole: interviewConfig.targetRole,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentSessionId(data.sessionId);
      }
    } catch (e) {
      console.warn('Failed to start interview on backend', e);
    }
    setStage('studio');
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
    setStage('report');
  };

  return (
    <div className="mock-interview-root">
      
      {/* Stage 1: Setup & Target Selection */}
      {stage === 'setup' && (
        <div className="container animate-fade-in" style={{ padding: '60px 0' }}>
          <div className="card-base setup-card" style={{ padding: '40px', maxWidth: '780px', margin: '0 auto' }}>
            <span className="section-label">REAL AI INTERVIEW SIMULATOR</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '8px 0 12px 0', color: 'var(--text-main)' }}>
              Configure Your <span className="purple-gradient-text">Live AI Interview</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.02rem', lineHeight: '1.5' }}>
              Test your technical knowledge, system design, and communication with our real-time video/audio AI Interviewer powered by Gemini & LangGraph.
            </p>

            <div className="config-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.9rem' }}>Interview Category</label>
                <select 
                  className="modal-input-field"
                  value={interviewConfig.type}
                  onChange={(e) => setInterviewConfig({ ...interviewConfig, type: e.target.value })}
                >
                  <option value="Technical SDE-1">Technical SDE-1 & Data Structures</option>
                  <option value="Web & System Architecture">Web & System Architecture</option>
                  <option value="HR & Behavioral">HR & Behavioral Interview</option>
                  <option value="Resume-Based Deep-Dive">Resume-Based Deep-Dive</option>
                  <option value="Government ISRO / DRDO Tech">Government ISRO / DRDO Tech</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.9rem' }}>Duration</label>
                <select 
                  className="modal-input-field"
                  value={interviewConfig.duration}
                  onChange={(e) => setInterviewConfig({ ...interviewConfig, duration: e.target.value })}
                >
                  <option value="15">15 Minutes (Quick Drill)</option>
                  <option value="30">30 Minutes (Standard Interview)</option>
                  <option value="45">45 Minutes (Full Technical + HR)</option>
                </select>
              </div>
            </div>

            <button 
              className="btn-primary-purple"
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}
              onClick={() => handleLaunchLobby(interviewConfig)}
            >
              <span>Proceed to Permissions & Camera Test Lobby</span>
              <ArrowRight size={18} />
            </button>
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

      {/* Stage 4: 50-Parameter Evaluation Report View */}
      {stage === 'report' && (
        <InterviewReportView 
          report={reportData}
          currentUser={currentUser}
          interviewConfig={interviewConfig}
          onRestartInterview={() => setStage('setup')}
          onNavigate={onNavigate}
        />
      )}

    </div>
  );
}
