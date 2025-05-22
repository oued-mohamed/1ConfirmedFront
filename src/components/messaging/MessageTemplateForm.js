// src/components/messaging/MessageTemplateForm.js
import React, { useState } from 'react';

const MessageTemplateForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    content: '',
    variables: []
  });

  const [newVariable, setNewVariable] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving template:', formData);
    onSave();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addVariable = () => {
    if (newVariable && !formData.variables.includes(newVariable)) {
      setFormData({
        ...formData,
        variables: [...formData.variables, newVariable]
      });
      setNewVariable('');
    }
  };

  const removeVariable = (variable) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter(v => v !== variable)
    });
  };

  const insertVariable = (variable) => {
    const textarea = document.querySelector('textarea[name="content"]');
    const cursorPos = textarea.selectionStart;
    const textBefore = formData.content.substring(0, cursorPos);
    const textAfter = formData.content.substring(cursorPos);
    const newContent = textBefore + `{{${variable}}}` + textAfter;
    
    setFormData({
      ...formData,
      content: newContent
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3>💬 New Message Template</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="template-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Template Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Appointment Reminder"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Reminder">Reminder</option>
                <option value="Confirmation">Confirmation</option>
                <option value="Cancellation">Cancellation</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Message Content *</label>
            <textarea
              name="content"
              className="form-input"
              rows="5"
              value={formData.content}
              onChange={handleChange}
              placeholder="Type your message here. Use {{variable_name}} for dynamic content."
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Variables</label>
            <div className="variable-input">
              <input
                type="text"
                className="form-input"
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                placeholder="Add variable name"
                style={{ marginRight: '10px', flex: 1 }}
              />
              <button type="button" className="btn btn-secondary" onClick={addVariable}>
                ➕ Add
              </button>
            </div>
            
            {formData.variables.length > 0 && (
              <div className="variables-list" style={{ marginTop: '10px' }}>
                {formData.variables.map(variable => (
                  <div key={variable} className="variable-item">
                    <span 
                      className="variable-tag clickable"
                      onClick={() => insertVariable(variable)}
                      title="Click to insert into message"
                    >
                      {variable}
                    </span>
                    <button 
                      type="button"
                      className="remove-variable"
                      onClick={() => removeVariable(variable)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-whatsapp">
              💬 Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageTemplateForm;

