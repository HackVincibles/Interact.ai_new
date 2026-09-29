import React, { useState } from 'react';
import { 
  Radio, 
  Zap, 
  Bell, 
  RotateCcw, 
  Activity, 
  CheckCircle2, 
  ShieldCheck, 
  Play, 
  Pause,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import API_BASE_URL from '../config/api';
import './WebScannerCard.css';

export default function WebScannerCard({ 
  category = 'all', 
  onScanComplete, 
  onOpenDiagnostics,
  sessionStats = {} 
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { addNotification } = useNotifications();

  const handleRunScan = async () => {
    try {
      setIsScanning(true);
      setLogs((prev) => [`[${new Date().toLocaleTimeString()}] Triggering TinyFish & Firecrawl web scanner...`, ...prev]);

      const res = await fetch(`${API_BASE_URL}/api/jobs/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          searchQuery: category === 'internship' ? 'software engineering internship 2026 India' : 'software engineer SDE 1 job India'
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Push the backend logs directly (newest at top)
        if (data.logs) {
          const reversedLogs = [...data.logs].reverse();
          setLogs((prev) => [...reversedLogs, ...prev]);
        }

        // Format the DB records to match the frontend UI schema
        if (onScanComplete && data.scannedJobs && data.scannedJobs.length > 0) {
          
          if (notificationsEnabled) {
            addNotification({
              title: `New ${category === 'internship' ? 'Internship' : 'Job'} Matches`,
              message: `Scanner discovered ${data.scannedJobs.length} new ${category === 'internship' ? 'internships' : 'jobs'} matching your profile.`,
              category: category === 'internship' ? 'internships' : 'jobs',
              actionUrl: category === 'internship' ? 'internships' : 'jobs',
              actionLabel: 'Explore',
              priority: 'normal'
            });
          }

          // Pass newly scanned items up to parent page to append to card grid
          onScanComplete(data.scannedJobs); 
        } else if (onScanComplete) {
          onScanComplete([]); 
        }
      }
    } catch (err) {
      setLogs((prev) => [`[${new Date().toLocaleTimeString()}] Scanner failed: ${err.message}`, ...prev]);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 1200);
    }
  };

  const foundCount = sessionStats.totalJobsFound ?? 14;
  const newLastHour = sessionStats.newLastHour ?? 6;
  const uptime = sessionStats.uptime ?? '99.9%';

  return (
    <div className="web-scanner-card card-base">
      
      <div className="scanner-top-row">
        <div className="scanner-breadcrumbs">
          <span className="sc-path">~/scanner</span>
          <span className="sc-slash">/</span>
          <span className="sc-title">{category === 'internship' ? 'Internship Scanner' : 'Job Scanner'}</span>
        </div>

        <div className="scanner-top-actions">
          <button 
            className="btn-outline-secondary diag-trigger-btn"
            onClick={onOpenDiagnostics}
          >
            <ShieldCheck size={14} className="green" />
            <span>AI Status Diagnostics</span>
          </button>

          <button 
            className={`btn-outline-secondary notif-toggle ${notificationsEnabled ? 'active' : ''}`}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <Bell size={14} />
            <span>{notificationsEnabled ? 'Notifications • On' : 'Notifications • Off'}</span>
          </button>
        </div>
      </div>

      <div className="scanner-main-layout">
        
        {/* Left Scanner Hero Control */}
        <div className="scanner-hero-box">
          
          <div className="scanner-status-pill">
            <span className={`pulse-indicator ${isScanning ? 'scanning' : 'active'}`}></span>
            <span className="status-label">{isScanning ? 'SCANNING THE WEB...' : 'STREAM • Scanner Ready'}</span>
          </div>

          <h2 className="scanner-hero-title">
            Scanning the <span className="highlight-gold">web</span>
          </h2>
          <p className="scanner-hero-desc">
            Real-time {category === 'internship' ? 'internship' : 'job'} discovery across thousands of official company career pages. 
            You'll get live updates the moment a listing goes live via TinyFish & Firecrawl.
          </p>

          <div className="scanner-action-row">
            <button 
              className={`btn-scanner-gold ${isScanning ? 'loading' : ''}`}
              onClick={handleRunScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Zap size={16} className="spin" />
                  <span>Indexing TinyFish & Gemini AI...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Start Live Web Scan</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Stats Metrics */}
        <div className="scanner-stats-grid">
          
          <div className="stat-box">
            <span className="stat-label">{category === 'internship' ? 'INTERNSHIPS FOUND' : 'JOBS FOUND'}</span>
            <div className="stat-value-row">
              <span className="stat-num">{foundCount}</span>
              <span className="stat-sub font-muted">this session</span>
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-label">NEW • LAST HOUR</span>
            <div className="stat-value-row">
              <span className="stat-num gold">{newLastHour}</span>
              <span className="stat-sub font-muted">matched your profile</span>
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-label">SYSTEM UPTIME</span>
            <div className="stat-value-row">
              <span className="stat-num green">{uptime}</span>
              <span className="stat-sub green">no errors</span>
            </div>
          </div>

        </div>

      </div>

      {/* Live Stream Terminal Logs */}
      {logs.length > 0 && (
        <div className="scanner-logs-terminal">
          <div className="term-header">
            <span>LIVE DISCOVERY STREAM LOGS (TINYFISH & FIRECRAWL)</span>
            <button className="term-clear" onClick={() => setLogs([])}>Clear feed</button>
          </div>
          <div className="term-body">
            {logs.slice(0, 5).map((log, idx) => (
              <div key={idx} className="log-line">
                <span className="log-prompt">➔</span> {log}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
