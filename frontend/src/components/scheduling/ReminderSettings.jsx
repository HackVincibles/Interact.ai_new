import React from 'react';
import './ReminderSettings.css';

export default function ReminderSettings({ preferences, onChange }) {
  
  const togglePref = (key) => {
    onChange({ ...preferences, [key]: !preferences[key] });
  };

  return (
    <div className="reminder-settings-container">
      <h3 className="reminder-settings-title">Email Reminders</h3>
      
      <div className="reminder-options">
        <label className="reminder-option">
          <input 
            type="checkbox" 
            checked={preferences['24h']} 
            onChange={() => togglePref('24h')}
          />
          <span className="custom-checkbox"></span>
          24 hours before
        </label>
        
        <label className="reminder-option">
          <input 
            type="checkbox" 
            checked={preferences['1h']} 
            onChange={() => togglePref('1h')}
          />
          <span className="custom-checkbox"></span>
          1 hour before
        </label>

        <label className="reminder-option">
          <input 
            type="checkbox" 
            checked={preferences['15m']} 
            onChange={() => togglePref('15m')}
          />
          <span className="custom-checkbox"></span>
          15 minutes before
        </label>
      </div>
    </div>
  );
}
