// src/pages/Messaging.js
import React, { useState } from 'react';
import MessageTemplateList from '../components/messaging/MessageTemplateList';
import MessageTemplateForm from '../components/messaging/MessageTemplateForm';
import MessageHistory from '../components/messaging/MessageHistory';
import './Messaging.css';

const Messaging = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="messaging-page">
      <div className="messaging-header">
        <h1>WhatsApp Messaging</h1>
        <button 
          className="btn btn-whatsapp"
          onClick={() => setShowForm(true)}
        >
          💬 New Template
        </button>
      </div>

      <div className="messaging-tabs">
        <button 
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          📝 Templates
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📞 Message History
        </button>
      </div>

      <div className="messaging-content">
        {activeTab === 'templates' && <MessageTemplateList />}
        {activeTab === 'history' && <MessageHistory />}
      </div>

      {showForm && (
        <MessageTemplateForm 
          onClose={() => setShowForm(false)}
          onSave={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Messaging;

