// src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'md', color = '#667eea' }) => {
  const sizeMap = {
    sm: '20px',
    md: '40px',
    lg: '60px'
  };

  const spinnerStyle = {
    display: 'inline-block',
    width: sizeMap[size],
    height: sizeMap[size],
    border: `3px solid #f3f3f3`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return <div style={spinnerStyle} />;
};

export default LoadingSpinner;

