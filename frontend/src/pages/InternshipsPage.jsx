import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  GraduationCap, 
  ExternalLink, 
  ShieldCheck, 
  X, 
  Zap 
} from 'lucide-react';
import WebScannerCard from '../components/WebScannerCard';
import SystemDiagnosticsModal from '../components/SystemDiagnosticsModal';
import './InternshipsPage.css';

export default function InternshipsPage({ currentUser, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [stipendFilter, setStipendFilter] = useState('all');
  const [internshipsCatalog, setInternshipsCatalog] = useState([]);
  const [sessionStats, setSessionStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeModalInternship, setActiveModalInternship] = useState(null);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/jobs?category=internship&query=${encodeURIComponent(searchQuery)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setInternshipsCatalog(data.jobs || []);
        if (data.sessionStats) {
          setSessionStats(data.sessionStats);
        }
      }
    } catch (err) {
      console.warn('Internships API fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [searchQuery]);

  const handleScanNewItem = (scannedItems) => {
    if (Array.isArray(scannedItems) && scannedItems.length > 0) {
      setInternshipsCatalog((prev) => [...scannedItems, ...prev]);
    } else if (scannedItems && typeof scannedItems === 'object') {
      setInternshipsCatalog((prev) => [scannedItems, ...prev]);
    } else {
      fetchInternships();
    }
  };

  const filteredInternships = internshipsCatalog.filter((item) => {
    // Requirement 23: Strictly show ONLY internships or apprenticeships (no full-time jobs)
    const isInternshipOrApprenticeship = 
      item.category === 'internship' || 
      item.title?.toLowerCase().includes('intern') || 
      item.title?.toLowerCase().includes('apprentice');
    
    if (!isInternshipOrApprenticeship) return false;

    if (stipendFilter === 'high') {
      return item.stipend?.includes('1,') || item.stipend?.includes('80') || item.stipend?.includes('90');
    }
    return true;
  });

  return (
    <div className="internships-page-root animate-fade-in">
      
      {/* Hero Header */}
      <section className="internships-hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">
              <GraduationCap size={14} /> CAMPUS TO CORPORATE INTERNSHIP PORTAL 2026 / 2027
            </span>
            <h1 className="hero-title">
              Verified Tech & AI Internships <br />
              <span className="purple-gradient-text">Top Companies & Research Labs</span>
            </h1>
            <p className="hero-sub">
              Live web intelligence indexed from Google, Amazon, Microsoft & high-growth tech startups. 
              Find 3-6 month internships with stipend up to ₹1.2 Lakh/month.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Real-time Web Scanner Component (internships.dev style) */}
        <WebScannerCard 
          category="internship"
          onScanComplete={handleScanNewItem}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          sessionStats={sessionStats}
        />

        {/* Search & Stipend Filter Bar */}
        <div className="search-filter-card card-base">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              placeholder="Search internships by role, company, or skills (C++, React, PyTorch, AWS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips-row">
            <button 
              className={`filter-chip ${stipendFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStipendFilter('all')}
            >
              All Openings
            </button>
            <button 
              className={`filter-chip ${stipendFilter === 'high' ? 'active' : ''}`}
              onClick={() => setStipendFilter('high')}
            >
              High Stipend (≥ ₹80,000/mo)
            </button>
            <button 
              className="filter-chip diag-chip"
              onClick={() => setIsDiagnosticsOpen(true)}
            >
              <ShieldCheck size={14} className="green" /> Check AI Status
            </button>
          </div>
        </div>

        {/* Internships Grid */}
        <div className="internships-cards-grid">
          {loading ? (
            <div className="loading-state card-base">
              <Zap size={24} className="spin yellow" />
              <p>Scanning career portals for live internship openings...</p>
            </div>
          ) : filteredInternships.length === 0 ? (
            <div className="empty-state card-base">
              <p>No internships found matching your criteria. Try running the Web Scanner!</p>
            </div>
          ) : (
            filteredInternships.map((item) => {
              const isScanned = item.isNewlyScanned || item.posted?.includes('TinyFish') || item.id?.startsWith('scanned_');
              return (
                <div 
                  key={item.id} 
                  className="internship-item-card card-base"
                  style={isScanned ? { border: '2px solid #f97316', boxShadow: '0 0 16px rgba(249, 115, 22, 0.35)' } : {}}
                >
                  {isScanned && (
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ background: '#f97316', color: '#ffffff', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        🔥 NEWLY SCANNED
                      </span>
                    </div>
                  )}
                  
                  <div className="card-top-info">
                  <div className="company-logo-box">
                    <img src={item.logo} alt={item.company} />
                  </div>
                  <div className="title-box">
                    <h3 className="internship-title">{item.title}</h3>
                    <p className="internship-company">{item.company}</p>
                  </div>
                </div>

                <div className="card-meta-pills">
                  <span className="meta-pill"><MapPin size={13} /> {item.location}</span>
                  <span className="meta-pill stipend"><DollarSign size={13} /> {item.stipend}</span>
                  <span className="meta-pill"><Clock size={13} /> {item.duration}</span>
                  {item.eligibleBatch && <span className="meta-pill batch"><GraduationCap size={13} /> {item.eligibleBatch}</span>}
                  {item.deadline && <span className="meta-pill deadline">Deadline: {item.deadline}</span>}
                </div>

                <p className="internship-desc">{item.desc}</p>

                <div className="skills-tags-row">
                  {item.skills?.map((skill, idx) => (
                    <span key={idx} className="skill-pill">{skill}</span>
                  ))}
                </div>

                <div className="card-footer-actions">
                  <button className="btn-outline-secondary" onClick={() => setActiveModalInternship(item)}>
                    View Details
                  </button>
                  <a 
                    href={item.officialApplyUrl || '#'} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-primary-purple apply-link-btn"
                  >
                    <span>Apply Official Portal</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

              </div>
            );
          })
          )}
        </div>
      </div>

      {/* Modal View Details */}
      {activeModalInternship && (
        <div className="modal-backdrop-overlay" onClick={() => setActiveModalInternship(null)}>
          <div className="modal-box card-base" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>{activeModalInternship.title}</h3>
              <button className="modal-close" onClick={() => setActiveModalInternship(null)}><X size={18} /></button>
            </div>
            <p className="modal-company"><strong>{activeModalInternship.company}</strong> • {activeModalInternship.location}</p>
            <div className="modal-pills">
              <span>Stipend: <strong>{activeModalInternship.stipend}</strong></span>
              <span>Duration: <strong>{activeModalInternship.duration}</strong></span>
              <span>Source: <strong>{activeModalInternship.sourceProvider || 'TinyFish Scraper'}</strong></span>
            </div>
            <p className="modal-desc">{activeModalInternship.desc}</p>
            <div className="modal-actions-row">
              <button className="btn-outline-secondary" onClick={() => setActiveModalInternship(null)}>Close</button>
              <a href={activeModalInternship.officialApplyUrl} target="_blank" rel="noreferrer" className="btn-primary-purple">
                Apply on Official Site <ExternalLink size={14} />
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
