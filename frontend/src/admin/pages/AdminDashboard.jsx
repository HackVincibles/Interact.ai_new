import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('interact_admin_token');
        const res = await fetch('http://localhost:5000/api/admin/dashboard-metrics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
        } else {
          setError(data.message || 'Failed to fetch metrics');
        }
      } catch (err) {
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard metrics...</div>;
  if (error) return <div className="admin-error-box">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-metrics-grid">
        <div className="admin-stat-card">
          <div className="stat-value">{metrics.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-value">{metrics.interviewsCompleted}</div>
          <div className="stat-label">Interviews Completed</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-value">{metrics.activeCourses}</div>
          <div className="stat-label">Active Courses</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-value">{metrics.activeJobs}</div>
          <div className="stat-label">Jobs/Internships</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-value">{metrics.averageScore}/100</div>
          <div className="stat-label">Avg Interview Score</div>
        </div>
      </div>
      
      <div className="admin-dashboard-widgets">
        <div className="admin-widget">
          <h3>Quick Actions</h3>
          <div className="quick-actions-list">
            <button>Create New Course</button>
            <button>Add Question Bank</button>
            <button>Post Announcement</button>
          </div>
        </div>
        <div className="admin-widget">
          <h3>Recent Activity</h3>
          <p className="empty-text">Activity logging is running. No recent actions.</p>
        </div>
      </div>
    </div>
  );
}
