// src/components/messaging/MessageHistory.js
import React, { useState } from 'react';

const MessageHistory = () => {
  const [messages] = useState([
    {
      id: 1,
      patient: 'John Smith',
      phone: '+1234567890',
      template: 'Appointment Reminder',
      content: 'Hi John Smith, this is a reminder about your appointment with Dr. Johnson...',
      sentAt: '2024-01-15 09:00:00',
      status: 'delivered',
      response: 'YES',
      responseAt: '2024-01-15 09:15:00'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      phone: '+1234567891',
      template: 'Appointment Confirmation',
      content: 'Dear Sarah Wilson, your appointment with Dr. Brown has been confirmed...',
      sentAt: '2024-01-15 08:30:00',
      status: 'read',
      response: null,
      responseAt: null
    },
    {
      id: 3,
      patient: 'Mike Davis',
      phone: '+1234567892',
      template: 'Appointment Reminder',
      content: 'Hi Mike Davis, this is a reminder about your appointment...',
      sentAt: '2024-01-14 16:00:00',
      status: 'failed',
      response: null,
      responseAt: null
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#25d366';
      case 'read': return '#667eea';
      case 'sent': return '#ffd89b';
      case 'failed': return '#ff6b6b';
      default: return '#718096';
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Message History</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="form-select" style={{ width: 'auto' }}>
            <option>All Status</option>
            <option>Delivered</option>
            <option>Read</option>
            <option>Failed</option>
          </select>
          <input 
            type="date" 
            className="form-input" 
            style={{ width: '150px' }}
          />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search..."
            style={{ width: '200px' }}
          />
        </div>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Template</th>
            <th>Sent At</th>
            <th>Status</th>
            <th>Response</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map(message => (
            <tr key={message.id}>
              <td>
                <div>
                  <div style={{ fontWeight: '600' }}>{message.patient}</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>{message.phone}</div>
                </div>
              </td>
              <td>
                <div>
                  <div style={{ fontWeight: '500' }}>{message.template}</div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#718096',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {message.content}
                  </div>
                </div>
              </td>
              <td style={{ fontSize: '14px' }}>
                {formatDateTime(message.sentAt)}
              </td>
              <td>
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: getStatusColor(message.status) + '20',
                    color: getStatusColor(message.status),
                    border: `1px solid ${getStatusColor(message.status)}`
                  }}
                >
                  {message.status}
                </span>
              </td>
              <td>
                {message.response ? (
                  <div>
                    <div style={{ fontWeight: '600', color: '#25d366' }}>{message.response}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>
                      {formatDateTime(message.responseAt)}
                    </div>
                  </div>
                ) : (
                  <span style={{ color: '#718096', fontSize: '14px' }}>No response</span>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    👁️ View
                  </button>
                  <button 
                    className="btn btn-whatsapp"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    🔄 Resend
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessageHistory;

