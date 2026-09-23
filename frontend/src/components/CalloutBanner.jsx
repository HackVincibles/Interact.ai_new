import React from 'react';
import { ArrowRight, GraduationCap } from 'lucide-react';
import './CalloutBanner.css';

export default function CalloutBanner({ onGetStarted }) {
  return (
    <section className="callout-section">
      <div className="container">
        <div className="callout-card">
          <div className="callout-content">
            <span className="callout-badge">YOUR NEXT OPPORTUNITY AWAITS</span>
            <h2 className="callout-title">
              Take the Next Step towards <br />
              <span>Your Dream Career</span>
            </h2>
            <p className="callout-desc">
              Join thousands of students who are building their skills, passing mock interviews, and landing corporate offers with Interact.ai.
            </p>

            <button className="btn-primary callout-btn" onClick={onGetStarted}>
              <span>Get Started for Free</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="callout-visual">
            <div className="cap-icon-circle">
              <GraduationCap size={72} color="#ffffff" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
