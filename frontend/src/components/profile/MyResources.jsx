import React, { useState, useEffect } from 'react';
import { FileText, Bookmark, ExternalLink } from 'lucide-react';

export default function MyResources({ currentUser, onNavigate }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const saved = localStorage.getItem(`interact_my_resources_${currentUser?.email}`);
      if (saved) {
        setResources(JSON.parse(saved));
      } else {
        setResources([]);
      }
      setLoading(false);
    }, 500);
  }, [currentUser]);

  if (loading) return <div className="loading-state">Loading your resources...</div>;

  return (
    <div className="profile-section-card card-base">
      <div className="section-card-header">
        <div className="title-with-icon">
          <FileText size={24} className="card-icon pink" />
          <h2>My Resources</h2>
        </div>
      </div>

      {resources.length > 0 ? (
        <div className="resources-list" style={{ display: 'grid', gap: '16px' }}>
          {resources.map(item => (
            <div key={item.id} style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.15)', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bookmark size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.type} • Saved on {item.savedDate}</p>
              </div>
              <a href={item.url || '#'} className="btn-outline-secondary" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                View <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-profile-block" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Bookmark size={48} color="var(--border-light)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>You haven't saved any resources yet.</h3>
          <p className="empty-block-text" style={{ marginBottom: '24px' }}>Bookmark guides, templates, and learning materials to access them quickly here.</p>
          <button className="btn-primary-purple" style={{ margin: '0 auto' }} onClick={() => onNavigate('resources')}>
            Discover Resources
          </button>
        </div>
      )}
    </div>
  );
}
