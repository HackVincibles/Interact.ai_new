import React, { useState, useEffect } from 'react';
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
import AdminSettings from './pages/AdminSettings';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin/') && path !== '/admin/login') {
      const tab = path.split('/')[2];
      return tab || 'dashboard';
    }
    return 'dashboard';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('interact_admin_token') ? true : false;
  });

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin/') && path !== '/admin/login') {
        const tab = path.split('/')[2];
        setActiveTab(tab || 'dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    setProfileDropdownOpen(false);
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
          <button className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => handleTabChange('settings')}>Settings</button>
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
            <button className="admin-notification-btn" title="Notifications">
              <span>🔔</span>
            </button>
            <div className="admin-profile-menu-container">
              <button 
                className="admin-profile-btn" 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <span>Admin ▼</span>
              </button>
              {profileDropdownOpen && (
                <div className="admin-profile-dropdown">
                  <div className="dropdown-header">
                    <strong>System Administrator</strong>
                    <small>admin@interact.ai</small>
                  </div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { setProfileDropdownOpen(false); handleTabChange('activity'); }}>
                    Activity Log
                  </button>
                  <button className="dropdown-item" onClick={() => { setProfileDropdownOpen(false); handleTabChange('settings'); }}>
                    Settings
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout-text" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
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
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
}
