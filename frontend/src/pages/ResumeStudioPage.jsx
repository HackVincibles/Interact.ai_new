import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Download, 
  Bot, 
  RefreshCw, 
  ArrowRight, 
  Check, 
  Edit3, 
  Eye, 
  ShieldCheck, 
  Code, 
  Award,
  Layers
} from 'lucide-react';
import { generateGeminiResponse } from '../services/gemini';
import './ResumeStudioPage.css';

export default function ResumeStudioPage({ currentUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' or 'builder'
  
  // ATS Scanner State: Default null if no resume uploaded by candidate
  const [selectedResume, setSelectedResume] = useState(() => {
    return currentUser?.resumeName || null;
  });

  const [jobDescription, setJobDescription] = useState(
    `Target Requirement:\nLooking for strong proficiency in Data Structures & Algorithms, React.js, REST APIs, and Database management.`
  );
  const [isScanning, setIsScanning] = useState(false);
  const [atsScore, setAtsScore] = useState(selectedResume ? 85 : 0);
  const [missingKeywords, setMissingKeywords] = useState(['Redis Caching', 'Docker Multi-Stage', 'System Architecture LLD']);
  const [addedKeywords, setAddedKeywords] = useState([]);

  // AI Bullet Enhancer State
  const [sampleBullet, setSampleBullet] = useState('Worked on web app frontend features.');
  const [enhancedBullet, setEnhancedBullet] = useState('Architected responsive web components with modern REST APIs, improving user response time by 40%.');
  const [enhancing, setEnhancing] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedResume(file.name);
    setAiAnalysis(null);
    setAtsScore(0);

    // Read file text
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      handleRunScanWithContent(file.name, text);
    };
    reader.readAsText(file);
  };

  const handleRunScanWithContent = async (filename, content) => {
    try {
      setIsScanning(true);
      const res = await fetch('http://localhost:5000/api/resume/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: filename || selectedResume,
          resumeText: content || selectedResume,
          jobDescription,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const evalData = data.evaluation;
        setAiAnalysis(evalData);
        setAtsScore(evalData.atsScore || 15);
        setMissingKeywords(evalData.missingKeywords || []);
        setAddedKeywords(evalData.matchedKeywords || []);
      }
    } catch (err) {
      console.warn('Backend ATS Scan fetch error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRunScan = () => {
    if (!selectedResume) {
      alert('Please select or upload a document file first!');
      return;
    }
    handleRunScanWithContent(selectedResume, '');
  };

  const handleEnhanceBullet = async () => {
    try {
      setEnhancing(true);
      const prompt = `Rewrite this resume line into a high-impact STAR-format bullet point with quantifiable metrics: "${sampleBullet}"`;
      const result = await generateGeminiResponse(prompt);
      if (result) {
        setEnhancedBullet(result.replace(/^"|"$/g, ''));
      } else {
        setEnhancedBullet('Architected scalable React.js frontend & Node.js REST APIs, reducing rendering latency by 35% across 5,000+ active users.');
      }
    } catch (err) {
      console.warn('Gemini enhancement fallback:', err);
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="resume-studio-root animate-fade-in">
      
      {/* Hero Section */}
      <section className="resume-hero-section">
        <div className="container">
          <div className="resume-hero-card">
            <div className="resume-title-group">
              <span className="section-label">AI RESUME STUDIO & ATS SCANNER</span>
              <h1 className="resume-main-title">
                Optimize Your Resume For <br />
                <span className="purple-gradient-text">Top Recruiter & ATS Bots</span>
              </h1>
              <p className="resume-main-subtitle">
                Upload your candidate PDF resume, scan against target Job Descriptions, eliminate keyword gaps, and convert weak bullets into high-impact STAR metrics.
              </p>
            </div>

            {/* Live ATS Score Dial Box */}
            <div className="ats-score-preview-box">
              <div className="score-dial-circle">
                {selectedResume ? atsScore : '--'}
              </div>
              <h3 className="score-box-title">Overall ATS Match Score</h3>
              <span className="score-box-sub">
                {selectedResume ? '✓ Active Resume Loaded' : 'Upload Resume to Calculate'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace Tabs & Scanner Grid */}
      <section className="container resume-workspace-section">
        
        {/* Tab Selector Bar */}
        <div className="resume-tabs-bar card-base">
          <button 
            className={`resume-tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
            onClick={() => setActiveTab('scanner')}
          >
            <ShieldCheck size={18} />
            <span>ATS Resume Scanner & Gap Analyzer</span>
          </button>
          <button 
            className={`resume-tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            <Sparkles size={18} />
            <span>AI Bullet Point STAR Enhancer</span>
          </button>
        </div>

        {activeTab === 'scanner' ? (
          <div className="scanner-grid">
            
            {/* Left: Resume & Job Description Inputs */}
            <div className="scanner-col-left">
              
              {/* File Upload Box */}
              <div className="card-base scanner-box">
                <input 
                  type="file" 
                  id="real-resume-input"
                  accept=".pdf,.doc,.docx,.txt"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <div className="box-title-row">
                  <h3>1. Select Candidate Document / Resume</h3>
                  {selectedResume && (
                    <button className="change-file-btn" onClick={() => document.getElementById('real-resume-input').click()}>
                      Replace File
                    </button>
                  )}
                </div>

                {selectedResume ? (
                  <div className="selected-file-tile">
                    <FileText size={28} className="pdf-icon" />
                    <div>
                      <strong className="file-name">{selectedResume}</strong>
                      <p className="file-sub">Document Loaded • Gemini AI Scanner Ready</p>
                    </div>
                  </div>
                ) : (
                  <div className="upload-dropzone" onClick={() => document.getElementById('real-resume-input').click()}>
                    <UploadCloud size={36} className="upload-cloud-icon" />
                    <h4>Upload Document / PDF Resume</h4>
                    <p>Click or drag & drop any PDF, DOCX, or text file here for AI analysis</p>
                    <button className="btn-primary-purple upload-trigger-btn" type="button">
                      Choose File to Scan
                    </button>
                  </div>
                )}
              </div>

              {/* Job Description Box */}
              <div className="card-base scanner-box">
                <h3>2. Target Job Description (JD)</h3>
                <p className="box-sub">Paste the job description from LinkedIn, Naukri, or Google careers to find missing keywords.</p>
                <textarea 
                  className="jd-textarea"
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste Job Description text here..."
                />
                <button 
                  className="btn-primary-purple run-scan-btn" 
                  onClick={handleRunScan}
                  disabled={isScanning || !selectedResume}
                >
                  {isScanning ? 'Scanning Keywords...' : 'Run ATS Match Scan →'}
                </button>
              </div>

            </div>

            {/* Right: ATS Keyword Gap Analysis Results */}
            <div className="scanner-col-right">
              <div className="card-base scanner-box">
                <div className="box-title-row">
                  <h3>ATS Keyword Gap Analysis</h3>
                  <span className="match-pill green">Score: {selectedResume ? `${atsScore}/100` : 'Upload First'}</span>
                </div>

                {selectedResume ? (
                  <>
                    {aiAnalysis?.summary && (
                      <div 
                        className="ai-summary-alert-card"
                        style={{
                          padding: '14px 16px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          background: aiAnalysis.isResume ? 'rgba(99, 91, 255, 0.08)' : 'rgba(239, 68, 68, 0.12)',
                          border: `1px solid ${aiAnalysis.isResume ? 'var(--primary-purple)' : '#ef4444'}`,
                          color: aiAnalysis.isResume ? 'var(--text-main)' : '#991b1b',
                          fontSize: '0.88rem',
                          lineHeight: '1.5',
                        }}
                      >
                        <strong>🤖 Gemini AI Analysis:</strong> {aiAnalysis.summary}
                      </div>
                    )}

                    <div className="keyword-section">
                      <h4 className="kw-group-title red">
                        <AlertCircle size={16} /> Missing Key Skills in Resume ({missingKeywords.length})
                      </h4>
                      <p className="kw-sub">Click any keyword to add it to your profile resume optimization list:</p>
                      <div className="keywords-flex">
                        {missingKeywords.map((kw, i) => (
                          <button key={i} className="kw-chip missing" onClick={() => handleAddKeyword(kw)}>
                            <Plus size={12} /> {kw}
                          </button>
                        ))}
                        {missingKeywords.length === 0 && <span className="green-text font-bold">✓ All critical keywords matched!</span>}
                      </div>
                    </div>

                    {addedKeywords.length > 0 && (
                      <div className="keyword-section">
                        <h4 className="kw-group-title green">
                          <CheckCircle2 size={16} /> Added Keywords
                        </h4>
                        <div className="keywords-flex">
                          {addedKeywords.map((kw, i) => (
                            <span key={i} className="kw-chip added">
                              <Check size={12} /> {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-scan-notice">
                    <AlertCircle size={32} style={{ color: 'var(--text-light)', marginBottom: '8px' }} />
                    <p>Upload your PDF resume to unlock instant ATS keyword gap analysis and recruiter matching score.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* AI STAR Bullet Enhancer View */
          <div className="card-base scanner-box enhancer-box">
            <h3>AI Resume Bullet Point STAR Enhancer</h3>
            <p className="box-sub">Paste any basic resume bullet point to rewrite it using action verbs and quantifiable metrics.</p>

            <div className="enhancer-grid">
              <div>
                <label className="input-label">Original Bullet Line:</label>
                <textarea 
                  className="jd-textarea"
                  rows={3}
                  value={sampleBullet}
                  onChange={(e) => setSampleBullet(e.target.value)}
                />
                <button className="btn-primary-purple enhance-btn" onClick={handleEnhanceBullet} disabled={enhancing}>
                  {enhancing ? 'Enhancing with Gemini AI...' : 'Rewrite with STAR Format →'}
                </button>
              </div>

              <div>
                <label className="input-label">Optimized High-Impact STAR Bullet Line:</label>
                <div className="enhanced-output-box">
                  <Sparkles size={18} className="sparkle-gold" />
                  <p className="enhanced-text">"{enhancedBullet}"</p>
                  <button 
                    className="btn-outline-secondary copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(enhancedBullet);
                      alert('Enhanced STAR bullet line copied to clipboard!');
                    }}
                  >
                    Copy to Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

    </div>
  );
}
