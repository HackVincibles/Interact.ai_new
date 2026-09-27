import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './AdminApp.css';

import AdminStudents from './pages/AdminStudents';
import AdminInterviews from './pages/AdminInterviews';
import AdminCourses from './pages/AdminCourses';
import AdminQuestions from './pages/AdminQuestions';
import AdminCareerPaths from './pages/AdminCareerPaths';
import AdminJobs from './pages/AdminJobs';
import AdminResources from './pages/AdminResources';
import AdminAnnouncements from './pages/AdminAnnouncements';
import AdminActivity from './pages/AdminActivity';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('interact_admin_token') ? true : false;
  });

  const handleLoginSuccess = (token) => {
    localStorage.setItem('interact_admin_token', token);
    setIsAdminLoggedIn(true);
    setActiveTab('dashboard');
    if (window.location.pathname === '/admin' || window.location.pathname === '/admin/login') {
      window.history.pushState({}, '', '/admin/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('interact_admin_token');
    setIsAdminLoggedIn(false);
    window.history.pushState({}, '', '/admin/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.history.pushState({}, '', `/admin/${tab}`);
  };

  if (!isAdminLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="admin-app-root">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="logo-text">interact<span className="purple">.ai</span> <span className="badge">Admin</span></span>
        </div>
        <nav className="admin-nav-menu">
          <p className="nav-group-title">MAIN</p>
          <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabChange('dashboard')}>Dashboard</button>
          <p className="nav-group-title">MANAGEMENT</p>
          <button className={`admin-nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => handleTabChange('students')}>Students</button>
          <button className={`admin-nav-item ${activeTab === 'interviews' ? 'active' : ''}`} onClick={() => handleTabChange('interviews')}>Interviews</button>
          <button className={`admin-nav-item ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => handleTabChange('questions')}>Question Bank</button>
          <p className="nav-group-title">CONTENT</p>
          <button className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => handleTabChange('courses')}>Courses</button>
          <button className={`admin-nav-item ${activeTab === 'career-paths' ? 'active' : ''}`} onClick={() => handleTabChange('career-paths')}>Career Paths</button>
          <button className={`admin-nav-item ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => handleTabChange('jobs')}>Jobs & Internships</button>
          <button className={`admin-nav-item ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => handleTabChange('resources')}>Resources</button>
          <button className={`admin-nav-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => handleTabChange('announcements')}>Announcements</button>
          <p className="nav-group-title">SYSTEM</p>
          <button className={`admin-nav-item ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => handleTabChange('activity')}>Admin Activity</button>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-nav-item logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>
      
      <main className="admin-main-content">
        <header className="admin-header">
          <div className="admin-header-title">
            <h1>{activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h1>
          </div>
          <div className="admin-header-user">
            <span style={{marginRight: '15px', color: '#a855f7'}}>🔔</span>
            <span style={{fontWeight: 600}}>Admin ▼</span>
          </div>
        </header>
        <div className="admin-page-container">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'students' && <AdminStudents />}
          {activeTab === 'interviews' && <AdminInterviews />}
          {activeTab === 'questions' && <AdminQuestions />}
          {activeTab === 'courses' && <AdminCourses />}
          {activeTab === 'career-paths' && <AdminCareerPaths />}
          {activeTab === 'jobs' && <AdminJobs />}
          {activeTab === 'resources' && <AdminResources />}
          {activeTab === 'announcements' && <AdminAnnouncements />}
          {activeTab === 'activity' && <AdminActivity />}
        </div>
      </main>
    </div>
  );
}
