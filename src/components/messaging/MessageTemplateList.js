// src/components/messaging/MessageTemplateList.js
import React, { useState } from 'react';
import './MessageTemplateList.css';

const MessageTemplateList = () => {
  const [templates] = useState([
    {
      id: 1,
      name: 'Appointment Reminder',
      category: 'Reminder',
      content: 'Hi {{patient_name}}, this is a reminder about your appointment with {{doctor_name}} on {{date}} at {{time}}. Please confirm by replying YES.',
      variables: ['patient_name', 'doctor_name', 'date', 'time'],
      status: 'active',
      lastUsed: '2024-01-15',
      usageCount: 156,
      responseRate: '94%'
    },
    {
      id: 2,
      name: 'Appointment Confirmation',
      category: 'Confirmation',
      content: 'Dear {{patient_name}}, your appointment with {{doctor_name}} has been confirmed for {{date}} at {{time}}. Location: {{location}}',
      variables: ['patient_name', 'doctor_name', 'date', 'time', 'location'],
      status: 'active',
      lastUsed: '2024-01-14',
      usageCount: 89,
      responseRate: '98%'
    },
    {
      id: 3,
      name: 'Cancellation Notice',
      category: 'Cancellation',
      content: 'Hi {{patient_name}}, we regret to inform you that your appointment on {{date}} has been cancelled. Please call us to reschedule.',
      variables: ['patient_name', 'date'],
      status: 'draft',
      lastUsed: '2024-01-10',
      usageCount: 23,
      responseRate: '76%'
    },
    {
      id: 4,
      name: 'Follow-up Reminder',
      category: 'Follow-up',
      content: 'Hello {{patient_name}}, Dr. {{doctor_name}} recommends a follow-up appointment. Please call us at {{phone}} to schedule.',
      variables: ['patient_name', 'doctor_name', 'phone'],
      status: 'active',
      lastUsed: '2024-01-12',
      usageCount: 67,
      responseRate: '85%'
    },
    {
      id: 5,
      name: 'Prescription Ready',
      category: 'Notification',
      content: 'Your prescription is ready for pickup at {{pharmacy_name}}. Pickup hours: {{hours}}. Questions? Call {{phone}}.',
      variables: ['pharmacy_name', 'hours', 'phone'],
      status: 'active',
      lastUsed: '2024-01-13',
      usageCount: 134,
      responseRate: '92%'
    },
    {
      id: 6,
      name: 'Test Results Available',
      category: 'Notification',
      content: 'Hi {{patient_name}}, your test results are now available. Please log into your patient portal or call us at {{phone}}.',
      variables: ['patient_name', 'phone'],
      status: 'active',
      lastUsed: '2024-01-11',
      usageCount: 45,
      responseRate: '88%'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const categories = ['All Categories', 'Reminder', 'Confirmation', 'Cancellation', 'Follow-up', 'Notification'];
  const statuses = ['All Status', 'Active', 'Draft', 'Inactive'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' || 
                           template.category === selectedCategory;
    const matchesStatus = !selectedStatus || selectedStatus === 'All Status' || 
                         template.status === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSendTest = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    alert(`Sending test message for template: "${template.name}"\n\nThis would normally send a test WhatsApp message to your registered phone number.`);
  };

  const handleEditTemplate = (templateId) => {
    alert(`Opening edit form for template ID: ${templateId}`);
  };

  const handleViewStats = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    alert(`Template Statistics:\n\nName: ${template.name}\nUsage Count: ${template.usageCount}\nResponse Rate: ${template.responseRate}\nLast Used: ${template.lastUsed}`);
  };

  const handleDuplicateTemplate = (templateId) => {
    alert(`Creating duplicate of template ID: ${templateId}`);
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      alert(`Template ID ${templateId} would be deleted`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#25d366';
      case 'draft': return '#ffd89b';
      case 'inactive': return '#ff6b6b';
      default: return '#718096';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Reminder': return '⏰';
      case 'Confirmation': return '✅';
      case 'Cancellation': return '❌';
      case 'Follow-up': return '🔄';
      case 'Notification': return '📢';
      default: return '📝';
    }
  };

  return (
    <div className="message-template-list">
      <div className="template-filters">
        <div className="filters-row">
          <div className="filter-group">
            <select 
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <select 
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group search-group">
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        
        <div className="results-count">
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>
      </div>
      
      <div className="templates-grid">
        {filteredTemplates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <div className="template-title">
                <span className="category-icon">{getCategoryIcon(template.category)}</span>
                <h4>{template.name}</h4>
              </div>
              <span 
                className="status-badge"
                style={{ 
                  backgroundColor: getStatusColor(template.status) + '20',
                  color: getStatusColor(template.status),
                  border: `1px solid ${getStatusColor(template.status)}`
                }}
              >
                {template.status}
              </span>
            </div>
            
            <div className="template-category">
              📁 {template.category}
            </div>
            
            <div className="template-content">
              <p>{template.content}</p>
            </div>
            
            <div className="template-variables">
              <strong>Variables:</strong>
              <div className="variables-list">
                {template.variables.map(variable => (
                  <span key={variable} className="variable-tag">
                    {variable}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="template-stats">
              <div className="stat-item">
                <span className="stat-label">Used:</span>
                <span className="stat-value">{template.usageCount} times</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Response Rate:</span>
                <span className="stat-value response-rate">{template.responseRate}</span>
              </div>
            </div>
            
            <div className="template-meta">
              <span style={{ fontSize: '12px', color: '#718096' }}>
                Last used: {new Date(template.lastUsed).toLocaleDateString()}
              </span>
            </div>
            
            <div className="template-actions">
              <button 
                className="btn btn-whatsapp action-btn"
                onClick={() => handleSendTest(template.id)}
                title="Send Test Message"
              >
                📤 Test
              </button>
              <button 
                className="btn btn-secondary action-btn"
                onClick={() => handleEditTemplate(template.id)}
                title="Edit Template"
              >
                ✏️ Edit
              </button>
              <button 
                className="btn btn-primary action-btn"
                onClick={() => handleViewStats(template.id)}
                title="View Statistics"
              >
                📊 Stats
              </button>
              <div className="dropdown-menu">
                <button className="dropdown-trigger">⋮</button>
                <div className="dropdown-content">
                  <button onClick={() => handleDuplicateTemplate(template.id)}>
                    📋 Duplicate
                  </button>
                  <button 
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="delete-action"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No templates found</h3>
          <p>Try adjusting your search criteria or create a new template.</p>
          <button className="btn btn-primary">
            ➕ Create Template
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageTemplateList;