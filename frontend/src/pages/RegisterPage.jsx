import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { signInWithGoogle } from '../services/supabase';
import './RegisterPage.css';

export default function RegisterPage({ onNavigate, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    branch: '',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) errs.agreeTerms = 'You must accept the terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGoogleOAuth = async () => {
    try {
      setOauthLoading(true);
      await signInWithGoogle();
    } catch (err) {
      console.warn('Google OAuth notice:', err);
    } finally {
      setOauthLoading(false);
      onRegisterSuccess({
        fullName: 'Google Candidate',
        email: 'candidate@gmail.com',
        collegeName: '',
        branch: '',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onRegisterSuccess({
      fullName: formData.fullName,
      email: formData.email,
      collegeName: formData.collegeName || '',
      branch: formData.branch || '',
    });
  };

  return (
    <div className="full-auth-page animate-fade-in">
      {/* Top Header Bar */}
      <div className="auth-page-top-bar">
        <div className="container top-bar-container">
          <button className="back-home-btn" onClick={() => onNavigate('home')}>
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>
          
          <div className="auth-brand-logo" onClick={() => onNavigate('home')}>
            <div className="logo-icon-small">
              <span className="bar bar-1"></span>
              <span className="bar bar-2"></span>
              <span className="bar bar-3"></span>
            </div>
            <span className="logo-title">interact<span>.ai</span></span>
          </div>
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="container auth-content-container">
        <div className="auth-box card-base">
          <div className="auth-box-header">
            <span className="section-label">STUDENT REGISTRATION</span>
            <h1 className="auth-box-title">Create Your Candidate Account</h1>
            <p className="auth-box-sub">
              Get free access to AI Mock Interview simulators, ATS resume scanner, and live hiring matches.
            </p>
          </div>

          {/* Single Google OAuth Button */}
          <div className="oauth-single-wrapper">
            <button className="oauth-btn google-full-btn" onClick={handleGoogleOAuth} disabled={oauthLoading}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or sign up with email</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-field-wrapper">
                <User size={18} className="field-icon" />
                <input 
                  type="text" 
                  placeholder="e.g. Ayush Daharwal" 
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-field-wrapper">
                <Mail size={18} className="field-icon" />
                <input 
                  type="email" 
                  placeholder="student@example.com" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>College / University Name</label>
              <div className="input-field-wrapper">
                <input 
                  type="text" 
                  placeholder="e.g. SISTec-R Bhopal" 
                  value={formData.collegeName}
                  onChange={(e) => handleInputChange('collegeName', e.target.value)}
                  style={{ paddingLeft: '16px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Branch / Specialization</label>
              <div className="input-field-wrapper">
                <input 
                  type="text" 
                  placeholder="e.g. B.Tech Computer Science" 
                  value={formData.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                  style={{ paddingLeft: '16px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-field-wrapper">
                <Lock size={18} className="field-icon" />
                <input 
                  type="password" 
                  placeholder="At least 8 characters" 
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-field-wrapper">
                <Lock size={18} className="field-icon" />
                <input 
                  type="password" 
                  placeholder="Re-enter password" 
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <div className="checkbox-group full-width">
              <input 
                type="checkbox" 
                id="reg-terms" 
                checked={formData.agreeTerms}
                onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
              />
              <label htmlFor="reg-terms">
                I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn-primary-purple auth-submit-btn full-width">
              <span>Complete Registration</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-box-footer">
            <p>
              Already registered?{' '}
              <button className="link-action-btn" onClick={() => onNavigate('login')}>
                Sign In to Your Account →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
