// src/components/dashboard/ResponseRateWidget.js
import React from 'react';

const ResponseRateWidget = () => {
  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>WhatsApp Response Rate</h3>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#25d366',
          marginBottom: '10px'
        }}>
          94%
        </div>
        <p style={{ color: '#718096', marginBottom: '20px' }}>
          Patients responding to reminders
        </p>
        <div style={{ 
          background: '#f0fff4', 
          padding: '15px', 
          borderRadius: '12px',
          border: '1px solid #25d366'
        }}>
          <div style={{ color: '#25d366', fontWeight: '600', marginBottom: '5px' }}>
            🎯 Excellent Performance
          </div>
          <div style={{ fontSize: '14px', color: '#22543d' }}>
            +8% improvement from last month
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseRateWidget;

