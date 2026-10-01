import React from 'react';
import { Award, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, Sparkles, BookOpen, Target, ShieldCheck, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReportPDFDocument } from './ReportPDF';
import './InterviewReportView.css';

export default function InterviewReportView({ report, currentUser, interviewConfig, onRestartInterview, onNavigate }) {
  if (!report) {
    return (
      <div className="report-view-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', color: '#94a3b8' }}>
          <h2>Generating your interview report...</h2>
          <p>Please wait while the AI evaluates your performance.</p>
        </div>
      </div>
    );
  }

  const r = report;
  const cName = currentUser?.name || currentUser?.full_name || 'Candidate';
  const iRole = interviewConfig?.targetRole || 'Software Engineer';
  const iDomain = interviewConfig?.type || 'Technical';
  const iDate = new Date().toLocaleDateString();

  // Helper: display score as number or 'N/A' if null/undefined
  const fmt = (v) => (v != null && typeof v === 'number') ? v : 'N/A';
  const fmtPct = (v) => (v != null && typeof v === 'number') ? `${v}%` : 'N/A';
  const fmtWidth = (v) => (v != null && typeof v === 'number') ? `${v}%` : '0%';

  const getRecommendationPill = (score) => {
    if (score == null) return { label: 'Evaluating...', class: 'rec-maybe' };
    if (score >= 85) return { label: 'Strong Hire', class: 'rec-strong-hire' };
    if (score >= 70) return { label: 'Hire', class: 'rec-hire' };
    if (score >= 50) return { label: 'Maybe / Review', class: 'rec-maybe' };
    return { label: 'Needs Practice', class: 'rec-no-hire' };
  };

  const recPill = getRecommendationPill(r.overallScore);
  const cultureScore = (r.overallScore != null) ? Math.min(98, Math.max(65, r.overallScore + 4)) : null;

  return (
    <div className="report-view-root animate-fade-in">
      <div className="container report-container">
        
        {/* Executive Score & Summary Hero Card (Project 1 Structure) */}
        <div className="report-hero-card card-base">
          <div className="report-top-actions">
            <button className="back-home-btn" onClick={() => onNavigate('home')}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <span className="report-tag">
              <Sparkles size={14} className="sparkle-gold" /> AI INTERVIEW EVALUATION REPORT
            </span>
          </div>

          <div className="hero-main-content">
            <div className="candidate-meta-box">
              <span className="meta-sub">Candidate Performance Report</span>
              <h1 className="report-candidate-name">{cName}</h1>
              <p className="report-role-detail">
                Applied Role: <strong>{iRole}</strong> • Domain: <strong>{iDomain}</strong> • Date: <strong>{iDate}</strong>
              </p>
              
              <div className="download-action-row">
                <PDFDownloadLink
                  document={
                    <ReportPDFDocument 
                      report={r} 
                      candidateName={cName}
                      interview={{ target_role: iRole, domain: iDomain }}
                      date={iDate}
                    />
                  }
                  fileName={`InteractAI_Interview_Report.pdf`}
                  className="btn-primary-purple"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '30px', fontSize: '14px', color: 'white', fontWeight: '700' }}
                >
                  {({ loading }) => (
                    <>
                      <Download size={16} />
                      {loading ? 'Generating PDF Report...' : 'Download Official PDF Report'}
                    </>
                  )}
                </PDFDownloadLink>
              </div>
            </div>

            <div className="hero-score-badge-box">
              {r._error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '10px', padding: '10px 16px', marginBottom: '12px', color: '#f87171', fontSize: '0.85rem' }}>
                  ⚠️ {r._error === 'no_transcript' ? 'No transcript was captured. Please retry with an active microphone.' : 'AI evaluation could not be generated. Your transcript was captured. Contact support if this persists.'}
                </div>
              )}
              <div className="overall-score-dial">
                <strong>{fmt(r.overallScore)}</strong>
                <span>/ 100</span>
                <small>Overall Score</small>
              </div>
              <div className={`recommendation-badge ${recPill.class}`}>
                <Award size={16} />
                <span>{recPill.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Metric Grid (Project 1 Competency Layout) */}
        <div className="metrics-grid-4col">
          <div className="metric-card card-base">
            <div className="m-header">
              <span>Technical Knowledge</span>
              <strong>{fmtPct(r.technicalKnowledge)}</strong>
            </div>
            <div className="m-bar-bg">
              <div className="m-bar-fill purple" style={{ width: fmtWidth(r.technicalKnowledge) }}></div>
            </div>
          </div>

          <div className="metric-card card-base">
            <div className="m-header">
              <span>Communication & Clarity</span>
              <strong>{fmtPct(r.communication)}</strong>
            </div>
            <div className="m-bar-bg">
              <div className="m-bar-fill blue" style={{ width: fmtWidth(r.communication) }}></div>
            </div>
          </div>

          <div className="metric-card card-base">
            <div className="m-header">
              <span>Problem Solving & Logic</span>
              <strong>{fmtPct(r.problemSolving)}</strong>
            </div>
            <div className="m-bar-bg">
              <div className="m-bar-fill green" style={{ width: fmtWidth(r.problemSolving) }}></div>
            </div>
          </div>

          <div className="metric-card card-base">
            <div className="m-header">
              <span>Culture & Engagement</span>
              <strong>{fmtPct(cultureScore)}</strong>
            </div>
            <div className="m-bar-bg">
              <div className="m-bar-fill orange" style={{ width: fmtWidth(cultureScore) }}></div>
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
                {r.strengths?.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="report-section-card card-base">
              <h3 className="r-sec-title orange">
                <AlertCircle size={18} /> Areas For Improvement
              </h3>
              <ul className="r-bullets-list">
                {r.weaknesses?.map((w, idx) => (
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
                {r.topicsToImprove?.map((t, idx) => (
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
                {r.questionFeedback?.map((item, idx) => (
                  <div key={idx} className="q-fb-item">
                    <div className="q-fb-header">
                      <strong>Q{idx + 1}: {item.q}</strong>
                      <span className={`q-score-badge ${item.score == null ? 'score-mid' : item.score >= 70 ? 'score-good' : item.score >= 40 ? 'score-mid' : 'score-low'}`}>
                        {item.score != null ? `${item.score}/100` : 'N/A'}
                      </span>
                    </div>
                    <p className="q-fb-note">{item.note}</p>

                    {/* Answer Comparison */}
                    {(item.userAnswer || item.idealAnswer) && (
                      <div className="q-answer-comparison">
                        {item.userAnswer && (
                          <div className="q-answer-block answer-user">
                            <div className="answer-block-label">
                              <span className="label-dot dot-red" />
                              What You Said
                            </div>
                            <p className="answer-block-text">{item.userAnswer}</p>
                          </div>
                        )}
                        {item.idealAnswer && (
                          <div className="q-answer-block answer-ideal">
                            <div className="answer-block-label">
                              <span className="label-dot dot-green" />
                              What You Should Have Said
                            </div>
                            <p className="answer-block-text">{item.idealAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}
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

