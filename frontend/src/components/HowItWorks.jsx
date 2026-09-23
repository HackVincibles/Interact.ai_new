import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import './HowItWorks.css';

export default function HowItWorks({ onGetStarted }) {
  const steps = [
    {
      num: 1,
      title: 'Explore',
      desc: 'Find personalized career options based on your interests, branch, and academic goals.',
    },
    {
      num: 2,
      title: 'Learn',
      desc: 'Take curated free & paid courses from NPTEL, Google, Coursera & IIITs to build job-ready skills.',
    },
    {
      num: 3,
      title: 'Practice',
      desc: 'Master interviews using AI mock simulations, integrated code editor & instant 50-parameter report.',
    },
    {
      num: 4,
      title: 'Apply',
      desc: 'Get matched with top paid internships, private tech jobs & government opportunities (ISRO/DRDO).',
    },
  ];

  return (
    <section className="how-it-works-section">
      <div className="container">
        <div className="how-it-works-grid">
          {/* Left Column: Step Timeline */}
          <div className="steps-content">
            <span className="section-label">HOW IT WORKS</span>
            <h2 className="section-title">
              A Simple Path to a <span>Brighter Future</span>
            </h2>
            <p className="section-subtitle">
              Follow a few simple steps and get closer to your dream corporate career.
            </p>

            <div className="steps-timeline">
              {steps.map((step) => (
                <div key={step.num} className="step-item">
                  <div className="step-number">{step.num}</div>
                  <div className="step-details">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-primary steps-cta" onClick={onGetStarted}>
              <span>Start Your Journey</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Right Column: Interactive UI Laptop Showcase */}
          <div className="laptop-preview-container">
            <div className="laptop-frame">
              <div className="laptop-screen">
                <div className="screen-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                  <span className="screen-url">https://interact.ai/dashboard</span>
                </div>
                <div className="screen-body">
                  <div className="mock-card">
                    <div className="mock-badge">AI Interview Status</div>
                    <h4>Java Full Stack Developer Mock</h4>
                    <p>Score: <strong>88/100</strong> • Passed Code Verification</p>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div className="mock-grid">
                    <div className="mock-subcard">
                      <span>Verified Skills</span>
                      <strong>React, Node, DSA</strong>
                    </div>
                    <div className="mock-subcard">
                      <span>College Rank</span>
                      <strong>#14 in SISTec-R</strong>
                    </div>
                  </div>

                  <div className="mock-match">
                    <CheckCircle size={16} color="#16a34a" />
                    <span>Matched with 12 Bengaluru Internships (Avg ₹40K/mo)</span>
                  </div>
                </div>
              </div>
              <div className="laptop-base"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
