import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Monitor, ShieldCheck, ArrowRight, Video, AlertCircle, CheckCircle2, Wifi, Compass, Calendar } from 'lucide-react';
import ScheduleModal from './scheduling/ScheduleModal';
import './InterviewLobby.css';

export default function InterviewLobby({ onStartInterview, interviewConfig }) {
  const [permissions, setPermissions] = useState({
    camera: false,
    mic: false,
    screen: false,
  });
  
  const [systemChecks, setSystemChecks] = useState({
    network: null, // null, 'loading', 'ok', 'error'
    browser: null, // null, 'loading', 'ok', 'error'
  });
  
  const [isTestingStream, setIsTestingStream] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const videoPreviewRef = useRef(null);
  const streamRef = useRef(null);

  const requestMediaPermissions = async () => {
    try {
      setIsTestingStream(true);
      // Stop old tracks if any exist
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        // Attempt to play explicitly in case autoplay is blocked
        videoPreviewRef.current.play().catch(e => console.warn('Preview play blocked:', e));
      }
      
      setPermissions((prev) => ({ ...prev, camera: true, mic: true }));
    } catch (err) {
      console.warn('Camera/Mic permission error:', err);
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        alert('No camera or microphone found on this device.');
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert('Camera or Microphone access was denied. Please allow permissions in your browser settings and try again.');
      } else {
        alert('An error occurred while accessing media devices: ' + err.message);
      }
      setPermissions((prev) => ({ ...prev, camera: false, mic: false }));
    } finally {
      setIsTestingStream(false);
    }
  };

  const requestScreenSharePermission = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setPermissions((prev) => ({ ...prev, screen: true }));
      // Stop temporary screen test track
      screenStream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn('Screen share permission notice:', err.message);
    }
  };

  const checkNetworkLatency = async () => {
    setSystemChecks(prev => ({ ...prev, network: 'loading' }));
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate ping
      const isOnline = navigator.onLine;
      setSystemChecks(prev => ({ ...prev, network: isOnline ? 'ok' : 'error' }));
    } catch (e) {
      setSystemChecks(prev => ({ ...prev, network: 'error' }));
    }
  };

  const checkBrowserCompatibility = async () => {
    setSystemChecks(prev => ({ ...prev, browser: 'loading' }));
    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate check
      const isCompatible = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setSystemChecks(prev => ({ ...prev, browser: isCompatible ? 'ok' : 'error' }));
    } catch (e) {
      setSystemChecks(prev => ({ ...prev, browser: 'error' }));
    }
  };

  useEffect(() => {
    // We intentionally don't stop the stream on unmount here
    // because it needs to be passed to the LiveInterviewStudio component.
    return () => {};
  }, []);

  const canStart = permissions.camera && permissions.mic && consentChecked && systemChecks.network === 'ok' && systemChecks.browser === 'ok';

  const isAptitude = interviewConfig?.roundType === 'Aptitude';

  if (isAptitude) {
    return (
      <div className="interview-lobby-root animate-fade-in">
        <div className="container lobby-container" style={{ maxWidth: '600px', margin: '100px auto' }}>
          <div className="lobby-header card-base" style={{ textAlign: 'center', padding: '40px' }}>
            <span className="section-label">APTITUDE ASSESSMENT</span>
            <h1 className="lobby-title" style={{ margin: '16px 0' }}>
              Ready for your <span className="purple-gradient-text">Aptitude</span> Test?
            </h1>
            <p className="lobby-sub" style={{ fontSize: '1.1rem', marginBottom: '32px' }}>
              This assessment consists of quantitative and logical reasoning questions.
              No camera or microphone is required for this round.
            </p>
            <div>
              <button 
                className="btn-primary-purple" 
                style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '30px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onClick={() => onStartInterview({ stream: null })}
              >
                Start Aptitude Test <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </button>
              
              <button 
                className="btn-secondary" 
                style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '30px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px' }}
                onClick={() => setIsScheduleOpen(true)}
              >
                <Calendar size={20} style={{ marginRight: '8px' }} /> Schedule for Later
              </button>
            </div>
            
            <ScheduleModal 
              isOpen={isScheduleOpen}
              onClose={() => setIsScheduleOpen(false)}
              config={{
                type: 'Aptitude Test',
                duration: 45
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-lobby-root animate-fade-in">
      <div className="container lobby-container">
        
        {/* Top Header Bar with Navigation & Title */}
        <div className="lobby-header-bar card-base">
          <div className="header-titles">
            <span className="section-label">AI INTERVIEW LOBBY</span>
            <h1 className="lobby-title">
              {interviewConfig?.type || 'Technical SDE-1'} Interview Session
            </h1>
            <p className="lobby-sub">
              Target Role: <strong>{interviewConfig?.targetRole || 'Software Development Engineer'}</strong> • Duration: <strong>{interviewConfig?.duration || '30'} Mins</strong>
            </p>
          </div>
          <div className="header-badges">
            <span className="session-id-pill">Session: {interviewConfig?.roundType || 'Live'}</span>
          </div>
        </div>

        {/* Main 2-Column Grid Layout (Project 1 Structure) */}
        <div className="lobby-grid-layout">
          
          {/* LEFT COLUMN: Candidate Profile & System Checks */}
          <div className="lobby-left-col space-y-4">
            
            {/* Card 1: Camera Feed & Media Preview */}
            <div className="card-base lobby-card">
              <div className="card-header-flex">
                <h3 className="preview-heading">Candidate Hardware & Media Test</h3>
                <span className="live-status-dot">Live Preview</span>
              </div>

              <div className="video-preview-frame">
                <video 
                  ref={videoPreviewRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="video-element"
                />
                {!permissions.camera && (
                  <div className="video-placeholder-overlay">
                    <Video size={42} className="placeholder-icon" />
                    <p>Camera & Microphone test required</p>
                    <button className="btn-primary-purple test-btn" onClick={requestMediaPermissions}>
                      Enable Camera & Mic
                    </button>
                  </div>
                )}
              </div>

              {/* Status Badges Row */}
              <div className="device-status-row">
                <div className={`status-badge ${permissions.camera ? 'ok' : 'pending'}`}>
                  {permissions.camera ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>Camera: {permissions.camera ? 'Ready' : 'Not Connected'}</span>
                </div>

                <div className={`status-badge ${permissions.mic ? 'ok' : 'pending'}`}>
                  {permissions.mic ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>Microphone: {permissions.mic ? 'Ready' : 'Not Connected'}</span>
                </div>

                <div className={`status-badge ${systemChecks.network === 'ok' ? 'ok' : 'pending'}`}>
                  {systemChecks.network === 'ok' ? <CheckCircle2 size={15} /> : <Wifi size={15} />}
                  <span>Network: {systemChecks.network === 'ok' ? 'Stable' : 'Check Ping'}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Interactive System Checks & Permissions List */}
            <div className="card-base lobby-card">
              <h3 className="checklist-heading">System Verification Checks</h3>

              <div className="permissions-list">
                <div className="perm-item">
                  <div className="perm-info">
                    <Camera size={18} className="perm-icon purple" />
                    <div>
                      <strong>Webcam Stream</strong>
                      <p>Facial engagement and visual feedback</p>
                    </div>
                  </div>
                  <button className={`perm-check-btn ${permissions.camera ? 'active' : ''}`} onClick={requestMediaPermissions}>
                    {permissions.camera ? '✓ Granted' : 'Allow'}
                  </button>
                </div>

                <div className="perm-item">
                  <div className="perm-info">
                    <Mic size={18} className="perm-icon blue" />
                    <div>
                      <strong>Microphone Stream</strong>
                      <p>Voice answer capture and speech recognition</p>
                    </div>
                  </div>
                  <button className={`perm-check-btn ${permissions.mic ? 'active' : ''}`} onClick={requestMediaPermissions}>
                    {permissions.mic ? '✓ Granted' : 'Allow'}
                  </button>
                </div>
                
                <div className="perm-item">
                  <div className="perm-info">
                    <Wifi size={18} className="perm-icon green" />
                    <div>
                      <strong>Network Latency</strong>
                      <p>Real-time audio/video stream connectivity</p>
                    </div>
                  </div>
                  <button 
                    className={`perm-check-btn ${systemChecks.network === 'ok' ? 'active' : ''}`} 
                    onClick={checkNetworkLatency}
                    disabled={systemChecks.network === 'loading'}
                  >
                    {systemChecks.network === 'loading' ? 'Testing...' : (systemChecks.network === 'ok' ? '✓ Stable' : 'Test Ping')}
                  </button>
                </div>

                <div className="perm-item">
                  <div className="perm-info">
                    <Compass size={18} className="perm-icon orange" />
                    <div>
                      <strong>Browser WebRTC Support</strong>
                      <p>Verify browser compatibility with AI engine</p>
                    </div>
                  </div>
                  <button 
                    className={`perm-check-btn ${systemChecks.browser === 'ok' ? 'active' : ''}`} 
                    onClick={checkBrowserCompatibility}
                    disabled={systemChecks.browser === 'loading'}
                  >
                    {systemChecks.browser === 'loading' ? 'Checking...' : (systemChecks.browser === 'ok' ? '✓ Verified' : 'Check Browser')}
                  </button>
                </div>

                <div className="perm-item">
                  <div className="perm-info">
                    <Monitor size={18} className="perm-icon orange" />
                    <div>
                      <strong>Screen Share (Optional)</strong>
                      <p>Used during live IDE coding verification</p>
                    </div>
                  </div>
                  <button className={`perm-check-btn ${permissions.screen ? 'active' : ''}`} onClick={requestScreenSharePermission}>
                    {permissions.screen ? '✓ Granted' : 'Allow'}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Round Information, Guidelines & Launch Actions */}
          <div className="lobby-right-col space-y-4">
            
            {/* Card 1: Active Round Overview */}
            <div className="card-base lobby-card">
              <h3 className="checklist-heading">Session Overview & Guidelines</h3>
              <div className="round-details-box">
                <div className="detail-row">
                  <span className="detail-label">Interview Mode:</span>
                  <span className="detail-value">{interviewConfig?.mode || 'Custom Role & JD'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Target Domain:</span>
                  <span className="detail-value">{interviewConfig?.roundType || 'Technical SDE'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Difficulty Level:</span>
                  <span className="detail-value highlight">{interviewConfig?.difficulty || 'Medium'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Session Duration:</span>
                  <span className="detail-value">{interviewConfig?.duration || '30'} Minutes</span>
                </div>
              </div>

              <div className="guidelines-list">
                <div className="guideline-item">
                  <ShieldCheck size={16} className="guide-icon" />
                  <span>Stay in full-screen mode to prevent tab switch warnings.</span>
                </div>
                <div className="guideline-item">
                  <ShieldCheck size={16} className="guide-icon" />
                  <span>Speak clearly into your microphone after AI finishes asking.</span>
                </div>
              </div>
            </div>

            {/* Card 2: Consent Checkbox & Action Dock */}
            <div className="card-base lobby-card">
              <div className="consent-checkbox-group">
                <input 
                  type="checkbox" 
                  id="lobby-consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                />
                <label htmlFor="lobby-consent">
                  I agree to allow Interact.ai to process my microphone audio & camera feed to generate real-time feedback and evaluation report.
                </label>
              </div>

              <div className="action-dock">
                <button 
                  className="btn-primary-purple launch-studio-btn"
                  disabled={!canStart}
                  onClick={() => onStartInterview({ stream: streamRef.current, permissions })}
                >
                  <span>Launch AI Interview Studio</span>
                  <ArrowRight size={18} />
                </button>
                
                <button 
                  className="btn-secondary schedule-later-btn"
                  onClick={() => setIsScheduleOpen(true)}
                >
                  <Calendar size={18} />
                  <span>Schedule for Later</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      <ScheduleModal 
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        config={{
          type: interviewConfig?.type || 'Technical Interview',
          duration: 30
        }}
      />
    </div>
  );
}

