import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
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
              AI-powered interview and candidate assessment platform designed to help candidates practice, improve, and understand their interview performance.
            </p>
            
            <div className="footer-cta-area">
              <h4 className="footer-cta-heading">Ready to get started?</h4>
              <p className="footer-cta-sub">Explore Interact.ai and start practicing smarter.</p>
              <button className="btn-primary-purple footer-cta-btn" onClick={() => onTabChange && onTabChange('register')}>
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4 className="footer-col-title">Platform</h4>
              <ul className="footer-links">
                <li><button onClick={() => onTabChange && onTabChange('home')}>Features</button></li>
                <li><button onClick={() => onTabChange && onTabChange('pricing')}>Pricing</button></li>
                <li><button onClick={() => onTabChange && onTabChange('blog')}>Blog</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Solutions</h4>
              <ul className="footer-links">
                <li><button onClick={() => onTabChange && onTabChange('mock-interviews')}>AI Interviews</button></li>
                <li><button onClick={() => onTabChange && onTabChange('mock-interviews')}>Group Discussions</button></li>
                <li><button onClick={() => onTabChange && onTabChange('resume-studio')}>AI Coach</button></li>
                <li><button onClick={() => onTabChange && onTabChange('career-paths')}>Candidate Assessment</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              <ul className="footer-links">
                <li><button onClick={() => onTabChange && onTabChange('about')}>About</button></li>
                <li><button onClick={() => onTabChange && onTabChange('contact')}>Contact</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Legal</h4>
              <ul className="footer-links">
                <li><button onClick={() => onTabChange && onTabChange('privacy')}>Privacy Policy</button></li>
                <li><button onClick={() => onTabChange && onTabChange('terms')}>Terms of Use</button></li>
                <li><button onClick={() => onTabChange && onTabChange('delete-data')}>Delete My Data</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Compare</h4>
              <ul className="footer-links">
                <li><button onClick={() => onTabChange && onTabChange('compare')}>InteractAI vs HeyMilo</button></li>
                <li><button onClick={() => onTabChange && onTabChange('compare')}>InteractAI vs Alex (Apriora)</button></li>
                <li><button onClick={() => onTabChange && onTabChange('compare')}>InteractAI vs Ribbon</button></li>
                <li><button onClick={() => onTabChange && onTabChange('compare')}>InteractAI vs HireVue</button></li>
                <li><button onClick={() => onTabChange && onTabChange('compare')}>InteractAI vs ConverzAI</button></li>
                <li><button onClick={() => onTabChange && onTabChange('compare')}>InteractAI vs Classet</button></li>
                <li><button onClick={() => onTabChange && onTabChange('compare')}>InteractAI vs Lightscreen</button></li>
                <li><button onClick={() => onTabChange && onTabChange('compare')}>InteractAI vs Interviewer.AI</button></li>
                <li><button onClick={() => onTabChange && onTabChange('compare')} className="footer-link-highlight">See all &rarr;</button></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
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

          <div className="footer-social">
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
