import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import './ResetPasswordFlow.css';

export default function ResetPasswordFlow({ onCancel, onSuccess }) {
  const [step, setStep] = useState('request'); // 'request' | 'verify' | 'success'
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Verify & Reset states
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const inputRefs = useRef([]);

  const reqLowercase = /[a-z]/.test(newPassword);
  const reqUppercase = /[A-Z]/.test(newPassword);
  const reqNumber = /[0-9]/.test(newPassword);
  const reqLength = newPassword.length >= 8;
  const allReqsMet = reqLowercase && reqUppercase && reqNumber && reqLength;

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to send OTP');
      
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    let lastFilledIndex = 0;
    
    pastedData.forEach((char, i) => {
      if (/^\d$/.test(char) && i < 6) {
        newOtp[i] = char;
        lastFilledIndex = i;
      }
    });
    
    setOtp(newOtp);
    if (lastFilledIndex < 5) {
      inputRefs.current[lastFilledIndex + 1]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  useEffect(() => {
    if (step === 'verify' && otp.every(digit => digit !== '') && !otpVerified) {
      verifyOtpCode();
    }
  }, [otp]);

  const verifyOtpCode = async () => {
    setIsLoading(true);
    setError('');
    const otpCode = otp.join('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Invalid verification code');
      
      setResetToken(data.token);
      setOtpVerified(true);
    } catch (err) {
      setError(err.message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!allReqsMet) return;
    
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: resetToken, newPassword })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to reset password');
      
      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="auth-box card-base animate-fade-in text-center">
        <div className="auth-box-header">
          <div className="success-icon-wrapper" style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
            <CheckCircle2 size={48} color="#22c55e" />
          </div>
          <h1 className="auth-box-title">Password Reset Successfully</h1>
          <p className="auth-box-sub">Your password has been updated. You can now log in with your new credentials.</p>
        </div>
        <button className="btn-primary-purple auth-submit-btn full-width" onClick={onSuccess}>
          Continue to Log In
        </button>
      </div>
    );
  }

  return (
    <div className="auth-box card-base animate-fade-in reset-pwd-flow">
      <div className="auth-box-header">
        <h1 className="auth-box-title">Reset Password</h1>
        {step === 'request' ? (
          <p className="auth-box-sub">Enter your email address and we'll send you a verification code to reset your password.</p>
        ) : (
          <p className="auth-box-sub">Enter the verification code sent to <strong style={{color: '#fff'}}>{email}</strong> to reset your password.</p>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {step === 'request' && (
        <form onSubmit={handleRequestReset} className="auth-form-vertical">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-field-wrapper">
              <Mail size={18} className="field-icon" />
              <input 
                type="email" 
                placeholder="student@example.com" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary-purple auth-submit-btn full-width" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </button>
          <div className="auth-box-footer text-center" style={{marginTop: '1rem'}}>
            <button type="button" className="link-action-btn" onClick={onCancel} disabled={isLoading}>
              Back to Login
            </button>
          </div>
        </form>
      )}

      {step === 'verify' && (
        <div className="auth-form-vertical verify-step-container">
          <div className="form-group">
            <label>Verification Code</label>
            <div className="otp-container" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => inputRefs.current[i] = el}
                  className={`otp-box ${otpVerified ? 'verified' : ''}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  disabled={isLoading || otpVerified}
                />
              ))}
            </div>
            {otpVerified && (
              <div className="verified-status animate-fade-in">
                <CheckCircle2 size={16} />
                <span>Code verified</span>
              </div>
            )}
          </div>

          <div className={`new-password-section ${otpVerified ? 'expanded' : 'collapsed'}`}>
            <div className="form-group">
              <label>New password</label>
              <div className="input-field-wrapper">
                <Lock size={18} className="field-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button type="button" className="toggle-pwd-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <div className="password-requirements">
              <div className={`req-item ${reqLowercase ? 'met' : ''}`}>
                <CheckCircle2 size={14} /> <span>At least one lowercase letter</span>
              </div>
              <div className={`req-item ${reqLength ? 'met' : ''}`}>
                <CheckCircle2 size={14} /> <span>Minimum 8 characters</span>
              </div>
              <div className={`req-item ${reqUppercase ? 'met' : ''}`}>
                <CheckCircle2 size={14} /> <span>At least one uppercase letter</span>
              </div>
              <div className={`req-item ${reqNumber ? 'met' : ''}`}>
                <CheckCircle2 size={14} /> <span>At least one number</span>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-primary-purple auth-submit-btn full-width" 
              disabled={!allReqsMet || isLoading}
              onClick={handleResetPassword}
              style={{marginTop: '1.5rem'}}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
          
          {!otpVerified && (
            <div className="auth-box-footer text-center" style={{marginTop: '1rem'}}>
              <button type="button" className="link-action-btn" onClick={onCancel} disabled={isLoading}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
