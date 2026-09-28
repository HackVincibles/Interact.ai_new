import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MyMockInterviews({ currentUser, onNavigate }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('interact_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        // Pass userId in query if token auth isn't fully set up for students
        const userId = currentUser?.id || 1; 
        const response = await fetch(`http://localhost:5000/api/interviews/history?userId=${userId}`, {
          headers
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch interview history');
        }
        
        const data = await response.json();
        if (data.success) {
          setHistory(data.history || []);
        } else {
          throw new Error(data.message || 'Error fetching data');
        }
      } catch (err) {
        console.error('Error fetching interviews:', err);
        // Fallback to local storage or dummy data if backend fails/unreachable
        const saved = localStorage.getItem(`interact_mock_interviews_${currentUser?.email}`);
        if (saved) {
          setHistory(JSON.parse(saved));
        } else {
          setError('Could not load interview history. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  if (loading) return <div className="loading-state">Loading your interviews...</div>;

  return (
    <div className="profile-section-card card-base">
      <div className="section-card-header">
        <div className="title-with-icon">
          <Award size={24} className="card-icon orange" />
          <h2>My Mock Interviews</h2>
        </div>
      </div>

      {error ? (
        <div className="error-state" style={{ padding: '20px', color: '#e11d48', background: 'rgba(225, 29, 72, 0.1)', borderRadius: '8px' }}>
          <AlertCircle size={20} style={{ marginBottom: '8px' }} />
          <p>{error}</p>
        </div>
      ) : history.length > 0 ? (
        <div className="interviews-list">
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Recent Interviews</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {history.map(item => {
              const score = item.score || 0;
              const isGood = score >= 70;
              const isAvg = score >= 50 && score < 70;
              
              return (
                <div key={item.id} style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>{item.target_role || item.domain || 'Technical Interview'}</h4>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span>Round: {item.round_type || 'General'}</span>
                      <span>•</span>
                      <span>Mode: {item.practice_mode || 'Full'}</span>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold', 
                      color: isGood ? '#16a34a' : isAvg ? '#f59e0b' : '#e11d48' 
                    }}>
                      Score: {score}%
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="empty-profile-block" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Award size={48} color="var(--border-light)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>You haven't taken any mock interviews yet.</h3>
          <p className="empty-block-text" style={{ marginBottom: '24px' }}>Practice with our AI simulator to improve your skills and get feedback.</p>
          <button className="btn-primary-purple" style={{ margin: '0 auto' }} onClick={() => onNavigate('mock-interviews')}>
            Start an Interview
          </button>
        </div>
      )}
    </div>
  );
}
