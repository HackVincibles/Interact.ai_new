import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Edit2, XCircle, AlertCircle } from 'lucide-react';
import ScheduleModal from '../scheduling/ScheduleModal';
import { useNotifications } from '../../context/NotificationContext';
import API_BASE_URL from '../../config/api';

export default function MySchedules({ currentUser }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);
  const { addNotification } = useNotifications();

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('interact_token');
      const response = await fetch(`${API_BASE_URL}/api/schedules`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (!response.ok) throw new Error('Failed to fetch schedules');
      
      const data = await response.json();
      if (data.success) {
        setSchedules(data.schedules || []);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Could not load schedules. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [currentUser]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;
    
    try {
      const token = localStorage.getItem('interact_token');
      const response = await fetch(`${API_BASE_URL}/api/schedules/${id}/cancel`, {
        method: 'PUT',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (!response.ok) throw new Error('Failed to cancel schedule');
      
      addNotification({
        title: 'Interview Cancelled',
        message: 'Your scheduled interview has been cancelled successfully.',
        type: 'info',
        category: 'interviews'
      });
      
      fetchSchedules();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReschedule = (schedule) => {
    setScheduleToEdit(schedule);
    setIsScheduleModalOpen(true);
  };

  if (loading) return <div className="loading-state">Loading schedules...</div>;

  return (
    <div className="profile-section-card card-base">
      <div className="section-card-header">
        <div className="title-with-icon">
          <Calendar size={24} className="card-icon blue" />
          <h2>My Upcoming Schedules</h2>
        </div>
      </div>

      {error ? (
        <div className="error-state" style={{ padding: '20px', color: '#e11d48', background: 'rgba(225, 29, 72, 0.1)', borderRadius: '8px' }}>
          <AlertCircle size={20} style={{ marginBottom: '8px' }} />
          <p>{error}</p>
        </div>
      ) : schedules.length > 0 ? (
        <div className="interviews-list">
          <div style={{ display: 'grid', gap: '16px' }}>
            {schedules.map(item => {
              const date = new Date(item.scheduled_at);
              const displayDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
              const displayTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              const isPast = date < new Date();

              return (
                <div key={item.id} style={{ 
                  padding: '16px', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: '12px', 
                  background: 'var(--bg-subtle)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  opacity: isPast ? 0.6 : 1
                }}>
                  <div>
                    <h4 style={{ marginBottom: '4px', fontSize: '1.05rem' }}>{item.type}</h4>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> {displayDate}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {displayTime}</span>
                      <span>•</span>
                      <span>{item.timezone}</span>
                    </div>
                  </div>
                  
                  {!isPast && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => handleReschedule(item)}
                      >
                        <Edit2 size={14} /> Reschedule
                      </button>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}
                        onClick={() => handleCancel(item.id)}
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    </div>
                  )}
                  {isPast && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Passed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="empty-profile-block" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Calendar size={48} color="var(--border-light)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>No upcoming schedules.</h3>
          <p className="empty-block-text">You don't have any scheduled interviews right now.</p>
        </div>
      )}

      {isScheduleModalOpen && (
        <ScheduleModal 
          isOpen={isScheduleModalOpen}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setScheduleToEdit(null);
          }}
          existingSchedule={scheduleToEdit}
          config={{
            type: scheduleToEdit?.type || 'Interview',
            duration: scheduleToEdit?.duration || 30
          }}
          onSuccess={fetchSchedules}
        />
      )}
    </div>
  );
}
