import React from 'react';
import { Award, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, Sparkles, BookOpen, Target, ShieldCheck } from 'lucide-react';
import './InterviewReportView.css';

export default function InterviewReportView({ report, onRestartInterview, onNavigate }) {
  const r = report || {
    overallScore: 88,
    technicalKnowledge: 86,
    communication: 90,
    problemSolving: 85,
    strengths: ['Clean architectural reasoning for REST APIs', 'Good explanation of asynchronous I/O loops', 'Structured approach to problem solving'],
    weaknesses: ['Could detail memory footprint of recursive stack frames'],
    topicsToImprove: ['Redis Cache Stampede Mitigation', 'PostgreSQL Hash vs B-Tree Indexes'],
    questionFeedback: [
      { q: 'System Architecture & Data Structures', score: 88, note: 'Clear breakdown of API gateway and database queries.' },
      { q: 'High-Concurrency Caching & Redis', score: 86, note: 'Solid understanding of cache invalidation strategies.' },
    ],
    recommendedPractice: 'Practice 45-min System Design & Advanced Data Structures sessions.',
  };

  return (
    <div className="report-view-root animate-fade-in">
      <div className="container report-container">
        
        {/* Top Header Card */}
        <div className="report-header-card card-base">
          <div className="report-top-actions">
            <button className="back-home-btn" onClick={() => onNavigate('home')}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <span className="report-tag">
              <Sparkles size={14} className="sparkle-gold" /> 50-PARAMETER AI INTERVIEW EVALUATION
            </span>
          </div>

          <div className="report-main-summary">
            <div>
              <h1 className="report-title">Candidate Performance Report</h1>
              <p className="report-sub">Evaluated by Interact Gemini AI Interview Engine</p>
            </div>

            <div className="overall-score-dial">
              <strong>{r.overallScore}</strong>
              <span>/ 100</span>
              <small>Overall Grade</small>
            </div>
          </div>
        </div>

        {/* 3 Core Metric Sliders */}
        <div className="metrics-grid">
          <div className="metric-card card-base">
            <div className="m-header">
              <span>Technical Knowledge</span>
              <strong>{r.technicalKnowledge}%</strong>
            </div>
            <div className="m-bar-bg">
              <div className="m-bar-fill purple" style={{ width: `${r.technicalKnowledge}%` }}></div>
            </div>
          </div>

          <div className="metric-card card-base">
            <div className="m-header">
              <span>Communication & Clarity</span>
              <strong>{r.communication}%</strong>
            </div>
            <div className="m-bar-bg">
              <div className="m-bar-fill blue" style={{ width: `${r.communication}%` }}></div>
            </div>
          </div>

          <div className="metric-card card-base">
            <div className="m-header">
              <span>Problem Solving & Logic</span>
              <strong>{r.problemSolving}%</strong>
            </div>
            <div className="m-bar-bg">
              <div className="m-bar-fill green" style={{ width: `${r.problemSolving}%` }}></div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="report-details-grid">
          
          {/* Left Column: Strengths & Weaknesses */}
          <div className="report-col-left">
            
            <div className="report-section-card card-base">
              <h3 className="r-sec-title green">
                <CheckCircle2 size={18} /> Candidate Strengths
              </h3>
              <ul className="r-bullets-list">
                {r.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="report-section-card card-base">
              <h3 className="r-sec-title orange">
                <AlertCircle size={18} /> Areas For Improvement
              </h3>
              <ul className="r-bullets-list">
                {r.weaknesses.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            <div className="report-section-card card-base">
              <h3 className="r-sec-title purple">
                <BookOpen size={18} /> Recommended Study Plan
              </h3>
              <p className="rec-text">{r.recommendedPractice}</p>
              <div className="topics-pills-row">
                {r.topicsToImprove.map((t, idx) => (
                  <span key={idx} className="topic-pill">{t}</span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Question-by-Question Detailed Feedback */}
          <div className="report-col-right">
            <div className="report-section-card card-base">
              <h3 className="r-sec-title blue">
                <ShieldCheck size={18} /> Question-by-Question Feedback
              </h3>

              <div className="q-feedback-list">
                {r.questionFeedback.map((item, idx) => (
                  <div key={idx} className="q-fb-item">
                    <div className="q-fb-header">
                      <strong>Q{idx + 1}: {item.q}</strong>
                      <span className="q-score-badge">{item.score}/100</span>
                    </div>
                    <p className="q-fb-note">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-actions-box card-base">
              <button className="btn-primary-purple restart-btn" onClick={onRestartInterview}>
                <RefreshCw size={16} /> Practice Another Interview Session
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
