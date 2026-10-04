import React from 'react';
import { ShieldAlert, AlertTriangle, Wrench, Lock, X, ShieldX } from 'lucide-react';
import './AdminMaintenanceModal.css';

export default function AdminMaintenanceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="admin-maintenance-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="admin-maintenance-modal card-base" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-maintenance-title"
      >
        <button 
          id="close-admin-maintenance-btn"
          className="admin-maintenance-close-btn" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="admin-maintenance-content">
          <div className="admin-maintenance-icon-wrapper">
            <div className="icon-pulse-bg"></div>
            <ShieldAlert size={44} className="admin-maintenance-icon" />
          </div>

          <div className="admin-maintenance-header">
            <span className="admin-maintenance-badge">
              <Wrench size={14} /> Under Maintenance
            </span>
            <h2 id="admin-maintenance-title" className="admin-maintenance-title">
              Admin Portal Access Restricted
            </h2>
          </div>

          <div className="admin-maintenance-body">
            <p className="admin-maintenance-message">
              The Admin Login page is currently <strong>under maintenance</strong> and cannot be opened from any other device except the actual admin IP address.
            </p>

            <div className="admin-maintenance-warning-box">
              <div className="warning-box-item">
                <Lock size={18} className="warning-icon" />
                <div>
                  <strong>IP Whitelist Enforced</strong>
                  <p>Access is restricted strictly to registered administrator network IP addresses.</p>
                </div>
              </div>
              <div className="warning-box-item">
                <AlertTriangle size={18} className="warning-icon" />
                <div>
                  <strong>System Notice</strong>
                  <p>Sorry for your inconvenience.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-maintenance-footer">
            <button 
              id="admin-maintenance-dismiss-btn"
              className="btn-primary-purple admin-maintenance-btn" 
              onClick={onClose}
            >
              Understand & Return to Candidate Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
