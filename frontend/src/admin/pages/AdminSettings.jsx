import React, { useState } from 'react';
import { Save, Shield, Database, Bell, Palette, Globe, Key } from 'lucide-react';
import './AdminSettings.css';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    platformName: 'Interact.ai',
    supportEmail: 'support@interact.ai',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    maxInterviewsPerUser: '10',
    themePrimaryColor: '#a855f7',
    defaultLanguage: 'en',
    openaiKey: '***************************',
    vapiKey: '***************************'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved successfully!');
    }, 800);
  };

  return (
    <div className="admin-settings-container animate-fade-in">
      <div className="settings-layout">
        
        {/* Settings Sidebar */}
        <aside className="settings-sidebar card-base">
          <nav className="settings-nav">
            <button 
              className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <Globe size={18} /> General
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={18} /> Security & Auth
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'integrations' ? 'active' : ''}`}
              onClick={() => setActiveTab('integrations')}
            >
              <Key size={18} /> API Keys & Integrations
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <Palette size={18} /> Appearance
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={18} /> Notifications
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'database' ? 'active' : ''}`}
              onClick={() => setActiveTab('database')}
            >
              <Database size={18} /> Database Backups
            </button>
          </nav>
        </aside>

        {/* Settings Content */}
        <main className="settings-content card-base">
          <form onSubmit={handleSave}>
            <div className="settings-header">
              <h2>
                {activeTab === 'general' && 'General Settings'}
                {activeTab === 'security' && 'Security & Authentication'}
                {activeTab === 'integrations' && 'API Keys & Integrations'}
                {activeTab === 'appearance' && 'Platform Appearance'}
                {activeTab === 'notifications' && 'Notification Preferences'}
                {activeTab === 'database' && 'Database & Backups'}
              </h2>
              <button type="submit" className="btn-primary-purple settings-save-btn" disabled={loading}>
                <Save size={16} />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            <hr className="settings-divider" />

            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="settings-form-grid">
                <div className="form-group">
                  <label>Platform Name</label>
                  <input 
                    type="text" 
                    name="platformName" 
                    value={settings.platformName} 
                    onChange={handleChange} 
                  />
                  <small>The name displayed in the header and emails.</small>
                </div>
                <div className="form-group">
                  <label>Support Email</label>
                  <input 
                    type="email" 
                    name="supportEmail" 
                    value={settings.supportEmail} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="maintenanceMode" 
                      checked={settings.maintenanceMode} 
                      onChange={handleChange} 
                    />
                    Enable Maintenance Mode
                  </label>
                  <small>Prevents non-admin users from logging in while active.</small>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="settings-form-grid">
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="allowRegistrations" 
                      checked={settings.allowRegistrations} 
                      onChange={handleChange} 
                    />
                    Allow New Student Registrations
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="requireEmailVerification" 
                      checked={settings.requireEmailVerification} 
                      onChange={handleChange} 
                    />
                    Require Email Verification
                  </label>
                </div>
                <div className="form-group">
                  <label>Max Mock Interviews Per User</label>
                  <input 
                    type="number" 
                    name="maxInterviewsPerUser" 
                    value={settings.maxInterviewsPerUser} 
                    onChange={handleChange} 
                  />
                  <small>Set to 0 for unlimited.</small>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="settings-form-grid">
                <div className="form-group">
                  <label>OpenAI API Key</label>
                  <input 
                    type="password" 
                    name="openaiKey" 
                    value={settings.openaiKey} 
                    onChange={handleChange} 
                  />
                  <small>Used for LangGraph evaluation generation.</small>
                </div>
                <div className="form-group">
                  <label>Vapi.ai Public Key</label>
                  <input 
                    type="password" 
                    name="vapiKey" 
                    value={settings.vapiKey} 
                    onChange={handleChange} 
                  />
                  <small>Used for realtime AI voice interviews.</small>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="settings-form-grid">
                <div className="form-group">
                  <label>Primary Brand Color (Hex)</label>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <input 
                      type="color" 
                      name="themePrimaryColor" 
                      value={settings.themePrimaryColor} 
                      onChange={handleChange} 
                      style={{width: '50px', height: '40px', padding: '0', cursor: 'pointer'}}
                    />
                    <input 
                      type="text" 
                      name="themePrimaryColor" 
                      value={settings.themePrimaryColor} 
                      onChange={handleChange} 
                      style={{flex: 1}}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Platform Logo</label>
                  <button type="button" className="btn-outline-secondary">Upload New Logo</button>
                </div>
              </div>
            )}

            {/* Placeholders for others */}
            {['notifications', 'database'].includes(activeTab) && (
              <div className="admin-empty-state">
                <p>This settings category is currently being built and will be available in the next release.</p>
              </div>
            )}
            
          </form>
        </main>
      </div>
    </div>
  );
}
