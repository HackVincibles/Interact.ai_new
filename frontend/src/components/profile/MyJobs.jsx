import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Building, Calendar } from 'lucide-react';

export default function MyJobs({ currentUser, onNavigate }) {
  const [jobs, setJobs] = useState({ saved: [], applied: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const savedData = localStorage.getItem(`interact_my_jobs_${currentUser?.email}`);
      if (savedData) {
        setJobs(JSON.parse(savedData));
      } else {
        setJobs({ saved: [], applied: [] });
      }
      setLoading(false);
    }, 500);
  }, [currentUser]);

  if (loading) return <div className="loading-state">Loading your jobs...</div>;

  const hasData = jobs.saved.length > 0 || jobs.applied.length > 0;

  return (
    <div className="profile-section-card card-base">
      <div className="section-card-header">
        <div className="title-with-icon">
          <Briefcase size={24} className="card-icon blue" />
          <h2>My Jobs</h2>
        </div>
      </div>

      {hasData ? (
        <div className="jobs-content">
          {jobs.applied.length > 0 && (
            <div className="job-group" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Applied</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {jobs.applied.map(item => (
                  <div key={item.id} style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-subtle)' }}>
                    <h4 style={{ marginBottom: '4px' }}>{item.role}</h4>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building size={14}/> {item.company}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {item.location}</span>
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.15)', color: '#16a34a', fontWeight: 'bold' }}>
                        {item.status || 'Under Review'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Applied on {item.appliedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {jobs.saved.length > 0 && (
            <div className="job-group">
              <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Saved</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {jobs.saved.map(item => (
                  <div key={item.id} style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-subtle)' }}>
                    <h4 style={{ marginBottom: '4px' }}>{item.role}</h4>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building size={14}/> {item.company}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {item.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-profile-block" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Briefcase size={48} color="var(--border-light)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>You haven't tracked any jobs.</h3>
          <p className="empty-block-text" style={{ marginBottom: '24px' }}>Save or apply to full-time jobs to track your progress here.</p>
          <button className="btn-primary-purple" style={{ margin: '0 auto' }} onClick={() => onNavigate('jobs')}>
            Find Jobs
          </button>
        </div>
      )}
    </div>
  );
}
