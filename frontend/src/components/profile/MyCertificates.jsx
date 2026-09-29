import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Download, Share2 } from 'lucide-react';

import API_BASE_URL from '../../config/api';

export default function MyCertificates({ currentUser }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('interact_token');
        if (token) {
          const res = await fetch(`${API_BASE_URL}/api/certificates/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setCertificates(data.certificates || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, [currentUser]);

  const handleShare = async (cert) => {
    const url = `${window.location.origin}/verify/${cert.verification_id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: cert.title,
          text: `Check out my certificate for: ${cert.title}`,
          url: url
        });
      } catch (err) {
        console.warn('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <div className="loading-state">Loading your certificates...</div>;

  return (
    <div className="profile-section-card card-base">
      <div className="section-card-header">
        <div className="title-with-icon">
          <ShieldCheck size={24} className="card-icon orange" />
          <h2>My Certificates</h2>
        </div>
      </div>

      {certificates.length > 0 ? (
        <div className="certificates-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {certificates.map(cert => (
            <div key={cert.id} style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-subtle)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
                <Award size={100} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.15)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={24} />
                </div>
                <div style={{ zIndex: 1 }}>
                  <h4 style={{ marginBottom: '4px', fontSize: '1.05rem' }}>{cert.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cert.achievement}</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', zIndex: 1 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Date: {new Date(cert.issued_at).toLocaleDateString()}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <button onClick={() => handleShare(cert)} className="btn-outline-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                     <Share2 size={14} /> Share
                   </button>
                   <a href={`/verify/${cert.verification_id}`} target="_blank" rel="noopener noreferrer" className="btn-primary-purple" style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>
                     View Certificate
                   </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-profile-block" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <ShieldCheck size={48} color="var(--border-light)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>No certificates earned yet.</h3>
          <p className="empty-block-text" style={{ marginBottom: '24px' }}>Complete an AI Interview or Assessment to earn your first certificate.</p>
        </div>
      )}

      <div className="section-card-header" style={{ marginTop: '40px' }}>
        <div className="title-with-icon">
          <Award size={24} className="card-icon" style={{ color: '#8b5cf6' }} />
          <h2>Certificates to Earn</h2>
        </div>
      </div>
      
      <div className="certificates-to-earn-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginTop: '16px' }}>
         <div style={{ padding: '16px', border: '1px dashed var(--border-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <ShieldCheck size={20} color="var(--text-muted)" />
            </div>
            <div>
               <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: 'var(--text-main)' }}>AI Mock Interview Completion</h4>
               <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete a full AI Mock Interview session</p>
            </div>
         </div>
         
         <div style={{ padding: '16px', border: '1px dashed var(--border-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Award size={20} color="var(--text-muted)" />
            </div>
            <div>
               <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: 'var(--text-main)' }}>Outstanding Interview Performance</h4>
               <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Score 75% or higher on an AI Mock Interview evaluation</p>
            </div>
         </div>

         <div style={{ padding: '16px', border: '1px dashed var(--border-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <ShieldCheck size={20} color="var(--text-muted)" />
            </div>
            <div>
               <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: 'var(--text-main)' }}>Group Discussion Completion</h4>
               <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete an AI-driven Group Discussion</p>
            </div>
         </div>

         <div style={{ padding: '16px', border: '1px dashed var(--border-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <ShieldCheck size={20} color="var(--text-muted)" />
            </div>
            <div>
               <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: 'var(--text-main)' }}>Coding Assessment Completion</h4>
               <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete a rigorous AI-driven coding assessment</p>
            </div>
         </div>
      </div>
    </div>
  );
}
