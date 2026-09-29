import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, X, ShieldCheck, Key, AlertCircle } from 'lucide-react';
import { signInWithGoogle, signInWithGitHub } from '../services/firebase';
import ResetPasswordFlow from './ResetPasswordFlow';
import './AuthModal.css';

export default function AuthModal({ initialMode = 'login', isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'signup', 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminFailedAttempts, setAdminFailedAttempts] = useState(0);
  const [adminLockoutSeconds, setAdminLockoutSeconds] = useState(0);

  // Sync internal mode state when initialMode changes externally
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    let timer;
    if (adminLockoutSeconds > 0) {
      timer = setInterval(() => {
        setAdminLockoutSeconds((prev) => {
          if (prev <= 1) {
            setAdminError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [adminLockoutSeconds]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecret: '',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (mode === 'signup' && !formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Valid email address or username is required';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    }
    if (mode === 'signup' && formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (mode === 'signup' && !formData.agreeTerms) {
      errs.agreeTerms = 'You must agree to the terms';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGoogleOAuth = async () => {
    try {
      setOauthLoading(true);
      await signInWithGoogle();
    } catch (err) {
      console.warn('Google OAuth error:', err);
    } finally {
      setOauthLoading(false);
    }
  };

  const handleGitHubOAuth = async () => {
    try {
      setOauthLoading(true);
      await signInWithGitHub();
    } catch (err) {
      console.warn('GitHub OAuth error:', err);
    } finally {
      setOauthLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');

    if (!validateForm()) return;

    if (mode === 'admin') {
      if (adminLockoutSeconds > 0) {
        setAdminError(`Too many failed attempts. Try after ${adminLockoutSeconds}s.`);
        return;
      }

      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanPassword = formData.password;

      // Strict Admin Verification Rule: team.interact.ai@gmail.com / InteractAdmin@123
      if (cleanEmail === 'team.interact.ai@gmail.com' && cleanPassword === 'InteractAdmin@123') {
        setAdminFailedAttempts(0);
        setAdminLockoutSeconds(0);
        setAdminError('');
        onAuthSuccess({
          fullName: 'Interact AI Admin',
          email: 'team.interact.ai@gmail.com',
          role: 'admin',
          isAdmin: true,
        });
        return;
      }

      // Handle wrong admin credentials & rate-limiting lockout (3 attempts -> 60s cooldown)
      const nextFailedCount = adminFailedAttempts + 1;
      setAdminFailedAttempts(nextFailedCount);

      if (nextFailedCount >= 3) {
        setAdminLockoutSeconds(60);
        setAdminFailedAttempts(0);
        setAdminError('Too many failed attempts. Try after 1 min.');
      } else {
        setAdminError('Enter correct password or email');
      }
      return;
    }

    onAuthSuccess({
      fullName: formData.fullName || 'Ayush Daharwal',
      email: formData.email,
      isNewUser: mode === 'signup',
      role: 'student',
    });
  };

  return (
    <div className="auth-overlay animate-fade-in">
      <div className="auth-backdrop" onClick={onClose}></div>

      {mode === 'reset' ? (
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px', margin: 'auto' }}>
          <button className="auth-close-btn" onClick={onClose} title="Close" style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 20 }}>
            <X size={20} color="#fff" />
          </button>
          <ResetPasswordFlow onCancel={() => setMode('login')} onSuccess={() => setMode('login')} />
        </div>
      ) : (
      <div className="auth-card card-base">
        {/* Close Button */}
        <button className="auth-close-btn" onClick={onClose} title="Close">
          <X size={20} />
        </button>

        {/* Top Brand Tag */}
        <div className="auth-brand-logo">
          <div className="logo-icon-small">
            <span className="bar bar-1"></span>
            <span className="bar bar-2"></span>
            <span className="bar bar-3"></span>
          </div>
          <span className="logo-title">
            interact<span>.ai</span>
            {mode === 'admin' && <span className="admin-badge-pill">ADMIN</span>}
          </span>
        </div>

        {/* Header Title */}
        <div className="auth-header">
          <h2 className="auth-title">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create your account' : 'Admin Portal Login'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login' 
              ? 'Log in to your account to continue your learning journey with Interact.ai'
              : mode === 'signup'
              ? 'Join thousands of students building their careers with Interact.ai'
              : 'Sign in to access platform analytics, student records & admin metrics'}
          </p>
        </div>

        {/* Prominent Red Alert Box for Wrong Admin Credentials or Lockout */}
        {adminError && mode === 'admin' && (
          <div 
            className="admin-red-error-box animate-fade-in"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '0.88rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{adminError}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-field-wrapper">
                <User size={18} className="field-icon" />
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
          )}

          <div className="form-group">
            <label>{mode === 'admin' ? 'Admin Email / Username' : 'Email Address'}</label>
            <div className="input-field-wrapper">
              <Mail size={18} className="field-icon" />
              <input 
                type="text" 
                placeholder={mode === 'admin' ? 'admin@interact.ai' : 'Enter your email address'} 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              {mode === 'login' && (
                <button 
                  type="button" 
                  className="link-action-btn forgot-link" 
                  onClick={() => setMode('reset')}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="input-field-wrapper">
              <Lock size={18} className="field-icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'} 
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <button 
                type="button" 
                className="eye-btn" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === 'signup' && (
              <span className="field-note">Must be at least 8 characters with a number and a letter.</span>
            )}
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {mode === 'admin' && (
            <div className="form-group">
              <label>Admin Secret Authorization Key (Optional)</label>
              <div className="input-field-wrapper">
                <Key size={18} className="field-icon" />
                <input 
                  type="password" 
                  placeholder="Enter secret key (Default: admin123)" 
                  value={formData.adminSecret}
                  onChange={(e) => handleInputChange('adminSecret', e.target.value)}
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-field-wrapper">
                <Lock size={18} className="field-icon" />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder="Confirm your password" 
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
                <button 
                  type="button" 
                  className="eye-btn" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}

          {mode === 'signup' && (
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="terms" 
                checked={formData.agreeTerms}
                onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
              </label>
            </div>
          )}

          <button type="submit" className="btn-primary-purple auth-submit-btn">
            <span>{mode === 'login' ? 'Log In' : mode === 'signup' ? 'Sign Up' : 'Log In as Admin'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Toggle Login/Signup/Admin */}
        <div className="auth-footer-toggle">
          {mode === 'admin' ? (
            <p>
              Switch to candidate login?{' '}
              <button className="toggle-link-btn" onClick={() => setMode('login')}>
                Student Sign In
              </button>
            </p>
          ) : mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button className="toggle-link-btn" onClick={() => setMode('signup')}>
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button className="toggle-link-btn" onClick={() => setMode('login')}>
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
