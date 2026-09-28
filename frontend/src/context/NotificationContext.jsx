import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    general: true,
    interviews: true,
    jobs: true,
    internships: true,
    courses: true,
    roadmap: true,
    certificates: true,
    system: true,
  });

  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedProfile = localStorage.getItem('interact_user_profile');
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          if (profile.email !== currentUserEmail) {
            setCurrentUserEmail(profile.email);
          }
        } catch(e) {}
      } else {
        if (currentUserEmail !== null) setCurrentUserEmail(null);
      }
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentUserEmail]);

  useEffect(() => {
    if (currentUserEmail) {
      const storedNotifs = localStorage.getItem(`interact_notifications_${currentUserEmail}`);
      if (storedNotifs) {
        try {
          setNotifications(JSON.parse(storedNotifs));
        } catch (e) {}
      } else {
        setNotifications([]);
      }
      const storedPrefs = localStorage.getItem(`interact_notification_prefs_${currentUserEmail}`);
      if (storedPrefs) {
        try {
          setPreferences(prev => ({ ...prev, ...JSON.parse(storedPrefs) }));
        } catch (e) {}
      }
    } else {
      setNotifications([]);
    }
  }, [currentUserEmail]);

  const saveNotifications = (newNotifs) => {
    setNotifications(newNotifs);
    if (currentUserEmail) {
      localStorage.setItem(`interact_notifications_${currentUserEmail}`, JSON.stringify(newNotifs));
    }
  };

  const savePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    if (currentUserEmail) {
      localStorage.setItem(`interact_notification_prefs_${currentUserEmail}`, JSON.stringify(newPrefs));
    }
  };

  const addNotification = (notif) => {
    if (!currentUserEmail) return;
    
    // Check preferences
    const category = notif.category || 'general';
    if (preferences[category] === false) {
      return; // Muted category
    }

    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
      createdAt: new Date().toISOString(),
      read: false,
      priority: 'normal',
      ...notif,
    };
    saveNotifications([newNotif, ...notifications]);
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const dismissNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      preferences,
      addNotification,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      savePreferences,
      unreadCount: notifications.filter(n => !n.read).length
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
