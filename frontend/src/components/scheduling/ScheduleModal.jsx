import React, { useState, useEffect } from 'react';
import CalendarDateSelector from './CalendarDateSelector';
import TimeSlotSelector from './TimeSlotSelector';
import ReminderSettings from './ReminderSettings';
import ScheduleSummary from './ScheduleSummary';
import { useNotifications } from '../../context/NotificationContext';
import { X, Calendar, Clock, Bell, CheckCircle, Sparkles } from 'lucide-react';
import { auth } from '../../services/firebase';
import API_BASE_URL from '../../config/api';
import './ScheduleModal.css';

export default function ScheduleModal({ isOpen, onClose, config, existingSchedule, onSuccess }) {
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1); // 1: Date, 2: Time, 3: Reminders & Summary
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null); // format: "HH:MM" (24h)
  const [reminderPrefs, setReminderPrefs] = useState({ '24h': true, '1h': true, '15m': false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setSuccessData(null);
      if (existingSchedule) {
        const d = new Date(existingSchedule.scheduled_at);
        setSelectedDate(d);
        setSelectedTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
        setReminderPrefs(existingSchedule.reminder_preferences || { '24h': true, '1h': true, '15m': false });
        setStep(1);
      } else {
        setSelectedDate(null);
        setSelectedTime(null);
        setReminderPrefs({ '24h': true, '1h': true, '15m': false });
        setStep(1);
      }
      setError(null);
    }
  }, [isOpen, existingSchedule]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && selectedDate) setStep(2);
    else if (step === 2 && selectedTime) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    // Combine date and time
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      type: config.type || 'Mock Interview',
      referenceId: config.referenceId || null,
      scheduledAt: scheduledAt.toISOString(),
      duration: config.duration || 30,
      timezone,
      reminderPreferences: reminderPrefs
    };

    try {
      const firebaseUser = auth.currentUser;
      let token = 'local_session_token';
      if (firebaseUser) {
        try {
          token = await firebaseUser.getIdToken();
        } catch (e) {
          console.warn('Firebase token fetch notice:', e);
        }
      }

      const url = existingSchedule
        ? `${API_BASE_URL}/api/schedules/${existingSchedule.id}`
        : `${API_BASE_URL}/api/schedules`;

      const method = existingSchedule ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      }).catch(() => null);

      addNotification({
        title: existingSchedule ? 'Interview Rescheduled' : 'Interview Scheduled',
        message: `Your ${payload.type} is scheduled for ${scheduledAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}. You will be notified based on schedule.`,
        type: 'success',
        category: 'interviews'
      });

      // Show success popup
      setSuccessData({
        type: payload.type,
        date: scheduledAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        time: scheduledAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        duration: payload.duration,
        timezone,
      });
      setIsSuccess(true);

      if (onSuccess && res && res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.schedule) onSuccess(data.schedule);
      }

      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Success Screen ───────────────────────────────────────────────────────
  if (isSuccess && successData) {
    return (
      <div className="schedule-modal-overlay">
        <div className="schedule-modal-content schedule-success-modal animate-scale-up">
          <div className="schedule-success-inner">
            {/* Animated ring */}
            <div className="success-ring-wrapper">
              <svg className="success-ring" viewBox="0 0 100 100">
                <circle className="success-ring-track" cx="50" cy="50" r="42" />
                <circle className="success-ring-fill" cx="50" cy="50" r="42" />
              </svg>
              <CheckCircle className="success-check-icon" size={40} />
            </div>

            <div className="success-sparkles">
              <Sparkles size={18} className="sparkle-1" />
              <Sparkles size={14} className="sparkle-2" />
              <Sparkles size={16} className="sparkle-3" />
            </div>

            <h2 className="success-title">
              {existingSchedule ? 'Interview Rescheduled!' : 'Interview Scheduled!'}
            </h2>
            <p className="success-subtitle">You're all set. Good luck! 🚀</p>

            <div className="success-details-card">
              <div className="success-detail-row">
                <Calendar size={16} />
                <span>{successData.date}</span>
              </div>
              <div className="success-detail-row">
                <Clock size={16} />
                <span>{successData.time} · {successData.duration} mins</span>
              </div>
              <div className="success-detail-row">
                <Bell size={16} />
                <span>Reminders enabled</span>
              </div>
            </div>

            <p className="success-auto-close">Closing automatically…</p>

            <button className="btn-primary success-done-btn" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Normal Scheduling Flow ───────────────────────────────────────────────
  return (
    <div className="schedule-modal-overlay">
      <div className="schedule-modal-content card-base animate-scale-up">
        <button className="schedule-modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="schedule-modal-header">
          <h2>{existingSchedule ? 'Reschedule Interview' : 'Schedule Interview'}</h2>
          <p>Choose when you'd like to practice.</p>
        </div>

        <div className="schedule-modal-stepper">
          <div className={`step ${step >= 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
            <Calendar size={16} /> <span>Date</span>
          </div>
          <div className="step-divider" />
          <div className={`step ${step >= 2 ? 'active' : ''} ${!selectedDate && step < 2 ? 'disabled' : ''}`} onClick={() => selectedDate && setStep(2)}>
            <Clock size={16} /> <span>Time</span>
          </div>
          <div className="step-divider" />
          <div className={`step ${step >= 3 ? 'active' : ''} ${!selectedTime && step < 3 ? 'disabled' : ''}`} onClick={() => selectedTime && setStep(3)}>
            <CheckCircle size={16} /> <span>Confirm</span>
          </div>
        </div>

        <div className="schedule-modal-body">
          {error && <div className="schedule-error">{error}</div>}
          
          {step === 1 && (
            <CalendarDateSelector 
              selectedDate={selectedDate} 
              onSelectDate={(d) => { setSelectedDate(d); setStep(2); }} 
            />
          )}

          {step === 2 && (
            <TimeSlotSelector 
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              interval={config.interval || 30}
              onSelectTime={(t) => { setSelectedTime(t); setStep(3); }} 
            />
          )}

          {step === 3 && (
            <div className="schedule-confirm-step animate-fade-in">
              <ScheduleSummary 
                date={selectedDate} 
                time={selectedTime} 
                config={config} 
                onEditDate={() => setStep(1)}
                onEditTime={() => setStep(2)}
              />
              <ReminderSettings 
                preferences={reminderPrefs} 
                onChange={setReminderPrefs} 
              />
            </div>
          )}
        </div>

        <div className="schedule-modal-footer">
          {step > 1 ? (
            <button className="btn-secondary" onClick={handleBack}>Back</button>
          ) : (
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
          )}
          
          {step < 3 ? (
            <button className="btn-primary" onClick={handleNext} disabled={(step === 1 && !selectedDate) || (step === 2 && !selectedTime)}>
              Continue
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Confirming...' : 'Confirm Schedule'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
