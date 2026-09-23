import React from 'react';
import { ShieldCheck } from 'lucide-react';
import './Footer.css';

export default function Footer({ onTabChange, onAdminLoginClick }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="footer-logo" onClick={() => onTabChange && onTabChange('home')}>
              <div className="logo-icon">
                <span className="bar bar-1"></span>
                <span className="bar bar-2"></span>
                <span className="bar bar-3"></span>
              </div>
              <span className="logo-text">interact<span>.ai</span></span>
            </div>
            <p className="footer-tagline">
              From campus to corporate with the right guidance, skills, and real hiring opportunities.
            </p>
            <div className="footer-meta-row">
              <p className="footer-copyright">
                © 2026 Interact.ai. All rights reserved.
              </p>
              <button 
                className="footer-admin-link" 
                onClick={onAdminLoginClick} 
                title="Admin Portal Sign In"
              >
                <ShieldCheck size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Login as Admin
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><button onClick={() => onTabChange && onTabChange('home')}>Home</button></li>
              <li><button onClick={() => onTabChange && onTabChange('career-paths')}>Career Paths</button></li>
              <li><button onClick={() => onTabChange && onTabChange('courses')}>Courses</button></li>
              <li><button onClick={() => onTabChange && onTabChange('internships')}>Internships</button></li>
              <li><button onClick={() => onTabChange && onTabChange('jobs')}>Jobs</button></li>
              <li><button onClick={() => onTabChange && onTabChange('mock-interviews')}>Mock Interviews</button></li>
              <li><button onClick={() => onTabChange && onTabChange('resources')}>Resources</button></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Support</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li>
                <button onClick={onAdminLoginClick} className="admin-portal-link">
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="footer-col">
            <h4 className="footer-col-title">Follow Us</h4>
            <div className="social-links">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" title="X (Twitter)" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
