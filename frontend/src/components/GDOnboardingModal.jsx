import React from 'react';
import { Bot, Mic, MessageSquare, Clock, CheckCircle2, ShieldAlert, ArrowRight, UserCheck, MessageCircle, AlertCircle, X, Users, Lightbulb, Handshake, Target, BarChart } from 'lucide-react';
import './GDOnboardingModal.css';

export default function GDOnboardingModal({ isOpen, onClose, onProceed }) {
  if (!isOpen) return null;

  return (
    <div className="gd-onboarding-overlay animate-fade-in">
      <div className="gd-onboarding-backdrop" onClick={onClose} />
      
      <div className="gd-onboarding-card card-base animate-slide-up">
        
        {/* Header */}
        <div className="gd-onboarding-header">
          <h1 className="gd-onboarding-title">How <span className="purple-gradient-text">Group Discussion</span> Works</h1>
          <p className="gd-onboarding-subtitle">Understand the flow and rules before you begin.</p>
        </div>

        {/* Visual Flow */}
        <div className="gd-flow-container">
          <div className="gd-flow-line"></div>
          
          <div className="gd-flow-step">
            <div className="gd-flow-icon"><UserCheck size={24} /></div>
            <h4 className="gd-flow-step-title">1. Introductions</h4>
            <p className="gd-flow-step-desc">Everyone introduces themselves briefly.</p>
          </div>
          
          <div className="gd-flow-step">
            <div className="gd-flow-icon"><MessageSquare size={24} /></div>
            <h4 className="gd-flow-step-title">2. Get the Topic</h4>
            <p className="gd-flow-step-desc">AI moderator provides the discussion topic.</p>
          </div>
          
          <div className="gd-flow-step">
            <div className="gd-flow-icon"><MessageCircle size={24} /></div>
            <h4 className="gd-flow-step-title">3. Discuss Naturally</h4>
            <p className="gd-flow-step-desc">Share ideas and respond to others.</p>
          </div>

          <div className="gd-flow-step">
            <div className="gd-flow-icon" style={{ background: '#444' }}><Bot size={24} /></div>
            <h4 className="gd-flow-step-title">4. AI Stays Quiet</h4>
            <p className="gd-flow-step-desc">Moderator will not interrupt every turn.</p>
          </div>
          
          <div className="gd-flow-step">
            <div className="gd-flow-icon"><CheckCircle2 size={24} /></div>
            <h4 className="gd-flow-step-title">5. Conclusion</h4>
            <p className="gd-flow-step-desc">A random active participant concludes.</p>
          </div>

          <div className="gd-flow-step">
            <div className="gd-flow-icon" style={{ background: '#10b981' }}><BarChart size={24} /></div>
            <h4 className="gd-flow-step-title">6. Feedback</h4>
            <p className="gd-flow-step-desc">Get your individual AI evaluation.</p>
          </div>
        </div>

        {/* Moderator Callout */}
        <div className="gd-moderator-callout">
          <div className="gd-moderator-icon">
            <Bot size={28} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>Meet Your AI Moderator</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>
              Your AI moderator starts the GD, manages the flow, gives the topic, and steps in only when needed. 
              <strong> During the main discussion, the moderator stays mostly silent </strong> 
              so the conversation feels like a real Group Discussion.
            </p>
          </div>
        </div>

        {/* Rules Section */}
        <div className="gd-rules-section">
          <h3 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <ShieldAlert size={20} className="text-primary" /> GD Rules
          </h3>
          <div className="gd-rules-grid">
            <div className="gd-rule-item">
              <span style={{ fontSize: '1.2rem' }}>🗣️</span>
              <span className="gd-rule-text">Speak clearly and contribute to the discussion.</span>
            </div>
            <div className="gd-rule-item">
              <span style={{ fontSize: '1.2rem' }}>👥</span>
              <span className="gd-rule-text">Listen to other participants and respond naturally.</span>
            </div>
            <div className="gd-rule-item">
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <span className="gd-rule-text">Stay relevant to the given topic.</span>
            </div>
            <div className="gd-rule-item">
              <span style={{ fontSize: '1.2rem' }}>🤝</span>
              <span className="gd-rule-text">Disagree respectfully; do not attack other participants.</span>
            </div>
            <div className="gd-rule-item">
              <span style={{ fontSize: '1.2rem' }}>🔄</span>
              <span className="gd-rule-text">Avoid dominating the entire discussion.</span>
            </div>
            <div className="gd-rule-item">
              <span style={{ fontSize: '1.2rem' }}>🚫</span>
              <span className="gd-rule-text">Do not expect the AI moderator to call on every participant.</span>
            </div>
            <div className="gd-rule-item">
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
              <span className="gd-rule-text">There is <strong>ONE AI moderator</strong> for the GD.</span>
            </div>
            <div className="gd-rule-item">
              <span style={{ fontSize: '1.2rem' }}>⏳</span>
              <span className="gd-rule-text">The discussion has a limited duration.</span>
            </div>
            <div className="gd-rule-item">
              <span style={{ fontSize: '1.2rem' }}>🎯</span>
              <span className="gd-rule-text">The moderator may intervene only when necessary (inactivity, off-topic, time).</span>
            </div>
            <div className="gd-rule-item">
              <span style={{ fontSize: '1.2rem' }}>🏁</span>
              <span className="gd-rule-text">One participant may be randomly selected for the final conclusion.</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="gd-onboarding-actions">
          <button 
            className="btn-outline-secondary" 
            onClick={onClose}
            style={{ padding: '12px 24px', borderRadius: '30px' }}
          >
            Maybe Later
          </button>
          <button 
            className="btn-primary-purple" 
            onClick={onProceed}
            style={{ padding: '12px 24px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            Got it, Let's Begin <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
