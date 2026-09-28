import React, { useState } from 'react';
import { Users, Copy, Share2, Play, CheckCircle2 } from 'lucide-react';

export default function GDSetupView({ currentUser, sessionId, onStartGD }) {
  const [feedback, setFeedback] = useState('');
  const gdCode = sessionId || 'GD-PENDING';
  const inviteUrl = `${window.location.origin}/mock-interviews?gd_join=${gdCode}`;

  const fallbackCopy = (text, type) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setFeedback(`${type} copied!`);
    } catch (e) {
      setFeedback('Failed to copy');
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleCopyCode = async () => {
    if (!sessionId) {
      setFeedback('Generating session...');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }
    try {
      await navigator.clipboard.writeText(gdCode);
      setFeedback('Code copied!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (e) {
      fallbackCopy(gdCode, 'Code');
    }
  };

  const handleShareInvite = async () => {
    if (!sessionId) {
      setFeedback('Generating session...');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }
    
    const textToShare = `Join my Group Discussion on InteractAI\nJoin Code: ${gdCode}\nJoin Link: ${inviteUrl}`;
    
    const shareData = {
      title: 'Join my Group Discussion on InteractAI',
      text: `Join my Group Discussion!\nJoin Code: ${gdCode}\n`,
      url: inviteUrl
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setFeedback('Share sheet opened.');
      } else {
        await navigator.clipboard.writeText(textToShare);
        setFeedback('Invite link copied!');
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        fallbackCopy(textToShare, 'Invite link');
      }
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 0', maxWidth: '800px', margin: '0 auto' }}>
      <div className="card-base" style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-label">GROUP DISCUSSION</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '8px 0', color: 'var(--text-main)' }}>
            <span className="purple-gradient-text">Practice Setup</span>
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-subtle)', borderRadius: '12px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px', color: 'var(--text-muted)' }}>Duration</h4>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>10 minutes</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h4 style={{ margin: '0 0 4px', color: 'var(--text-muted)' }}>Topic</h4>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>Will be generated when the GD starts</p>
            </div>
          </div>

          <div style={{ padding: '24px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} className="text-primary" /> Participants
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>You + Friends</p>
              {feedback && (
                <span style={{ color: 'var(--primary-color)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', animation: 'fadeIn 0.2s' }}>
                  <CheckCircle2 size={16} /> {feedback}
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
              <div style={{ flex: 1 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>GD Code</span>
                <strong style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>{gdCode}</strong>
              </div>
              <button className="btn-secondary" onClick={handleCopyCode} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Copy size={16} /> Copy Code
              </button>
              <button className="btn-secondary" onClick={handleShareInvite} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={16} /> Share Invite
              </button>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>Participants waiting...</h4>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600' }}>
                  {currentUser?.fullName?.charAt(0) || 'U'}
                </div>
                <span style={{ fontWeight: '500' }}>{currentUser?.fullName || 'You'} (Host)</span>
              </div>
            </div>
          </div>

          <button 
            className="btn-primary-purple" 
            style={{ padding: '16px', fontSize: '1.1rem', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={onStartGD}
          >
            <Play size={20} /> Start Group Discussion
          </button>
        </div>
      </div>
    </div>
  );
}
