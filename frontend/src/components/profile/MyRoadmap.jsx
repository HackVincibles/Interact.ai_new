import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, ChevronRight, Plus } from 'lucide-react';

export default function MyRoadmap({ currentUser }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching roadmap
    setTimeout(() => {
      const saved = localStorage.getItem(`interact_roadmap_${currentUser?.email}`);
      if (saved) {
        setRoadmap(JSON.parse(saved));
      } else {
        setRoadmap(null);
      }
      setLoading(false);
    }, 500);
  }, [currentUser]);

  const handleCreateRoadmap = () => {
    const newRoadmap = {
      goal: 'Software Development Engineer',
      progress: 30,
      milestones: [
        { id: 1, title: 'Learn Data Structures', status: 'completed' },
        { id: 2, title: 'Master React & Next.js', status: 'in-progress' },
        { id: 3, title: 'Build 3 Full-Stack Projects', status: 'upcoming' },
        { id: 4, title: 'Prepare for System Design', status: 'upcoming' },
      ],
      skills: ['Algorithms', 'JavaScript', 'System Design']
    };
    setRoadmap(newRoadmap);
    localStorage.setItem(`interact_roadmap_${currentUser?.email}`, JSON.stringify(newRoadmap));
  };

  if (loading) return <div className="loading-state">Loading your roadmap...</div>;

  return (
    <div className="profile-section-card card-base">
      <div className="section-card-header">
        <div className="title-with-icon">
          <Target size={24} className="card-icon purple" />
          <h2>My Roadmap</h2>
        </div>
      </div>

      {roadmap ? (
        <div className="roadmap-content">
          <div className="roadmap-header">
            <h3>Target: {roadmap.goal}</h3>
            <div className="progress-bar-container" style={{ marginTop: '10px', background: 'var(--bg-subtle)', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${roadmap.progress}%`, background: 'var(--primary-purple)', height: '100%' }}></div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>{roadmap.progress}% Completed</p>
          </div>

          <div className="roadmap-milestones" style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Milestones</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {roadmap.milestones.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  {m.status === 'completed' ? <CheckCircle2 size={20} color="#16a34a" /> : 
                   m.status === 'in-progress' ? <div style={{width:'20px', height:'20px', borderRadius:'50%', border:'2px solid var(--primary-purple)'}}></div> :
                   <div style={{width:'20px', height:'20px', borderRadius:'50%', border:'2px solid var(--border-light)'}}></div>}
                  <span style={{flex: 1, color: m.status === 'upcoming' ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: m.status === 'in-progress' ? '700' : '400'}}>
                    {m.title}
                  </span>
                  {m.status === 'in-progress' && <span style={{fontSize:'0.7rem', background:'var(--primary-purple)', color:'#fff', padding:'2px 8px', borderRadius:'12px'}}>Current</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-profile-block" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Target size={48} color="var(--border-light)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>Your roadmap hasn't been created yet.</h3>
          <p className="empty-block-text" style={{ marginBottom: '24px' }}>Define your career goal and let us build a personalized learning path for you.</p>
          <button className="btn-primary-purple add-block-btn" style={{ maxWidth: '200px', margin: '0 auto' }} onClick={handleCreateRoadmap}>
            <Plus size={16} />
            <span>Create Roadmap</span>
          </button>
        </div>
      )}
    </div>
  );
}
