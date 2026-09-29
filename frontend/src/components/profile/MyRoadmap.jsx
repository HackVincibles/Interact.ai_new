import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, ChevronRight, Plus } from 'lucide-react';

export default function MyRoadmap({ currentUser }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'saved'
  const [savedCareerPaths, setSavedCareerPaths] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const saved = localStorage.getItem(`interact_roadmap_${currentUser?.email}`);
      if (saved) {
        setRoadmap(JSON.parse(saved));
      } else {
        setRoadmap(null);
      }
      try {
        const paths = localStorage.getItem('interact_saved_career_paths');
        if (paths) setSavedCareerPaths(JSON.parse(paths));
      } catch (e) {}
      setLoading(false);
    }, 300);
  }, [currentUser]);

  const handleCreateRoadmap = () => {
    const newRoadmap = {
      goal: 'Software Development Engineer (Full Stack & Systems)',
      progress: 25,
      milestones: [
        { id: 1, title: 'Core Programming & Language Fundamentals (Python/JavaScript/C++)', status: 'completed' },
        { id: 2, title: 'Advanced Data Structures (Trees, Graphs, Tries & Heaps)', status: 'completed' },
        { id: 3, title: 'Algorithms & Dynamic Programming Optimization', status: 'completed' },
        { id: 4, title: 'Object-Oriented Design & Clean Architecture Patterns', status: 'in-progress' },
        { id: 5, title: 'Relational & NoSQL Database Optimization (PostgreSQL & Redis)', status: 'upcoming' },
        { id: 6, title: 'Microservices REST APIs & Real-time WebSockets', status: 'upcoming' },
        { id: 7, title: 'Frontend Frameworks & State Management (React & Next.js)', status: 'upcoming' },
        { id: 8, title: 'System Design & High-Scale Distributed Caching', status: 'upcoming' },
        { id: 9, title: 'Containerization & Cloud Deployment (Docker & AWS)', status: 'upcoming' },
        { id: 10, title: 'CI/CD Pipelines & Automated End-to-End Testing Suites', status: 'upcoming' },
        { id: 11, title: 'ATS Resume Optimization & Production Portfolio Publishing', status: 'upcoming' },
        { id: 12, title: 'Live AI Mock Interview Drills & Behavioral System Rounds', status: 'upcoming' },
      ],
      skills: ['Algorithms', 'System Design', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Redis']
    };
    setRoadmap(newRoadmap);
    localStorage.setItem(`interact_roadmap_${currentUser?.email}`, JSON.stringify(newRoadmap));
  };

  const toggleMilestone = (id) => {
    if (!roadmap) return;
    const updatedMilestones = roadmap.milestones.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'completed' ? 'upcoming' : m.status === 'upcoming' ? 'in-progress' : 'completed';
        return { ...m, status: nextStatus };
      }
      return m;
    });
    const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
    const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
    const updatedRoadmap = { ...roadmap, milestones: updatedMilestones, progress: newProgress };
    setRoadmap(updatedRoadmap);
    localStorage.setItem(`interact_roadmap_${currentUser?.email}`, JSON.stringify(updatedRoadmap));
  };

  if (loading) return <div className="loading-state">Loading your roadmap...</div>;

  return (
    <div className="profile-section-card card-base">
      <div className="section-card-header">
        <div className="title-with-icon">
          <Target size={24} className="card-icon purple" />
          <div>
            <h2>My Interactive Career Roadmap</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--primary-purple)', fontWeight: '600', marginTop: '2px' }}>
              ⚡ Based on your live learning activity, resume score, and real-time skill telemetry
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button 
            onClick={() => setActiveTab('active')}
            style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-light)', background: activeTab === 'active' ? 'var(--primary-purple)' : 'transparent', color: activeTab === 'active' ? '#fff' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Active Roadmap
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-light)', background: activeTab === 'saved' ? 'var(--primary-purple)' : 'transparent', color: activeTab === 'saved' ? '#fff' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Saved Career Paths ({savedCareerPaths.length})
          </button>
        </div>
      </div>

      {activeTab === 'active' ? (
        roadmap ? (
          <div className="roadmap-content">
            <div className="roadmap-header">
              <h3>Target: {roadmap.goal}</h3>
              <div className="progress-bar-container" style={{ marginTop: '10px', background: 'var(--bg-subtle)', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${roadmap.progress}%`, background: 'var(--primary-purple)', height: '100%', transition: 'width 0.3s ease' }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>{roadmap.progress}% Completed ({roadmap.milestones.filter(m=>m.status==='completed').length} of {roadmap.milestones.length} Tasks)</p>
            </div>

            <div className="roadmap-milestones" style={{ marginTop: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Learning Milestones & Tasks (12 Real-Time Stages)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {roadmap.milestones.map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => toggleMilestone(m.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--border-light)', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    {m.status === 'completed' ? <CheckCircle2 size={20} color="#16a34a" /> : 
                     m.status === 'in-progress' ? <div style={{width:'20px', height:'20px', borderRadius:'50%', border:'2px solid var(--primary-purple)', background: 'rgba(168,85,247,0.2)'}}></div> :
                     <div style={{width:'20px', height:'20px', borderRadius:'50%', border:'2px solid var(--border-light)'}}></div>}
                    <span style={{flex: 1, color: m.status === 'upcoming' ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: m.status === 'in-progress' ? '700' : m.status === 'completed' ? '600' : '400', textDecoration: m.status === 'completed' ? 'line-through' : 'none'}}>
                      {m.id}. {m.title}
                    </span>
                    {m.status === 'in-progress' && <span style={{fontSize:'0.7rem', background:'var(--primary-purple)', color:'#fff', padding:'2px 8px', borderRadius:'12px', fontWeight: '700'}}>Active</span>}
                    {m.status === 'completed' && <span style={{fontSize:'0.7rem', background:'#16a34a', color:'#fff', padding:'2px 8px', borderRadius:'12px', fontWeight: '700'}}>Done</span>}
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
        )
      ) : (
        /* Saved Career Paths Tab */
        <div className="saved-career-paths-list" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {savedCareerPaths.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No saved career paths yet. Visit Career Paths &rarr; AI Career Counselor to generate and save personalized roadmaps!
            </div>
          ) : (
            savedCareerPaths.map(p => (
              <div key={p.id} style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.72rem', background: 'var(--primary-purple)', color: '#fff', padding: '2px 8px', borderRadius: '8px', fontWeight: '700' }}>{p.matchScore} Match</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '6px 0 4px 0' }}>{p.title}</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{p.reasoning}</p>
                <div style={{ background: 'var(--card-bg-white)', padding: '10px', borderRadius: '6px' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Roadmap Steps:</p>
                  <ol style={{ paddingLeft: '18px', fontSize: '0.8rem', margin: 0 }}>
                    {p.roadmap?.map((step, idx) => <li key={idx}>{step}</li>)}
                  </ol>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
