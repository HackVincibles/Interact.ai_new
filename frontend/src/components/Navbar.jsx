import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  Briefcase, 
  UserCheck, 
  FileText, 
  Search, 
  Bell, 
  ChevronDown, 
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  BarChart2,
  Trophy,
  Sun,
  Moon
} from 'lucide-react';
import './Navbar.css';

export default function Navbar({ 
  activeTab = 'home', 
  onTabChange, 
  isLoggedIn = false, 
  currentUser,
  onGetStartedClick,
  onLogoutClick, 
  onOpenLeaderboard,
  theme = 'dark',
  onToggleTheme
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'career-paths', label: 'Career Paths', icon: Compass },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'mock-interviews', label: 'Mock Interviews', icon: UserCheck, badge: 'AI' },
    { id: 'resources', label: 'Resources', icon: FileText },
  ];

  const firstName = currentUser?.fullName 
    ? currentUser.fullName.split(' ')[0] 
    : (currentUser?.email ? currentUser.email.split('@')[0] : 'Candidate');

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        
        {/* Brand Logo - Placed on far left */}
        <div className="navbar-logo" onClick={() => onTabChange && onTabChange('home')}>
          <div className="logo-icon">
            <span className="bar bar-1"></span>
            <span className="bar bar-2"></span>
            <span className="bar bar-3"></span>
          </div>
          <span className="logo-text">interact<span>.ai</span></span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange(item.id)}
              >
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Right Actions / Theme Toggle / Auth */}
        <div className="navbar-actions">
          
          {/* Theme Toggle Button (Sun / Moon) */}
          <button 
            className="action-btn theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun size={18} className="yellow" /> : <Moon size={18} className="purple" />}
          </button>

          {isLoggedIn ? (
            <>
              <button className="action-btn" title="Search platform">
                <Search size={18} />
              </button>
              
              <button className="action-btn notification-btn" title="Notifications">
                <Bell size={18} />
                <span className="notification-dot"></span>
              </button>

              <div className="user-menu-wrapper">
                <button 
                  className="user-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="avatar">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250" 
                      alt={currentUser?.fullName || "Student Profile"} 
                    />
                  </div>
                  <span className="user-name">Hi, {firstName}</span>
                  <ChevronDown size={14} className={`chevron ${userDropdownOpen ? 'open' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-card">
                    <div className="dropdown-header">
                      <p className="dropdown-title">{currentUser?.fullName || 'Student Candidate'}</p>
                      <p className="dropdown-sub">{currentUser?.branch || 'Engineering'} • {currentUser?.collegeName || 'University'}</p>
                      <div className="rank-badges" onClick={() => { onOpenLeaderboard && onOpenLeaderboard(); setUserDropdownOpen(false); }}>
                        <span className="rank-pill college" style={{ cursor: 'pointer' }}>College: {currentUser?.collegeRank || '#14'}</span>
                        <span className="rank-pill global" style={{ cursor: 'pointer' }}>Global: {currentUser?.globalRank || '#5,230'}</span>
                      </div>
                    </div>
                    <hr />
                    <button className="dropdown-item" onClick={() => { onOpenLeaderboard && onOpenLeaderboard(); setUserDropdownOpen(false); }}>
                      <Trophy size={16} /> View Leaderboard
                    </button>
                    <button className="dropdown-item" onClick={() => { onTabChange && onTabChange('profile'); setUserDropdownOpen(false); }}>
                      <User size={16} /> My Profile
                    </button>
                    <button className="dropdown-item" onClick={() => { onTabChange && onTabChange('jobs'); setUserDropdownOpen(false); }}>
                      <BarChart2 size={16} /> Dashboard
                    </button>
                    <hr />
                    <button className="dropdown-item logout" onClick={() => { onLogoutClick && onLogoutClick(); setUserDropdownOpen(false); }}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="guest-nav-btns">
              <button 
                className="btn-outline-secondary nav-login-btn"
                onClick={() => onTabChange && onTabChange('login')}
              >
                Log In
              </button>
              <button 
                className="btn-primary-purple nav-signup-btn"
                onClick={() => onTabChange && onTabChange('register')}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                onTabChange && onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
          {!isLoggedIn ? (
            <div className="mobile-auth-btns">
              <button className="btn-outline-secondary" onClick={() => { onTabChange && onTabChange('login'); setMobileMenuOpen(false); }}>Log In</button>
              <button className="btn-primary-purple" onClick={() => { onTabChange && onTabChange('register'); setMobileMenuOpen(false); }}>Sign Up</button>
            </div>
          ) : (
            <div className="mobile-auth-btns">
              <button className="btn-outline-secondary" onClick={() => { onOpenLeaderboard && onOpenLeaderboard(); setMobileMenuOpen(false); }}>🏆 View Leaderboard</button>
              <button className="btn-outline-secondary" onClick={() => { onLogoutClick && onLogoutClick(); setMobileMenuOpen(false); }}>Sign Out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
