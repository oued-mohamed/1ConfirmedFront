// src/pages/Settings.js
import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    hospitalName: 'HealthPing General Hospital',
    hospitalEmail: 'admin@healthping.com',
    hospitalPhone: '+1234567890',
    whatsappApiKey: '',
    whatsappApiSecret: '',
    reminderTiming: {
      firstReminder: 24,
      secondReminder: 12,
      thirdReminder: 2
    },
    emailNotifications: true,
    smsBackup: true,
    autoConfirmation: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReminderChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      reminderTiming: {
        ...prev.reminderTiming,
        [field]: parseInt(value)
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>System Settings</h1>
        <button className="btn btn-primary" onClick={handleSave}>
          💾 Save Settings
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <div className="card">
            <h3>🏥 Hospital Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input
                  type="text"
                  name="hospitalName"
                  className="form-input"
                  value={settings.hospitalName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="hospitalEmail"
                  className="form-input"
                  value={settings.hospitalEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="hospitalPhone"
                className="form-input"
                value={settings.hospitalPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="card">
            <h3>📱 WhatsApp API Configuration</h3>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input
                type="password"
                name="whatsappApiKey"
                className="form-input"
                value={settings.whatsappApiKey}
                onChange={handleInputChange}
                placeholder="Enter your 1CONFIRMED API key"
              />
            </div>
            <div className="form-group">
              <label className="form-label">API Secret</label>
              <input
                type="password"
                name="whatsappApiSecret"
                className="form-input"
                value={settings.whatsappApiSecret}
                onChange={handleInputChange}
                placeholder="Enter your 1CONFIRMED API secret"
              />
            </div>
            <div className="api-status">
              <span className="status-indicator connected">🟢 Connected</span>
              <button className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                🔧 Test Connection
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="card">
            <h3>⏰ Reminder Settings</h3>
            <p style={{ color: '#718096', marginBottom: '20px' }}>
              Configure when to send appointment reminders (hours before appointment)
            </p>
            
            <div className="reminder-settings">
              <div className="reminder-item">
                <label className="form-label">First Reminder</label>
                <div className="reminder-input">
                  <input
                    type="number"
                    className="form-input"
                    value={settings.reminderTiming.firstReminder}
                    onChange={(e) => handleReminderChange('firstReminder', e.target.value)}
                    min="1"
                    max="168"
                  />
                  <span>hours before</span>
                </div>
              </div>
              
              <div className="reminder-item">
                <label className="form-label">Second Reminder</label>
                <div className="reminder-input">
                  <input
                    type="number"
                    className="form-input"
                    value={settings.reminderTiming.secondReminder}
                    onChange={(e) => handleReminderChange('secondReminder', e.target.value)}
                    min="1"
                    max="48"
                  />
                  <span>hours before</span>
                </div>
              </div>
              
              <div className="reminder-item">
                <label className="form-label">Final Reminder</label>
                <div className="reminder-input">
                  <input
                    type="number"
                    className="form-input"
                    value={settings.reminderTiming.thirdReminder}
                    onChange={(e) => handleReminderChange('thirdReminder', e.target.value)}
                    min="1"
                    max="12"
                  />
                  <span>hours before</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="card">
            <h3>🔔 Notification Preferences</h3>
            
            <div className="notification-settings">
              <div className="notification-item">
                <label className="notification-label">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  📧 Email Notifications
                </label>
                <p>Send backup notifications via email</p>
              </div>
              
              <div className="notification-item">
                <label className="notification-label">
                  <input
                    type="checkbox"
                    name="smsBackup"
                    checked={settings.smsBackup}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  📱 SMS Backup
                </label>
                <p>Send SMS if WhatsApp delivery fails</p>
              </div>
              
              <div className="notification-item">
                <label className="notification-label">
                  <input
                    type="checkbox"
                    name="autoConfirmation"
                    checked={settings.autoConfirmation}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  ✅ Auto-confirmation
                </label>
                <p>Automatically confirm appointments when patients respond</p>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="card">
            <h3>📊 System Status</h3>
            <div className="system-status">
              <div className="status-item">
                <span className="status-label">Database</span>
                <span className="status-indicator connected">🟢 Connected</span>
              </div>
              <div className="status-item">
                <span className="status-label">WhatsApp API</span>
                <span className="status-indicator connected">🟢 Active</span>
              </div>
              <div className="status-item">
                <span className="status-label">Email Service</span>
                <span className="status-indicator connected">🟢 Operational</span>
              </div>
              <div className="status-item">
                <span className="status-label">SMS Service</span>
                <span className="status-indicator warning">🟡 Limited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;