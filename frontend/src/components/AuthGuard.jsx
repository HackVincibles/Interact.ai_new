import React from 'react';
import { Lock, Sparkles, UserCheck, ArrowRight, ShieldAlert } from 'lucide-react';
import './AuthGuard.css';

export default function AuthGuard({ featureTitle = 'Protected Feature', onNavigate }) {
  return (
    <section className="container auth-guard-section animate-fade-in">
      <div className="auth-guard-card card-base">
        <div className="guard-icon-wrapper">
          <ShieldAlert size={36} className="guard-icon" />
        </div>

        <span className="section-label">AUTHENTICATION REQUIRED</span>

        <h2 className="guard-title">
          Sign in to access {featureTitle}
        </h2>

        <p className="guard-subtitle">
          No candidate profile logged in. You must register or log in to start real AI Mock Interviews, build ATS resumes, and access personalized career data.
        </p>

        <div className="guard-actions-row">
          <button className="btn-primary-purple guard-btn" onClick={() => onNavigate('register')}>
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </button>

          <button className="btn-outline-secondary guard-btn" onClick={() => onNavigate('login')}>
            <span>Sign In to Account</span>
          </button>
        </div>

        <div className="guard-footer-note">
          <Sparkles size={14} style={{ color: 'var(--primary-purple)', display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
          Interact.ai candidate profiles are 100% free with instant registration.
        </div>
      </div>
    </section>
  );
}
