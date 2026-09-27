import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Monitor, ShieldCheck, ArrowRight, Video, AlertCircle, CheckCircle2, Wifi, Compass } from 'lucide-react';
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

  return (
    <div className="interview-lobby-root animate-fade-in">
      <div className="container lobby-container">
        
        <div className="lobby-header card-base">
          <span className="section-label">AI INTERVIEW SETUP & PERMISSIONS LOBBY</span>
          <h1 className="lobby-title">
            Preparing Your <span className="purple-gradient-text">{interviewConfig?.type || 'Technical SDE-1'}</span> Interview
          </h1>
          <p className="lobby-sub">
            Please test your camera, microphone, screen share, and system compatibility before launching the AI Interview Studio.
          </p>
        </div>

        <div className="lobby-grid-layout">
          
          {/* Left: Camera & Video Preview Window */}
          <div className="lobby-left-col card-base">
            <h3 className="preview-heading">Candidate Camera & Audio Preview</h3>
            
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
                  <p>Camera feed disabled</p>
                  <button className="btn-primary-purple test-btn" onClick={requestMediaPermissions}>
                    Enable Camera & Mic
                  </button>
                </div>
              )}
            </div>

            <div className="device-status-row">
              <div className={`status-badge ${permissions.camera ? 'ok' : 'pending'}`}>
                {permissions.camera ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>Camera: {permissions.camera ? 'Ready' : 'Not Connected'}</span>
              </div>

              <div className={`status-badge ${permissions.mic ? 'ok' : 'pending'}`}>
                {permissions.mic ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>Microphone: {permissions.mic ? 'Ready' : 'Not Connected'}</span>
              </div>
            </div>
          </div>

          {/* Right: Permissions Checklist & Start Control */}
          <div className="lobby-right-col card-base">
            <h3 className="checklist-heading">Pre-Interview Checklist</h3>

            <div className="permissions-list">
              <div className="perm-item">
                <div className="perm-info">
                  <Camera size={20} className="perm-icon purple" />
                  <div>
                    <strong>Camera Permission</strong>
                    <p>Required for AI facial engagement monitoring</p>
                  </div>
                </div>
                <button className={`perm-check-btn ${permissions.camera ? 'active' : ''}`} onClick={requestMediaPermissions}>
                  {permissions.camera ? '✓ Granted' : 'Allow'}
                </button>
              </div>

              <div className="perm-item">
                <div className="perm-info">
                  <Mic size={20} className="perm-icon blue" />
                  <div>
                    <strong>Microphone Permission</strong>
                    <p>Required to speak your verbal answers naturally</p>
                  </div>
                </div>
                <button className={`perm-check-btn ${permissions.mic ? 'active' : ''}`} onClick={requestMediaPermissions}>
                  {permissions.mic ? '✓ Granted' : 'Allow'}
                </button>
              </div>
              
              <div className="perm-item">
                <div className="perm-info">
                  <Wifi size={20} className="perm-icon green" />
                  <div>
                    <strong>Network Latency</strong>
                    <p>Check if connection is stable for live video</p>
                  </div>
                </div>
                <button 
                  className={`perm-check-btn ${systemChecks.network === 'ok' ? 'active' : ''}`} 
                  onClick={checkNetworkLatency}
                  disabled={systemChecks.network === 'loading'}
                >
                  {systemChecks.network === 'loading' ? 'Testing...' : (systemChecks.network === 'ok' ? '✓ Stable' : 'Test Network')}
                </button>
              </div>

              <div className="perm-item">
                <div className="perm-info">
                  <Compass size={20} className="perm-icon orange" />
                  <div>
                    <strong>Browser Compatibility</strong>
                    <p>Verify browser supports WebRTC & APIs</p>
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
                  <Monitor size={20} className="perm-icon orange" />
                  <div>
                    <strong>Screen Sharing (Optional)</strong>
                    <p>Required for live IDE code execution</p>
                  </div>
                </div>
                <button className={`perm-check-btn ${permissions.screen ? 'active' : ''}`} onClick={requestScreenSharePermission}>
                  {permissions.screen ? '✓ Granted' : 'Allow'}
                </button>
              </div>
            </div>

            <div className="consent-checkbox-group">
              <input 
                type="checkbox" 
                id="lobby-consent"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
              />
              <label htmlFor="lobby-consent">
                I agree to let Interact.ai process my interview audio & transcript to generate a 50-parameter candidate performance report.
              </label>
            </div>

            <button 
              className="btn-primary-purple launch-studio-btn"
              disabled={!canStart}
              onClick={() => onStartInterview({ stream: streamRef.current, permissions })}
            >
              <span>Launch AI Interview Studio</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
