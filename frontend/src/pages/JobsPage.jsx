import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Building,
  Zap,
  TrendingUp
} from 'lucide-react';
import WebScannerCard from '../components/WebScannerCard';
import SystemDiagnosticsModal from '../components/SystemDiagnosticsModal';
import './JobsPage.css';

export default function JobsPage({ currentUser, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('job');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalJob, setActiveModalJob] = useState(null);
  const [jobsCatalog, setJobsCatalog] = useState([]);
  const [fundingRadarList, setFundingRadarList] = useState([]);
  const [sessionStats, setSessionStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  const fetchJobsData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/jobs?category=${selectedCategory}&query=${encodeURIComponent(searchQuery)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setJobsCatalog(data.jobs || []);
        if (data.sessionStats) {
          setSessionStats(data.sessionStats);
        }
      }
    } catch (err) {
      console.warn('Jobs API fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsData();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    async function loadFundingRadar() {
      try {
        const res = await fetch('http://localhost:5000/api/jobs/funding-radar');
        if (res.ok) {
          const data = await res.json();
          if (data.fundingRadar && data.fundingRadar.length > 0) {
            setFundingRadarList(data.fundingRadar);
          }
        }
      } catch (err) {
        console.warn('Funding radar API error:', err);
      }
    }
    loadFundingRadar();
  }, []);

  const handleScanNewJob = (newJob) => {
    if (newJob) {
      setJobsCatalog((prev) => [newJob, ...prev]);
    } else {
      fetchJobsData();
    }
  };

  const defaultFundingList = [
    {
      company: 'Razorpay',
      round: 'Series F Funding ($375M)',
      hiringSignal: '🔥 Active Hiring for 45+ SDE & FinTech Engineers',
      techStack: ['Node.js', 'Go', 'React', 'PostgreSQL'],
      applyUrl: 'https://razorpay.com/jobs',
    },
    {
      company: 'Zepto',
      round: 'Series G Funding ($660M)',
      hiringSignal: '🚀 Massive Campus & Lateral Software Hiring',
      techStack: ['Python', 'Kafka', 'React Native', 'Redis'],
      applyUrl: 'https://zeptonow.com/careers',
    },
    {
      company: 'ISRO / DRDO Tech',
      round: 'Govt Research Grant',
      hiringSignal: '🇮🇳 Scientist & JRF Engineer Openings',
      techStack: ['C/C++', 'Python', 'RTOS', 'Cybersecurity'],
      applyUrl: 'https://www.isro.gov.in/Careers.html',
    }
  ];

  const displayFunding = fundingRadarList.length > 0 ? fundingRadarList : defaultFundingList;

  return (
    <div className="jobs-hub-root animate-fade-in">
      
      {/* Hero Header */}
      <section className="jobs-hero-section">
        <div className="container">
          <div className="jobs-hero-card">
            <div className="hero-text-content">
              <span className="section-label">FULL-TIME SDE & OFFICIAL RECRUITMENT ENGINE</span>
              <h1 className="jobs-main-title">
                Full-Time Software Careers & <br />
                <span className="purple-gradient-text">Official Government Openings</span>
              </h1>
              <p className="jobs-main-sub">
                Live web intelligence indexed from Microsoft, Uber, Razorpay, Google, ISRO & DRDO.
              </p>
            </div>

            <div className="jobs-quick-stats">
              <div className="stat-pill">
                <strong>100% Official</strong>
                <span>Direct Portals</span>
              </div>
              <div className="stat-pill">
                <strong>SDE-1 & High Growth</strong>
                <span>₹14L - ₹45L CTC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Real-time Web Scanner Component (internships.dev style) */}
        <WebScannerCard 
          category="job"
          onScanComplete={handleScanNewJob}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          sessionStats={sessionStats}
        />
      </div>

      {/* Funding & Hiring Correlation Radar */}
      <section className="container funding-radar-section">
        <div className="card-base radar-card">
          <div className="radar-header">
            <div className="title-with-icon">
              <TrendingUp size={20} className="card-icon green" />
              <h3>Newly Funded Startups Hiring Radar (TinyFish Intelligence)</h3>
            </div>
            <span className="radar-badge"><Zap size={13} /> Live Web Signal</span>
          </div>

          <div className="funding-grid">
            {displayFunding.map((item, idx) => (
              <div key={idx} className="funding-item-tile">
                <div className="f-company-row">
                  <strong>{item.company}</strong>
                  <span className="f-round-tag">{item.round}</span>
                </div>
                <p className="f-signal">{item.hiringSignal}</p>
                <div className="f-tech-pills">
                  {item.techStack?.map((t, i) => (
                    <span key={i} className="f-tech-pill">{t}</span>
                  ))}
                </div>
                <a 
                  href={item.applyUrl || item.sourceUrl || '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-outline-secondary apply-funding-btn"
                >
                  <span>Official Careers Portal</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar & Search */}
      <section className="container jobs-search-section">
        <div className="search-filter-card card-base">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search full-time jobs by title, company, or stack (C++, Go, React, Azure)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips-row">
            <button 
              className={`filter-chip ${selectedCategory === 'job' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('job')}
            >
              Full-Time SDE Jobs
            </button>
            <button 
              className={`filter-chip ${selectedCategory === 'govt' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('govt')}
            >
              🇮🇳 Government Jobs (ISRO/DRDO)
            </button>
            <button 
              className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Openings
            </button>
            <button 
              className="filter-chip diag-chip"
              onClick={() => setIsDiagnosticsOpen(true)}
            >
              <ShieldCheck size={14} className="green" /> Check AI Status
            </button>
          </div>
        </div>
      </section>

      {/* Jobs Catalog Grid */}
      <section className="container jobs-list-section">
        <div className="jobs-cards-grid">
          {loading ? (
            <div className="card-base" style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading full-time SDE openings...
            </div>
          ) : jobsCatalog.length === 0 ? (
            <div className="card-base" style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
              No openings found matching your criteria. Try running the Web Scanner!
            </div>
          ) : (
            jobsCatalog.map((j) => (
              <div key={j.id} className="job-card-item card-base">
                <div className="job-card-header">
                  <div className="company-logo-wrapper">
                    <img src={j.logo} alt={j.company} />
                  </div>
                  <div>
                    <h3 className="job-card-title">{j.title}</h3>
                    <p className="job-card-company">{j.company}</p>
                  </div>
                </div>

                <div className="job-card-meta">
                  <span><MapPin size={14} /> {j.location}</span>
                  <span><DollarSign size={14} /> {j.stipend}</span>
                  <span><Clock size={14} /> {j.duration}</span>
                  {j.eligibleBatch && <span>🎓 {j.eligibleBatch}</span>}
                  {j.experienceRequired && <span>💼 {j.experienceRequired}</span>}
                  {j.deadline && <span>⏰ Deadline: {j.deadline}</span>}
                </div>

                <div className="job-skills-row">
                  {j.skills?.map((s, idx) => (
                    <span key={idx} className="j-skill-pill">{s}</span>
                  ))}
                </div>

                <div className="job-card-actions">
                  <button className="btn-outline-secondary details-btn" onClick={() => setActiveModalJob(j)}>
                    View Details
                  </button>

                  <a 
                    href={j.officialApplyUrl || j.applyUrl || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-primary-purple apply-btn"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <span>Apply Official Source</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal View Details */}
      {activeModalJob && (
        <div className="modal-backdrop-overlay" onClick={() => setActiveModalJob(null)}>
          <div className="modal-box card-base" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>{activeModalJob.title}</h3>
              <button className="modal-close" onClick={() => setActiveModalJob(null)}><X size={18} /></button>
            </div>
            <p className="modal-company"><strong>{activeModalJob.company}</strong> • {activeModalJob.location}</p>
            <p className="modal-desc">{activeModalJob.desc}</p>
            <div className="modal-actions-row">
              <button className="btn-outline-secondary" onClick={() => setActiveModalJob(null)}>Close</button>
              <a href={activeModalJob.officialApplyUrl || '#'} target="_blank" rel="noreferrer" className="btn-primary-purple" style={{ textDecoration: 'none' }}>
                Visit Official Careers Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* AI & System Diagnostics Modal */}
      <SystemDiagnosticsModal 
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

    </div>
  );
}
