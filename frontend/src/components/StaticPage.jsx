import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import './StaticPage.css';

export default function StaticPage({ type, onNavigate }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleDataDeletion = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, we would call an API here. Since no endpoint exists yet:
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ email: '', message: '' });
    }, 4000);
  };

  const renderContent = () => {
    switch (type) {
      case 'pricing':
        return (
          <div className="static-content-block">
            <h2>Simple, transparent pricing</h2>
            <p>Start practicing for free, upgrade when you need advanced features.</p>
            <div className="pricing-grid">
              <div className="pricing-card">
                <h3>Free Tier</h3>
                <div className="price">$0<span>/month</span></div>
                <ul>
                  <li><CheckCircle2 size={16} /> 2 Basic Mock Interviews</li>
                  <li><CheckCircle2 size={16} /> Standard AI Feedback</li>
                  <li><CheckCircle2 size={16} /> Resume Scanning</li>
                </ul>
                <button className="btn-outline-purple">Current Plan</button>
              </div>
              <div className="pricing-card popular">
                <div className="popular-badge">Most Popular</div>
                <h3>Pro Plan</h3>
                <div className="price">$15<span>/month</span></div>
                <ul>
                  <li><CheckCircle2 size={16} /> Unlimited Mock Interviews</li>
                  <li><CheckCircle2 size={16} /> Advanced AI Coaching</li>
                  <li><CheckCircle2 size={16} /> Detailed Analytics</li>
                  <li><CheckCircle2 size={16} /> Priority Support</li>
                </ul>
                <button className="btn-primary-purple">Upgrade to Pro</button>
              </div>
            </div>
          </div>
        );
      
      case 'blog':
        return (
          <div className="static-content-block">
            <h2>Interact.ai Blog</h2>
            <p>Insights, tips, and strategies for acing your next interview.</p>
            <div className="placeholder-box">
              <p>Blog platform is currently being set up. Check back soon for our first post!</p>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="static-content-block">
            <h2>About Interact.ai</h2>
            <p>
              Interact.ai is an AI-powered interview and candidate assessment platform.
              Our mission is to bridge the gap between campus and corporate by helping candidates 
              practice, improve, and understand their interview performance in a risk-free environment.
            </p>
            <p>
              We believe that everyone deserves the opportunity to present their best self in an interview. 
              By providing realistic mock interviews and detailed, actionable feedback, we empower candidates 
              to walk into their real interviews with confidence.
            </p>
          </div>
        );

      case 'contact':
        return (
          <div className="static-content-block">
            <h2>Contact Support</h2>
            <p>Have questions? We're here to help.</p>
            {submitted ? (
              <div className="success-banner">
                <CheckCircle2 size={20} />
                Message sent successfully! We'll get back to you shortly.
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows="4" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                </div>
                <button type="submit" className="btn-primary-purple">Send Message</button>
              </form>
            )}
          </div>
        );

      case 'privacy':
        return (
          <div className="static-content-block text-content">
            <h2>Privacy Policy</h2>
            <p>Last updated: Today</p>
            <h3>1. Data Collection</h3>
            <p>We collect information you provide directly to us when you create an account, such as your name, email, and university details. During mock interviews, we process your audio and video inputs solely for the purpose of generating feedback and analysis.</p>
            
            <h3>2. Data Usage</h3>
            <p>Your data is used strictly to provide and improve the Interact.ai services, including generating personalized interview feedback, tracking your progress on the leaderboard, and managing your account.</p>

            <h3>3. Data Security</h3>
            <p>We implement standard security measures to protect your personal information. We do not sell your personal data to third parties.</p>
          </div>
        );

      case 'terms':
        return (
          <div className="static-content-block text-content">
            <h2>Terms of Use</h2>
            <p>Last updated: Today</p>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing or using Interact.ai, you agree to be bound by these Terms of Use and all applicable laws and regulations.</p>

            <h3>2. User Conduct</h3>
            <p>You agree to use the platform only for lawful purposes. You must not attempt to manipulate the AI assessment systems, cheat during supervised tests, or share your account credentials.</p>

            <h3>3. Service Availability</h3>
            <p>We strive to keep Interact.ai available at all times, but we do not guarantee uninterrupted access. We reserve the right to modify or discontinue features at any time.</p>
          </div>
        );

      case 'delete-data':
        return (
          <div className="static-content-block">
            <h2>Delete My Data</h2>
            <p>If you wish to permanently delete your account and all associated data, submit a request below.</p>
            
            <div className="warning-banner">
              <AlertCircle size={20} />
              <span>Warning: This action is irreversible. All your interview history, feedback, and profile data will be permanently erased.</span>
            </div>

            {submitted ? (
              <div className="success-banner">
                <CheckCircle2 size={20} />
                Your deletion request has been received. This request requires processing and will be completed within 14 days.
              </div>
            ) : (
              <form className="contact-form mt-4" onSubmit={handleDataDeletion}>
                <div className="form-group">
                  <label>Confirm your Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Reason (Optional)</label>
                  <input type="text" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </div>
                <button type="submit" className="btn-danger">Request Data Deletion</button>
              </form>
            )}
          </div>
        );

      case 'compare':
        return (
          <div className="static-content-block">
            <h2>Compare Interact.ai</h2>
            <p>See how we stack up against other platforms.</p>
            <div className="compare-grid">
              {['HeyMilo', 'Alex (Apriora)', 'Ribbon', 'HireVue', 'ConverzAI', 'Classet', 'Lightscreen', 'Interviewer.AI'].map(competitor => (
                <div key={competitor} className="compare-card">
                  <h4>Interact.ai vs {competitor}</h4>
                  <p>Interact.ai focuses specifically on the student and fresher experience, providing deeply tailored feedback to help bridge the gap between campus and corporate, while keeping pricing accessible.</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Page not found.</div>;
    }
  };

  const getPageTitle = () => {
    const titles = {
      pricing: 'Pricing',
      blog: 'Blog',
      about: 'About Us',
      contact: 'Contact Support',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      'delete-data': 'Data Deletion',
      compare: 'Compare Platforms'
    };
    return titles[type] || 'Page';
  };

  return (
    <div className="static-page-wrapper">
      <div className="container">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={16} />
          Back to Home
        </button>
        <div className="static-page-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
