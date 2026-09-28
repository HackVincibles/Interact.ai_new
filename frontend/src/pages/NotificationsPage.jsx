import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  CheckCircle2, 
  Target, 
  Briefcase, 
  BookOpen, 
  Map, 
  ShieldCheck,
  Settings,
  X,
  Trash2,
  Inbox,
  Filter
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import './NotificationsPage.css';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'internships', label: 'Internships' },
  { id: 'courses', label: 'Courses' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'system', label: 'System' },
];

function getCategoryIcon(cat) {
  switch(cat) {
    case 'interviews': return <Target size={18} className="text-purple-500" />;
    case 'jobs': 
    case 'internships': return <Briefcase size={18} className="text-blue-500" />;
    case 'courses': return <BookOpen size={18} className="text-orange-500" />;
    case 'roadmap': return <Map size={18} className="text-pink-500" />;
    case 'certificates': return <ShieldCheck size={18} className="text-green-500" />;
    default: return <Bell size={18} className="text-gray-400" />;
  }
}

function groupNotificationsByTime(notifications) {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    earlier: []
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const oneWeekAgo = today - (86400000 * 7);

  notifications.forEach(notif => {
    const time = new Date(notif.createdAt).getTime();
    if (time >= today) {
      groups.today.push(notif);
    } else if (time >= yesterday) {
      groups.yesterday.push(notif);
    } else if (time >= oneWeekAgo) {
      groups.thisWeek.push(notif);
    } else {
      groups.earlier.push(notif);
    }
  });

  return groups;
}

export default function NotificationsPage({ onNavigate }) {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    dismissNotification,
    preferences,
    savePreferences
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // 1. Filter by unread
      if (activeFilter === 'unread' && notif.read) return false;
      
      // 2. Filter by category
      if (activeFilter !== 'all' && activeFilter !== 'unread') {
        if (notif.category !== activeFilter) return false;
      }

      // 3. Filter by search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        if (!notif.title.toLowerCase().includes(query) && 
            !notif.message.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  const grouped = groupNotificationsByTime(filteredNotifications);

  const handleTogglePref = (key) => {
    savePreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  return (
    <div className="notifications-page-root animate-fade-in container" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      
      <div className="notifications-header card-base" style={{ marginBottom: '24px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Notifications</h1>
          <p style={{ color: 'var(--text-muted)' }}>Stay updated with your career activity</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline-secondary" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={18} />
            <span className="hide-mobile">Preferences</span>
          </button>
          <button className="btn-primary-purple" onClick={markAllAsRead}>
            <CheckCircle2 size={18} />
            <span className="hide-mobile">Mark all as read</span>
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="card-base animate-fade-in" style={{ marginBottom: '24px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} /> Notification Preferences
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
            Muted categories will not generate new notifications.
          </p>
          <div className="preferences-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {Object.keys(preferences).map(key => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={preferences[key]} 
                  onChange={() => handleTogglePref(key)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-purple)' }}
                />
                <span style={{ textTransform: 'capitalize' }}>{key}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="notifications-workspace" style={{ display: 'flex', gap: '24px' }}>
        
        {/* Left Sidebar: Filters */}
        <div className="notifications-sidebar hide-mobile" style={{ width: '220px', flexShrink: 0 }}>
          <div className="card-base" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '12px', letterSpacing: '0.5px' }}>Filters</h4>
            <div className="filter-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '8px', border: 'none',
                    background: activeFilter === cat.id ? 'var(--primary-purple)' : 'transparent',
                    color: activeFilter === cat.id ? '#fff' : 'var(--text-muted)',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Area */}
        <div className="notifications-main" style={{ flex: 1 }}>
          
          <div className="search-bar card-base" style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: '12px', marginBottom: '24px' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '1rem' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            )}
          </div>

          <div className="notifications-list-container">
            {filteredNotifications.length === 0 ? (
              <div className="empty-notifications card-base" style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: 'var(--bg-subtle)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Inbox size={40} color="var(--border-light)" />
                </div>
                <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>You're all caught up!</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>
                  New updates about your interviews, jobs, internships and roadmap will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {Object.entries(grouped).map(([timeLabel, items]) => {
                  if (items.length === 0) return null;
                  
                  const displayLabel = timeLabel === 'today' ? 'TODAY' :
                                       timeLabel === 'yesterday' ? 'YESTERDAY' :
                                       timeLabel === 'thisWeek' ? 'THIS WEEK' : 'EARLIER';
                  
                  return (
                    <div key={timeLabel} className="time-group">
                      <h4 style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '12px', letterSpacing: '1px' }}>{displayLabel}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {items.map(notif => (
                          <div 
                            key={notif.id} 
                            className={`notification-card card-base ${notif.read ? 'read' : 'unread'}`}
                            onClick={() => markAsRead(notif.id)}
                            style={{ 
                              padding: '20px', 
                              display: 'flex', 
                              gap: '16px',
                              position: 'relative',
                              overflow: 'hidden',
                              borderLeft: !notif.read ? '4px solid var(--primary-purple)' : '4px solid transparent',
                              background: !notif.read ? 'rgba(99, 91, 255, 0.03)' : 'var(--bg-modal)'
                            }}
                          >
                            <div className="notif-icon-container" style={{ 
                              width: '40px', height: '40px', borderRadius: '50%', 
                              background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                              {getCategoryIcon(notif.category)}
                            </div>
                            
                            <div className="notif-content" style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '1.05rem', color: notif.read ? 'var(--text-main)' : '#fff' }}>
                                  {notif.priority === 'important' && <span style={{ color: '#f59e0b', marginRight: '6px' }}>📌</span>}
                                  {notif.priority === 'urgent' && <span style={{ color: '#e11d48', marginRight: '6px' }}>🚨</span>}
                                  {notif.title}
                                </h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                                  {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                {notif.message}
                              </p>
                              
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                                {notif.actionUrl ? (
                                  <button 
                                    className="btn-outline-secondary" 
                                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notif.id);
                                      if (onNavigate) onNavigate(notif.actionUrl);
                                    }}
                                  >
                                    {notif.actionLabel || 'View Details'}
                                  </button>
                                ) : <div />}
                                
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    className="icon-action-btn"
                                    onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                                    title="Dismiss"
                                    style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '4px' }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
