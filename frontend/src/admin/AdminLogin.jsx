import React, { useState, useEffect } from 'react';
import './AdminApp.css';
import API_BASE_URL from '../config/api';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (lockoutSeconds > 0) {
      setError(`Too many failed attempts. Try after ${lockoutSeconds}s.`);
      return;
    }

    setLoading(true);
    const cleanUser = username.trim().toLowerCase();

    // Strict Admin Verification
    if (cleanUser === 'team.interact.ai@gmail.com' && password === 'InteractAdmin@123') {
      setFailedAttempts(0);
      setLockoutSeconds(0);
      setLoading(false);
      onLoginSuccess('admin-auth-token-valid');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password }),
      });
      const data = await res.json();
      if (data.success) {
        setFailedAttempts(0);
        setLockoutSeconds(0);
        onLoginSuccess(data.token);
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 3) {
          setLockoutSeconds(60);
          setFailedAttempts(0);
          setError('Too many failed attempts. Try after 1 min.');
        } else {
          setError('Enter correct password or email');
        }
      }
    } catch (err) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 3) {
        setLockoutSeconds(60);
        setFailedAttempts(0);
        setError('Too many failed attempts. Try after 1 min.');
      } else {
        setError('Enter correct password or email');
      }
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>Admin Control Center</h2>
          <p>Authorized personnel only</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div 
              className="admin-error-box"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px',
                fontSize: '0.88rem',
                fontWeight: '700'
              }}
            >
              {error}
            </div>
          )}
          <div className="form-group">
            <label>Admin Email Address</label>
            <input 
              type="text" 
              value={username} 
              disabled={lockoutSeconds > 0}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="team.interact.ai@gmail.com"
              style={{ borderColor: error ? '#ef4444' : undefined }}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              disabled={lockoutSeconds > 0}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••••••"
              style={{ borderColor: error ? '#ef4444' : undefined }}
            />
          </div>
          <button 
            type="submit" 
            className="admin-btn-primary" 
            disabled={loading || lockoutSeconds > 0}
            style={{ opacity: lockoutSeconds > 0 ? 0.6 : 1 }}
          >
            {loading ? 'Authenticating...' : (lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : 'Access Dashboard')}
          </button>
        </form>
      </div>
    </div>
  );
}
