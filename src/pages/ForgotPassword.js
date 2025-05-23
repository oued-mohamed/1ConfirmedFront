// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const isResetMode = !!token;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [useMockMode, setUseMockMode] = useState(false);
  
  const { forgotPassword, error } = useAuth();
  const navigate = useNavigate();

  // Check backend connectivity on component mount
  React.useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await ApiService.testConnection();
      setBackendStatus('connected');
    } catch (error) {
      console.error('Backend connection failed:', error);
      setBackendStatus('disconnected');
      setUseMockMode(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordReset = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'New password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (useMockMode || backendStatus === 'disconnected') {
        // Mock forgot password
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSuccess(true);
        setMessage('Demo mode: Password reset link has been sent to your email (simulated)');
      } else {
        // Real forgot password
        await forgotPassword(formData.email);
        setSuccess(true);
        setMessage('Password reset link has been sent to your email address. Please check your inbox and spam folder.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setMessage(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordReset()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (useMockMode || backendStatus === 'disconnected') {
        // Mock password reset
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSuccess(true);
        setMessage('Demo mode: Password has been reset successfully');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Real password reset
        const response = await ApiService.resetPassword(token, formData.password);
        setSuccess(true);
        setMessage('Your password has been reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setMessage(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const BackendStatusIndicator = () => {
    if (backendStatus === 'checking') {
      return (
        <div className="status-indicator checking">
          <LoadingSpinner size="sm" />
          <span>Checking backend connection...</span>
        </div>
      );
    }

    if (backendStatus === 'connected') {
      return (
        <div className="status-indicator connected">
          <span>🟢 <strong>Backend Connected</strong></span>
          <small>Connected to: {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}</small>
        </div>
      );
    }

    return (
      <div className="status-indicator disconnected">
        <span>🔴 <strong>Backend Disconnected</strong></span>
        <small>Cannot connect to: {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}</small>
        <label className="demo-mode-toggle">
          <input
            type="checkbox"
            checked={useMockMode}
            onChange={(e) => setUseMockMode(e.target.checked)}
          />
          Use demo mode (no backend required)
        </label>
      </div>
    );
  };

  const SuccessView = () => (
    <div className="success-view">
      <div className="success-icon">✅</div>
      <h3>
        {isResetMode ? 'Password Reset Successful!' : 'Reset Link Sent!'}
      </h3>
      <p className="success-message">{message}</p>
      
      {!isResetMode && (
        <div className="email-instructions">
          <div className="instruction-item">
            <span className="step-number">1</span>
            <span>Check your email inbox for the reset link</span>
          </div>
          <div className="instruction-item">
            <span className="step-number">2</span>
            <span>Click the link in the email to reset your password</span>
          </div>
          <div className="instruction-item">
            <span className="step-number">3</span>
            <span>If you don't see it, check your spam folder</span>
          </div>
        </div>
      )}
      
      <div className="success-actions">
        <Link to="/login" className="btn btn-primary">
          Return to Login
        </Link>
        {!isResetMode && (
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setSuccess(false);
              setMessage('');
              setFormData({ email: '', password: '', confirmPassword: '' });
            }}
          >
            Try Different Email
          </button>
        )}
      </div>
    </div>
  );

  if (success) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="forgot-password-header">
            <Link to="/" className="logo">
              <div className="logo-icon">🏥</div>
              <span>HealthPing</span>
            </Link>
          </div>
          <div className="forgot-password-card">
            <SuccessView />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <Link to="/" className="logo">
            <div className="logo-icon">🏥</div>
            <span>HealthPing</span>
          </Link>
        </div>
        
        <div className="forgot-password-card">
          <div className="card-header">
            <h2>
              {isResetMode ? 'Reset Your Password' : 'Forgot Password?'}
            </h2>
            <p>
              {isResetMode 
                ? 'Enter your new password below'
                : 'Enter your email address and we\'ll send you a link to reset your password'
              }
            </p>
          </div>
          
          <BackendStatusIndicator />
          
          {message && !success && (
            <div className="error-message">{message}</div>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          <form 
            onSubmit={isResetMode ? handlePasswordResetSubmit : handleForgotPasswordSubmit} 
            className="forgot-password-form"
          >
            {!isResetMode ? (
              // Forgot Password Form
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={useMockMode ? "demo@healthping.com" : "Enter your email address"}
                  disabled={loading}
                  autoFocus
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
                <small className="form-hint">
                  We'll send a password reset link to this email address
                </small>
              </div>
            ) : (
              // Password Reset Form
              <>
                <div className="form-group">
                  <label className="form-label">New Password *</label>
                  <input
                    type="password"
                    name="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your new password"
                    disabled={loading}
                    autoFocus
                  />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                  <small className="form-hint">
                    Password must be at least 6 characters long
                  </small>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Confirm New Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    disabled={loading}
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              </>
            )}

            {useMockMode && (
              <div className="demo-notice">
                <div className="demo-notice-header">
                  🎯 Demo Mode Active
                </div>
                <div className="demo-notice-text">
                  {isResetMode 
                    ? 'Password reset will be simulated' 
                    : 'Email sending will be simulated'
                  }
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  {isResetMode ? 'Resetting Password...' : 'Sending Email...'}
                </>
              ) : (
                <>
                  {isResetMode ? '🔐 Reset Password' : '📧 Send Reset Link'}
                  {useMockMode && ' (Demo)'}
                </>
              )}
            </button>
          </form>
          
          <div className="forgot-password-footer">
            <div className="footer-links">
              <Link to="/login">← Back to Login</Link>
              {!isResetMode && (
                <>
                  <span>•</span>
                  <Link to="/register">Create Account</Link>
                </>
              )}
            </div>
            
            {!isResetMode && (
              <div className="security-note">
                <small>
                  🔒 For security reasons, we'll only send reset links to registered email addresses
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;