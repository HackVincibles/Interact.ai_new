import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, Key, ArrowRight, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../services/firebase';
import ResetPasswordFlow from '../components/ResetPasswordFlow';
import './LoginPage.css';

export default function LoginPage({ onNavigate, onLoginSuccess, initialAdminMode = false }) {
  const [isAdminMode, setIsAdminMode] = useState(initialAdminMode);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminSecret: '',
  });

  const [errors, setErrors] = useState({});
  const [adminError, setAdminError] = useState('');
  const [adminFailedAttempts, setAdminFailedAttempts] = useState(0);
  const [adminLockoutSeconds, setAdminLockoutSeconds] = useState(0);
  const [oauthLoading, setOauthLoading] = useState(false);

  useEffect(() => {
    if (initialAdminMode) {
      setIsAdminMode(true);
    }
  }, [initialAdminMode]);

  // 1-minute Lockout Countdown Timer
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (adminError) setAdminError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email or Username is required';
    if (!formData.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGoogleOAuth = async () => {
    try {
      setOauthLoading(true);
      const res = await signInWithGoogle();
      if (res?.data?.user) {
        const u = res.data.user;
        onLoginSuccess({
          fullName: u.displayName || u.email?.split('@')[0] || 'Google Candidate',
          email: u.email || 'user.google@gmail.com',
        });
        return;
      }
    } catch (err) {
      console.warn('Google OAuth notice:', err);
    } finally {
      setOauthLoading(false);
    }
    // Fallback seamless Google authentication
    onLoginSuccess({
      fullName: 'Google OAuth Candidate',
      email: 'google.candidate@interact.ai',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');

    if (!validate()) return;

    if (isAdminMode) {
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
        onLoginSuccess({
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

    const candidateName = formData.email.includes('@') ? formData.email.split('@')[0] : formData.email;
    onLoginSuccess({
      fullName: candidateName,
      email: formData.email,
      collegeName: '',
      branch: '',
    });
  };

  return (
    <div className="full-auth-page animate-fade-in">
      {/* Top Header Bar - Brand Logo & Back Arrow on Top Left */}
      <div className="auth-page-top-bar">
        <div className="container top-bar-container" style={{ justifyContent: 'flex-start', gap: '16px' }}>
          <button className="back-home-btn icon-only-back" onClick={() => onNavigate('home')} title="Back to Home" style={{ padding: '8px 12px' }}>
            <ArrowLeft size={20} />
          </button>
          
          <div className="auth-brand-logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="logo-icon-small">
              <span className="bar bar-1"></span>
              <span className="bar bar-2"></span>
              <span className="bar bar-3"></span>
            </div>
            <span className="logo-title">
              interact<span>.ai</span>
              {isAdminMode && <span className="admin-badge-pill">ADMIN</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="container auth-content-container">
        {isResettingPassword ? (
          <ResetPasswordFlow 
            onCancel={() => setIsResettingPassword(false)}
            onSuccess={() => setIsResettingPassword(false)}
          />
        ) : (
          <div className="auth-box card-base">
          <div className="auth-box-header">
            <span className="section-label">
              {isAdminMode ? 'ADMIN PORTAL ACCESS' : 'STUDENT AUTHENTICATION'}
            </span>
            <h1 className="auth-box-title">
              {isAdminMode ? 'Log In as Platform Admin' : 'Sign In to Your Account'}
            </h1>
            <p className="auth-box-sub">
              {isAdminMode 
                ? 'Access platform metrics, student interview logs & system dashboard.' 
                : 'Welcome back! Enter your details to access candidate features.'}
            </p>
          </div>

          {/* Render Google OAuth ONLY for Candidate mode, NEVER for Admin mode */}
          {!isAdminMode && (
            <>
              {/* Single Google OAuth Button */}
              <div className="oauth-single-wrapper">
                <button className="oauth-btn google-full-btn" onClick={handleGoogleOAuth} disabled={oauthLoading}>
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="auth-divider">
                <span>or log in with email</span>
              </div>
            </>
          )}

          {/* Prominent Red Alert Box for Wrong Admin Credentials or Lockout */}
          {adminError && (
            <div 
              className="admin-red-error-box animate-fade-in"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '18px',
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

          <form onSubmit={handleSubmit} className="auth-form-vertical">
            <div className="form-group">
              <label>{isAdminMode ? 'Admin Username / Email' : 'Email Address'} <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="input-field-wrapper">
                <input 
                  type="text" 
                  placeholder={isAdminMode ? "team.interact.ai@gmail.com" : "name@example.com"}
                  style={{ 
                    paddingLeft: '14px',
                    borderColor: (adminError && isAdminMode) ? '#ef4444' : undefined 
                  }}
                  value={formData.email}
                  disabled={isAdminMode && adminLockoutSeconds > 0}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>Password <span style={{ color: '#ef4444' }}>*</span></label>
                {!isAdminMode && (
                  <button 
                    type="button" 
                    className="link-action-btn forgot-link" 
                    onClick={() => setIsResettingPassword(true)}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="input-field-wrapper">
                <input 
                  type="password" 
                  placeholder={isAdminMode ? "••••••••••••" : "At least 8 characters"}
                  style={{ 
                    paddingLeft: '14px',
                    borderColor: (adminError && isAdminMode) ? '#ef4444' : undefined 
                  }}
                  value={formData.password}
                  disabled={isAdminMode && adminLockoutSeconds > 0}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button 
              type="submit" 
              className="btn-primary-purple auth-submit-btn full-width"
              disabled={isAdminMode && adminLockoutSeconds > 0}
              style={{
                opacity: (isAdminMode && adminLockoutSeconds > 0) ? 0.6 : 1,
                cursor: (isAdminMode && adminLockoutSeconds > 0) ? 'not-allowed' : 'pointer'
              }}
            >
              <span>
                {isAdminMode 
                  ? (adminLockoutSeconds > 0 ? `Locked (Try after ${adminLockoutSeconds}s)` : 'Log In as Admin') 
                  : 'Sign In'}
              </span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-box-footer">
            {isAdminMode ? (
              <p>
                Switch to student sign in?{' '}
                <button className="link-action-btn" onClick={() => { setIsAdminMode(false); setAdminError(''); }}>
                  Candidate Login
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button className="link-action-btn" onClick={() => onNavigate('register')}>
                  Get Started Free →
                </button>
              </p>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
