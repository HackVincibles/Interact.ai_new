import React from 'react';
import { ArrowRight, Play, CheckCircle2, Award, BookOpen, Briefcase, TrendingUp, Sparkles } from 'lucide-react';
import LiveOrb from './LiveOrb';
import './Hero.css';

export default function Hero({ onGetStarted, onWatchDemo }) {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        {/* Left Column: Copy & CTAs */}
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>AI-Powered Career Guidance for Students</span>
          </div>

          <h1 className="hero-title">
            Your Journey From <br />
            <span className="gradient-text">Campus to Corporate</span>
          </h1>

          <p className="hero-subtitle">
            Discover career paths, learn in-demand skills, practice with AI-powered mock interviews, find top internships & jobs — all in one place.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary hero-btn-main" onClick={onGetStarted}>
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>
            <button className="btn-secondary hero-btn-demo" onClick={onWatchDemo}>
              <div className="play-icon-circle">
                <Play size={12} fill="#635bff" color="#635bff" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Value proposition badges */}
          <div className="hero-benefits-row">
            <div className="benefit-item">
              <CheckCircle2 size={16} className="benefit-icon" />
              <span>Curated content</span>
            </div>
            <div className="benefit-item">
              <CheckCircle2 size={16} className="benefit-icon" />
              <span>For students & freshers</span>
            </div>
            <div className="benefit-item">
              <CheckCircle2 size={16} className="benefit-icon" />
              <span>Updated regularly</span>
            </div>
          </div>

          {/* Social Proof Bar */}
          <div className="hero-social-proof">
            <div className="avatar-stack">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Student" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" alt="Student" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" alt="Student" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120" alt="Student" />
            </div>
            <div className="proof-text">
              <p className="proof-title">Trusted by <strong>10,000+</strong> students</p>
              <p className="proof-sub">from 200+ colleges across India</p>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Illustration Graphic & Dynamic Floating Pills */}
        <div className="hero-visual">
          <div className="visual-background-glow"></div>
          
          <div className="hero-orb-wrapper">
            <LiveOrb 
              variant="custom" 
              color="#635bff" 
              size="100%"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
