import React from 'react';
import './ErrorPage.css';

const errorConfigs = {
  404: {
    code: '404',
    title: 'Page Not Found',
    subtitle: "Oops! This page doesn't exist or has been moved.",
    emoji: '🔭',
    color: '#635bff',
    tips: [
      'Double-check the URL or navigation link',
      'The page may have been moved or deleted',
      'Try searching from the dashboard',
    ],
  },
  403: {
    code: '403',
    title: 'Access Denied',
    subtitle: "You don't have permission to view this page.",
    emoji: '🔒',
    color: '#f59e0b',
    tips: [
      'Make sure you are logged in with the right account',
      'This section may require special permissions',
      'Contact support if you believe this is an error',
    ],
  },
  401: {
    code: '401',
    title: 'Authentication Required',
    subtitle: 'You need to be logged in to access this page.',
    emoji: '🛡️',
    color: '#a78bfa',
    tips: [
      'Log in with your Google account or email',
      'Your session may have expired — try logging in again',
    ],
    actionLabel: 'Log In',
    actionTab: 'login',
  },
  500: {
    code: '500',
    title: 'Server Error',
    subtitle: "Something went wrong on our end. We're working on it.",
    emoji: '⚡',
    color: '#ef4444',
    tips: [
      'Try refreshing the page',
      'This is usually temporary — check back in a moment',
      'If it persists, contact support',
    ],
  },
  429: {
    code: '429',
    title: 'Too Many Requests',
    subtitle: "You've made too many requests. Please slow down!",
    emoji: '⏳',
    color: '#06b6d4',
    tips: [
      'Wait a few seconds before trying again',
      'Avoid rapid repeated actions',
    ],
  },
  503: {
    code: '503',
    title: 'Service Unavailable',
    subtitle: 'The service is temporarily offline for maintenance.',
    emoji: '🔧',
    color: '#f97316',
    tips: [
      'We\'ll be back shortly',
      'Check our status page for updates',
    ],
  },
};

export default function ErrorPage({ code = 404, message, onNavigate, onRetry }) {
  const config = errorConfigs[code] || {
    ...errorConfigs[404],
    code: String(code),
    title: 'Unexpected Error',
    subtitle: message || 'Something went wrong.',
    emoji: '❓',
    color: '#635bff',
  };

  return (
    <div className="error-page-root">
      {/* Animated background orbs */}
      <div className="error-bg-orb orb-1" style={{ '--orb-color': config.color }} />
      <div className="error-bg-orb orb-2" style={{ '--orb-color': config.color }} />

      <div className="error-page-content animate-fade-in">

        {/* Giant glowing code */}
        <div className="error-code-display" style={{ '--error-color': config.color }}>
          <span className="error-emoji">{config.emoji}</span>
          <h1 className="error-code-text">{config.code}</h1>
        </div>

        <h2 className="error-title">{config.title}</h2>
        <p className="error-subtitle">{config.subtitle}</p>

        {/* Tip list */}
        <ul className="error-tips">
          {config.tips.map((tip, i) => (
            <li key={i}>
              <span className="tip-dot" style={{ background: config.color }} />
              {tip}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="error-actions">
          <button
            className="btn-primary-purple"
            onClick={() => onNavigate?.('home')}
          >
            Go to Dashboard
          </button>

          {config.actionTab && (
            <button
              className="btn-secondary"
              onClick={() => onNavigate?.(config.actionTab)}
            >
              {config.actionLabel}
            </button>
          )}

          {onRetry && (
            <button className="btn-secondary" onClick={onRetry}>
              Try Again
            </button>
          )}
        </div>

        {/* Error code in corner for support reference */}
        <p className="error-ref">Error {config.code} · Interact.ai</p>
      </div>
    </div>
  );
}
