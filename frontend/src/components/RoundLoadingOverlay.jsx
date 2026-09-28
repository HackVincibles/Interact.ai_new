import React, { useState, useEffect } from 'react';
import { Loader2, Monitor, Code, Users, Brain, Activity, Target } from 'lucide-react';
import './RoundLoadingOverlay.css';

export default function RoundLoadingOverlay({ roundType, interviewType, isError, onRetry, onCancel }) {
  const [msgIndex, setMsgIndex] = useState(0);

  const getMessages = () => {
    if (roundType === 'Coding' || roundType === 'Technical') {
      return [
        'Preparing your assessment...',
        'Loading the coding environment...',
        'Getting your questions ready...',
        'Connecting to AI reviewer...'
      ];
    }
    if (roundType === 'HR' || roundType === 'Behavioral') {
      return [
        'Preparing your interview...',
        'Getting your interview questions ready...',
        'Setting up the AI environment...',
      ];
    }
    if (roundType === 'GD') {
      return [
        'Creating your discussion room...',
        'Preparing the AI moderator...',
        'Getting your GD session ready...',
      ];
    }
    return [
      'Preparing your round...',
      'Setting things up...',
      'Almost ready...'
    ];
  };

  const getIcon = () => {
    if (roundType === 'Coding') return <Code size={48} className="loading-icon-animate" />;
    if (roundType === 'Technical') return <Monitor size={48} className="loading-icon-animate" />;
    if (roundType === 'GD') return <Users size={48} className="loading-icon-animate" />;
    if (roundType === 'HR' || roundType === 'Behavioral') return <Brain size={48} className="loading-icon-animate" />;
    if (roundType === 'Aptitude') return <Target size={48} className="loading-icon-animate" />;
    return <Activity size={48} className="loading-icon-animate" />;
  };

  const messages = getMessages();

  useEffect(() => {
    if (isError) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length, isError]);

  return (
    <div className="round-loading-overlay animate-fade-in">
      <div className="round-loading-content card-base animate-slide-up">
        {isError ? (
          <div className="loading-error-state">
            <div className="error-icon-container">
              <Activity size={48} className="text-red-500" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>We couldn't start your round</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Something went wrong while preparing the session.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn-outline-secondary" onClick={onCancel}>Go Back</button>
              <button className="btn-primary-purple" onClick={onRetry}>Try Again</button>
            </div>
          </div>
        ) : (
          <div className="loading-active-state">
            <div className="loading-icon-wrapper">
              {getIcon()}
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-main)' }}>
              Getting Your Round Ready
            </h2>
            <div className="loading-message-container">
              <p className="loading-message-text animate-fade-in" key={msgIndex}>
                {messages[msgIndex]}
              </p>
            </div>
            <div className="loading-progress-bar">
              <div className="loading-progress-fill"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
