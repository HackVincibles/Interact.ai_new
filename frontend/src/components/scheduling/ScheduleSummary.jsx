import React from 'react';
import { Calendar, Clock, Edit2, Globe } from 'lucide-react';
import './ScheduleSummary.css';

export default function ScheduleSummary({ date, time, config, onEditDate, onEditTime }) {
  const displayDate = date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  
  let displayTime = '';
  if (time) {
    const [h, m] = time.split(':');
    const d = new Date();
    d.setHours(Number(h), Number(m));
    displayTime = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="schedule-summary-card">
      <div className="summary-item">
        <div className="summary-icon"><Calendar size={18} /></div>
        <div className="summary-details">
          <span className="summary-label">Date</span>
          <span className="summary-value">{displayDate}</span>
        </div>
        <button className="edit-btn" onClick={onEditDate}><Edit2 size={14} /></button>
      </div>

      <div className="summary-item">
        <div className="summary-icon"><Clock size={18} /></div>
        <div className="summary-details">
          <span className="summary-label">Time & Duration</span>
          <span className="summary-value">{displayTime} ({config?.duration || 30} mins)</span>
        </div>
        <button className="edit-btn" onClick={onEditTime}><Edit2 size={14} /></button>
      </div>

      <div className="summary-item">
        <div className="summary-icon"><Globe size={18} /></div>
        <div className="summary-details">
          <span className="summary-label">Timezone</span>
          <span className="summary-value">{timezone}</span>
        </div>
      </div>
    </div>
  );
}
