import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, Clock } from 'lucide-react';

export default function MyCourses({ currentUser, onNavigate }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching enrolled courses
    setTimeout(() => {
      const saved = localStorage.getItem(`interact_my_courses_${currentUser?.email}`);
      if (saved) {
        setCourses(JSON.parse(saved));
      } else {
        setCourses([]);
      }
      setLoading(false);
    }, 500);
  }, [currentUser]);

  if (loading) return <div className="loading-state">Loading your courses...</div>;

  return (
    <div className="profile-section-card card-base">
      <div className="section-card-header">
        <div className="title-with-icon">
          <BookOpen size={24} className="card-icon blue" />
          <h2>My Courses</h2>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {courses.map(course => (
            <div key={course.id} className="course-card" style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-subtle)' }}>
              <h4 style={{ marginBottom: '8px' }}>{course.title}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                <Clock size={14} /> <span>Last active: {course.lastActive}</span>
              </div>
              
              <div className="progress-section" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span>Progress</span>
                  <strong>{course.progress}%</strong>
                </div>
                <div style={{ width: '100%', background: 'var(--border-light)', height: '6px', borderRadius: '3px' }}>
                  <div style={{ width: `${course.progress}%`, background: '#0284c7', height: '100%', borderRadius: '3px' }}></div>
                </div>
              </div>
              
              <button className="btn-primary-purple" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', padding: '8px' }}>
                <PlayCircle size={16} /> Continue Learning
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-profile-block" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <BookOpen size={48} color="var(--border-light)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>You haven't enrolled in any courses yet.</h3>
          <p className="empty-block-text" style={{ marginBottom: '24px' }}>Explore our catalog to start building your skills.</p>
          <button className="btn-primary-purple" style={{ margin: '0 auto' }} onClick={() => onNavigate('courses')}>
            Discover Courses
          </button>
        </div>
      )}
    </div>
  );
}
