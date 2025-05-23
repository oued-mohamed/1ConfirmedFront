// src/components/messaging/MessageTemplateList.js - FIXED VERSION
import React, { useState } from 'react';
import './MessageTemplateList.css';

const MessageTemplateList = ({ templates = [], onTemplateDeleted }) => {
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
      // Call the parent component's delete handler
      if (onTemplateDeleted) {
        onTemplateDeleted(templateId);
      }
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
                {template.variables && template.variables.map(variable => (
                  <span key={variable} className="variable-tag">
                    {variable}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="template-stats">
              <div className="stat-item">
                <span className="stat-label">Used:</span>
                <span className="stat-value">{template.usageCount || 0} times</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Response Rate:</span>
                <span className="stat-value response-rate">{template.responseRate || '0%'}</span>
              </div>
            </div>
            
            <div className="template-meta">
              <span style={{ fontSize: '12px', color: '#718096' }}>
                Last used: {template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : 'Never'}
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
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            🔄 Refresh Templates
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageTemplateList;