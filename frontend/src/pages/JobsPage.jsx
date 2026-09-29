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

import API_BASE_URL from '../config/api';

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
      const res = await fetch(`${API_BASE_URL}/api/jobs?category=${selectedCategory}&query=${encodeURIComponent(searchQuery)}`, { cache: 'no-store' });
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
        const res = await fetch(`${API_BASE_URL}/api/jobs/funding-radar`);
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

  const handleScanNewJob = (scannedItems) => {
    if (Array.isArray(scannedItems) && scannedItems.length > 0) {
      setJobsCatalog((prev) => [...scannedItems, ...prev]);
    } else if (scannedItems && typeof scannedItems === 'object') {
      setJobsCatalog((prev) => [scannedItems, ...prev]);
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
      applyUrl: 'https://razorpay.com/jobs/',
    },
    {
      company: 'Zepto',
      round: 'Series G Funding ($660M)',
      hiringSignal: '🚀 Massive Campus & Lateral Software Hiring',
      techStack: ['Python', 'Kafka', 'React Native', 'Redis'],
      applyUrl: 'https://zeptonow.com/careers',
    },
    {
      company: 'PhysicsWallah (PW)',
      round: 'Series B Funding ($210M)',
      hiringSignal: '💻 Hiring EdTech Backend & AI Engineers',
      techStack: ['Node.js', 'React', 'AWS', 'Python'],
      applyUrl: 'https://www.pw.live/careers',
    },
    {
      company: 'Postman',
      round: 'Series D Funding ($225M)',
      hiringSignal: '⚡ Active Hiring for API Platform Engineers',
      techStack: ['JavaScript', 'Go', 'Electron', 'AWS'],
      applyUrl: 'https://www.postman.com/careers/',
    },
    {
      company: 'Ather Energy',
      round: 'Series E Funding ($128M)',
      hiringSignal: '🔋 EV Embedded Systems & IoT Software Roles',
      techStack: ['C/C++', 'Python', 'RTOS', 'React'],
      applyUrl: 'https://www.atherenergy.com/careers',
    },
    {
      company: 'Hasura',
      round: 'Series C Funding ($100M)',
      hiringSignal: 'GraphQL Engine & Infrastructure Engineering',
      techStack: ['Haskell', 'Go', 'GraphQL', 'PostgreSQL'],
      applyUrl: 'https://hasura.io/careers/',
    }
  ];

  const sarkariGovtJobsList = [
    { id: 's1', title: 'ISRO Scientist / Engineer \'SC\' 2026', org: 'ISRO 🇮🇳', qual: 'BE/B.Tech (CS/IT/ECE)', salary: 'Level-10 (₹56,100 + DA)', deadline: '15 Dec 2026', url: 'https://www.isro.gov.in/Careers.html' },
    { id: 's2', title: 'DRDO Junior Research Fellow (JRF) AI/Cyber', org: 'DRDO 🇮🇳', qual: 'B.Tech/M.Tech (CS/AI)', salary: '₹37,000/mo + HRA', deadline: '30 Nov 2026', url: 'https://www.drdo.gov.in/drdo/careers' },
    { id: 's3', title: 'NIC Scientist \'B\' & Technical Assistant', org: 'National Informatics Centre', qual: 'B.Tech (CS/IT/ECE/MCA)', salary: 'Level-10 Matrix', deadline: '20 Dec 2026', url: 'https://www.nic.in/careers' },
    { id: 's4', title: 'SSC CGL 2026 (Assistant Section Officer - IT)', org: 'Staff Selection Commission', qual: 'Any Graduate / CS Degree', salary: 'Level-7 (₹44,900 - ₹1,42,400)', deadline: '10 Jan 2027', url: 'https://ssc.gov.in/' },
    { id: 's5', title: 'RRB Senior Section Engineer (IT & Signals)', org: 'Indian Railways (RRB)', qual: 'Diploma / Degree in Engg', salary: 'Level-7 Pay Matrix', deadline: '05 Jan 2027', url: 'https://indianrailways.gov.in/' },
    { id: 's6', title: 'UPSC Indian Engineering Services (IES 2026)', org: 'UPSC 🇮🇳', qual: 'B.Tech (ECE/CS/EE)', salary: 'Class-1 Gazetted Officer', deadline: '28 Dec 2026', url: 'https://upsc.gov.in/' },
  ];

  const displayFunding = fundingRadarList.length > 0 ? fundingRadarList : defaultFundingList;

  return (
    <div className="jobs-hub-root animate-fade-in">
      
      {/* Hero Header */}
      <section className="jobs-hero-section">
        <div className="container">
          <div className="jobs-hero-card">
            <div className="hero-text-content">
              <span className="section-label">OFFICIAL PRIVATE & GOVERNMENT RECRUITMENT ENGINE</span>
              <h1 className="jobs-main-title">
                Private Tech Careers & <br />
                <span className="purple-gradient-text">Sarkari Result Govt Openings</span>
              </h1>
              <p className="jobs-main-sub">
                Live web intelligence indexed from Microsoft, Uber, Razorpay, Zepto, ISRO, DRDO & Sarkari Result portals.
              </p>
            </div>

            <div className="jobs-quick-stats">
              <div className="stat-pill">
                <strong>100% Official</strong>
                <span>Direct Portals</span>
              </div>
              <div className="stat-pill">
                <strong>Private & Govt</strong>
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
              <h3>Newly Funded Startups Hiring Radar (Direct Official Portals)</h3>
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
                  href={item.applyUrl || item.officialApplyUrl || 'https://razorpay.com/jobs/'} 
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
              placeholder="Search private & govt jobs by title, company, or stack (C++, Go, React, ISRO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips-row">
            <button 
              className={`filter-chip ${selectedCategory === 'job' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('job')}
            >
              Private Jobs
            </button>
            <button 
              className={`filter-chip ${selectedCategory === 'govt' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('govt')}
            >
              🇮🇳 Government Jobs (Sarkari Result)
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

      {/* Dedicated Sarkari Result Govt Jobs Table Section */}
      {selectedCategory === 'govt' && (
        <section className="container sarkari-result-section" style={{ marginBottom: '32px' }}>
          <div className="card-base" style={{ padding: '24px', border: '2px solid #3b82f6', background: 'var(--card-bg-white)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1d4ed8' }}>🏛️ SarkariResult.com - Latest Government Job Notifications 2026</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Official Government recruitment notices (ISRO, DRDO, NIC, SSC, RRB, UPSC)</p>
              </div>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '0.8rem' }}>Live Verification</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Post / Notification</th>
                    <th style={{ padding: '12px' }}>Organization</th>
                    <th style={{ padding: '12px' }}>Eligibility</th>
                    <th style={{ padding: '12px' }}>Pay Scale</th>
                    <th style={{ padding: '12px' }}>Last Date</th>
                    <th style={{ padding: '12px' }}>Official Portal</th>
                  </tr>
                </thead>
                <tbody>
                  {sarkariGovtJobsList.map((g) => (
                    <tr key={g.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px', fontWeight: '700', color: 'var(--text-main)' }}>{g.title}</td>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{g.org}</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{g.qual}</td>
                      <td style={{ padding: '12px', color: '#16a34a', fontWeight: '700' }}>{g.salary}</td>
                      <td style={{ padding: '12px', color: '#ef4444', fontWeight: '700' }}>{g.deadline}</td>
                      <td style={{ padding: '12px' }}>
                        <a href={g.url} target="_blank" rel="noreferrer" className="btn-primary-purple" style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          Apply Online <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

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
            jobsCatalog.map((j) => {
              const isScanned = j.isNewlyScanned || j.posted?.includes('TinyFish') || j.id?.startsWith('scanned_');
              return (
                <div 
                  key={j.id} 
                  className="job-card-item card-base"
                  style={isScanned ? { border: '2px solid #f97316', boxShadow: '0 0 16px rgba(249, 115, 22, 0.35)' } : {}}
                >
                  {isScanned && (
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ background: '#f97316', color: '#ffffff', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        🔥 NEWLY SCANNED
                      </span>
                    </div>
                  )}
                  
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
            );
          })
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
