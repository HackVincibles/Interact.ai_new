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

  const handleAddKeyword = (kw) => {
    setMissingKeywords(prev => prev.filter(k => k !== kw));
    setAddedKeywords(prev => [...prev, kw]);
    setAtsScore(prev => Math.min(100, Math.max(30, prev + 4)));
  };

  const getSuggestions = () => {
    if (!selectedResume) return [];
    if (aiAnalysis?.starSuggestions && aiAnalysis.starSuggestions.length > 0) {
      return aiAnalysis.starSuggestions;
    }
    // Dynamic rule-based fallbacks based on ATS score thresholds
    if (atsScore < 75) {
      return [
        `1. Add critical target JD keywords: ${missingKeywords.slice(0, 3).join(', ') || 'System Architecture, React'}`,
        '2. Quantify achievements in experience using % or user metrics (e.g., reduced API latency by 40%).',
        '3. Include a dedicated Tech Stack / Core Competencies section near the top of your resume.',
        '4. Format bullet points starting with strong action verbs (e.g., "Engineered", "Optimized", "Architected").',
        '5. Include GitHub repository links and live deployment URLs for major full-stack projects.',
        '6. Tailor project descriptions specifically to match terms listed in target Job Description.',
        '7. Maintain standard single-column ATS-friendly formatting without embedded image graphics.'
      ];
    } else if (atsScore < 90) {
      return [
        `1. Integrate remaining target skills (${missingKeywords.join(', ') || 'Docker, Microservices'}) into project bullets.`,
        '2. Highlight unit testing, CI/CD pipelines, and cross-functional team collaborations.',
        '3. Ensure all tech stack terms match exact casing as specified in recruiter Job Description.'
      ];
    } else {
      return [
        '1. Excellent ATS match! Keep contact details updated with active LinkedIn and GitHub links.',
        '2. Perform a final proofread to verify consistent formatting and active verb tenses.'
      ];
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedResume(file.name);
    setAiAnalysis(null);
    setAtsScore(0);

    // Read file text & sanitize binary PDF control chars
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = event.target.result || '';
      const cleanText = typeof rawText === 'string' 
        ? rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ') 
        : file.name;
      handleRunScanWithContent(file.name, cleanText);
    };
    reader.readAsText(file);
  };

  const extractKeywordsFromJD = (jdText) => {
    if (!jdText) return ['Data Structures', 'React.js', 'Node.js', 'REST APIs'];
    const regex = /\b(Agentic AI|LangChain|AutoGen|Vector DB|Vector Databases|RAG|LLM|Prompt Engineering|Python|Java|C\+\+|React(?:\.js)?|Node(?:\.js)?|Next(?:\.js)?|TypeScript|JavaScript|Express|Docker|Kubernetes|AWS|GCP|Azure|SQL|PostgreSQL|MongoDB|Redis|System Design|REST APIs?|GraphQL|Microservices|Git|CI\/CD|DSA|Data Structures|Machine Learning|Deep Learning|DevOps)\b/gi;
    const matches = jdText.match(regex) || [];
    const uniqueMap = new Map();
    matches.forEach(m => {
      const lower = m.toLowerCase();
      if (!uniqueMap.has(lower)) {
        uniqueMap.set(lower, m);
      }
    });
    const extracted = Array.from(uniqueMap.values());
    if (extracted.length >= 2) return extracted;

    const words = jdText.split(/[\s,.;\n]+/);
    const techWords = words.filter(w => w.length > 3 && /^[A-Z]/.test(w));
    const dedupedTech = Array.from(new Set(techWords)).slice(0, 6);
    return dedupedTech.length >= 2 ? dedupedTech : ['Agentic AI', 'LangChain', 'React.js', 'Node.js', 'System Architecture'];
  };

  const checkSkillMatch = (kw, resumeText) => {
    if (!kw) return false;
    const storedText = localStorage.getItem('interact_candidate_resume_text') || '';
    const fullText = ((resumeText || '') + ' ' + storedText + ' ' + (selectedResume || '')).toLowerCase();
    const cleanFull = fullText.replace(/[^a-z0-9\s]/g, ' ');

    const kwLower = kw.toLowerCase().trim();
    const kwClean = kwLower.replace(/[^a-z0-9\s]/g, ' ').trim();

    // 1. Direct substring match
    if (cleanFull.includes(kwClean) || fullText.includes(kwLower)) return true;

    // 2. Comprehensive technical synonym dictionary
    const synonymDictionary = {
      'data structures': ['dsa', 'data structure', 'algorithms', 'data structures & algorithms', 'structs', 'dsa & algorithms'],
      'data structures & algorithms': ['dsa', 'data structure', 'algorithms', 'data structures'],
      'react.js': ['react', 'reactjs', 'react js', 'frontend react', 'react framework', 'jsx'],
      'react': ['react.js', 'reactjs', 'react js', 'jsx'],
      'rest apis': ['rest', 'restful', 'rest api', 'api', 'apis', 'json api', 'http api', 'web services', 'express api'],
      'rest api': ['rest', 'restful', 'rest apis', 'api', 'apis', 'json api'],
      'node.js': ['node', 'nodejs', 'express', 'express.js', 'backend node', 'node js'],
      'postgresql': ['postgres', 'sql', 'psql', 'relational database', 'database', 'rdbms'],
      'mongodb': ['mongo', 'nosql', 'document db', 'database'],
      'system design': ['system architecture', 'lld', 'hld', 'microservices', 'distributed systems', 'design patterns'],
      'machine learning': ['ml', 'deep learning', 'scikit', 'tensorflow', 'pytorch', 'ai'],
      'artificial intelligence': ['ai', 'genai', 'llm', 'gemini', 'gpt'],
      'competitive programming': ['cp', 'leetcode', 'codeforces', 'dsa'],
      'docker': ['containerization', 'containers', 'dockerfile', 'docker-compose'],
      'kubernetes': ['k8s', 'container orchestration'],
      'aws': ['amazon web services', 'ec2', 's3', 'cloud'],
    };

    for (const [key, synonyms] of Object.entries(synonymDictionary)) {
      if (kwClean.includes(key) || key.includes(kwClean)) {
        if (synonyms.some(s => cleanFull.includes(s))) return true;
      }
    }

    // 3. Token check: if all non-stopword tokens of the keyword exist in the text
    const tokens = kwClean.split(/\s+/).filter(t => t.length > 2 && !['and', 'for', 'the', 'with', 'using'].includes(t));
    if (tokens.length > 0 && tokens.every(t => cleanFull.includes(t))) {
      return true;
    }

    return false;
  };

  const performRealtimeJDKeywordScan = (resumeContent, targetJD) => {
    const jdKeywords = extractKeywordsFromJD(targetJD);
    if (resumeContent && resumeContent.length > 20) {
      localStorage.setItem('interact_candidate_resume_text', resumeContent);
    }
    
    const matched = [];
    const missing = [];
    
    jdKeywords.forEach(kw => {
      if (checkSkillMatch(kw, resumeContent)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const matchRatio = jdKeywords.length > 0 ? (matched.length / jdKeywords.length) : 0.8;
    const rawScore = Math.round(matchRatio * 100);
    const finalScore = Math.max(30, rawScore < 30 ? 30 : rawScore);

    setMissingKeywords(missing);
    setAddedKeywords(matched);
    setAtsScore(finalScore);
  };

  const handleRunScanWithContent = async (filename, content) => {
    try {
      setIsScanning(true);
      performRealtimeJDKeywordScan(content, jobDescription);

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
        if (evalData.missingKeywords && evalData.missingKeywords.length > 0) {
          setMissingKeywords(evalData.missingKeywords);
        }
        if (evalData.matchedKeywords && evalData.matchedKeywords.length > 0) {
          setAddedKeywords(evalData.matchedKeywords);
        }
        const calculatedScore = evalData.isResume ? Math.max(30, evalData.atsScore || 30) : 15;
        setAtsScore(calculatedScore);
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
      const prompt = `Rewrite this resume line into a high-impact STAR-format bullet point with action verbs and quantifiable metrics: "${sampleBullet}"`;
      const result = await generateGeminiResponse(prompt);
      if (result) {
        setEnhancedBullet(result.replace(/^"|"$/g, ''));
      } else {
        setEnhancedBullet('Architected scalable React.js frontend & Node.js REST APIs, reducing rendering latency by 35% across 5,000+ active users.');
      }
    } catch (err) {
      console.warn('Gemini enhancement fallback:', err);
      setEnhancedBullet(`Architected solution for "${sampleBullet}", improving performance efficiency by 40% using modern web best practices.`);
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

                    {/* AI Improvement Suggestions List */}
                    <div className="suggestions-section" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} style={{ color: 'var(--primary-purple)' }} /> Actionable AI Improvement Suggestions ({getSuggestions().length})
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {getSuggestions().map((item, idx) => (
                          <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-sub)', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid var(--primary-purple)' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
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
