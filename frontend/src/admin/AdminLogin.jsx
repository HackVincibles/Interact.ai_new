import React from 'react';
import { ShieldAlert, AlertTriangle, Lock, Wrench, ArrowLeft } from 'lucide-react';
import './AdminApp.css';

export default function AdminLogin() {
  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="admin-login-container">
      <div 
        className="admin-login-card"
        style={{
          borderColor: 'rgba(239, 68, 68, 0.4)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(239, 68, 68, 0.18)',
          textAlign: 'center',
          padding: '36px 32px'
        }}
      >
        <div 
          style={{
            position: 'relative',
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}
        >
          <ShieldAlert size={42} style={{ color: '#ef4444', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#f59e0b',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: '600',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}
          >
            <Wrench size={14} /> Under Maintenance
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', margin: '0 0 8px 0' }}>
            Admin Portal Access Restricted
          </h2>
        </div>

        <p style={{ fontSize: '0.98rem', lineHeight: '1.6', color: '#cbd5e1', marginBottom: '24px' }}>
          The Admin Login page is currently <strong style={{ color: '#ef4444' }}>under maintenance</strong> and cannot be opened from any other device except actual admin IP address.
        </p>

        <div 
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            textAlign: 'left',
            marginBottom: '28px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Lock size={18} style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '2px' }}>
                IP Address Enforced
              </strong>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                Access is strictly reserved for the authorized physical admin IP location.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertTriangle size={18} style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '2px' }}>
                Notice
              </strong>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                Sorry for your inconvenience.
              </p>
            </div>
          </div>
        </div>

        <button 
          id="admin-return-home-btn"
          className="admin-btn-primary" 
          onClick={handleReturnHome}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={18} />
          <span>Return to Candidate Portal</span>
        </button>
      </div>
    </div>
  );
}
