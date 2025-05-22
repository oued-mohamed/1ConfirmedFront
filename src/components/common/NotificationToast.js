// src/components/common/NotificationToast.js
import React, { useState, useEffect } from 'react';

const NotificationToast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Allow fade animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyle = () => {
    const baseStyle = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 20px',
      borderRadius: '12px',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      zIndex: 1100,
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      minWidth: '300px'
    };

    switch (type) {
      case 'success':
        return { ...baseStyle, background: 'linear-gradient(135deg, #25d366, #128c7e)' };
      case 'error':
        return { ...baseStyle, background: 'linear-gradient(135deg, #ff6b6b, #e53e3e)' };
      case 'warning':
        return { ...baseStyle, background: 'linear-gradient(135deg, #ffd89b, #fd9853)' };
      default:
        return { ...baseStyle, background: 'linear-gradient(135deg, #667eea, #764ba2)' };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div style={getToastStyle()}>
      <span>{getIcon()}</span>
      <span>{message}</span>
      <button
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          marginLeft: 'auto'
        }}
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationToast;

