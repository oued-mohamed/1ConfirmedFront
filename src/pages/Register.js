// src/pages/Register.js - COMPLETE FIXED VERSION
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'doctor',
    specialization: '',
    phone: '',
    licenseNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [backendStatus, setBackendStatus] = useState('checking');
  const [useMockMode, setUseMockMode] = useState(false);
  const { register, error } = useAuth();
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

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Role-specific validation
    if (formData.role === 'doctor') {
      if (!formData.specialization.trim()) {
        newErrors.specialization = 'Specialization is required for doctors';
      }
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'License number is required for doctors';
      }
    }

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Current form data:', formData);
    
    if (!validateForm()) {
      console.log('Validation failed, not submitting');
      return;
    }

    console.log('Validation passed, proceeding with submission');
    setLoading(true);

    try {
      if (useMockMode || backendStatus === 'disconnected') {
        console.log('Using mock registration');
        const response = await ApiService.mockRegister(formData);
        console.log('Mock registration response:', response);
        alert('Demo registration successful!');
        navigate('/dashboard');
      } else {
        console.log('Using real registration');
        const registrationData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          ...(formData.role === 'doctor' && {
            specialization: formData.specialization,
            licenseNumber: formData.licenseNumber
          })
        };

        console.log('Attempting registration with data:', registrationData);
        const response = await register(registrationData);
        console.log('Registration response:', response);
        alert('Registration successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert(`Registration failed: ${err.message}`);
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

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <Link to="/" className="logo">
            <div className="logo-icon">🏥</div>
            <span>HealthPing</span>
          </Link>
        </div>
        
        <div className="register-card">
          <h2>Create Your Account</h2>
          <p>Join HealthPing to manage appointments with WhatsApp integration</p>
          
          <BackendStatusIndicator />
          
          {error && <div className="error-message">{error}</div>}
          
          {/* Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              <strong>⚠️ Please fix these errors:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} style={{ color: '#856404' }}>
                    <strong>{field}:</strong> {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  disabled={loading}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  disabled={loading}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder={useMockMode ? "demo@healthping.com" : "Enter your email"}
                disabled={loading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password (min 6 chars)"
                  disabled={loading}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  disabled={loading}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Role *</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  disabled={loading}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            {/* THIS IS THE MISSING SECTION - DOCTOR FIELDS */}
            {formData.role === 'doctor' && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    className={`form-input ${errors.specialization ? 'error' : ''}`}
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Cardiology"
                    disabled={loading}
                  />
                  {errors.specialization && <span className="error-text">{errors.specialization}</span>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">License Number *</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    className={`form-input ${errors.licenseNumber ? 'error' : ''}`}
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Medical license number"
                    disabled={loading}
                  />
                  {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
                </div>
              </div>
            )}

            {useMockMode && (
              <div className="demo-notice">
                <div className="demo-notice-header">
                  🎯 Demo Mode Active
                </div>
                <div className="demo-notice-text">
                  Registration will work without backend connection
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary register-submit"
              disabled={loading}
              onClick={() => console.log('Button clicked!')}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  Creating Account...
                </>
              ) : (
                `👤 Create Account ${useMockMode ? '(Demo)' : ''}`
              )}
            </button>
            
            {/* Debug button for testing */}
            <button 
              type="button"
              onClick={() => {
                console.log('=== DEBUG INFO ===');
                console.log('Form data:', formData);
                console.log('Errors:', errors);
                console.log('Validation result:', validateForm());
                console.log('Backend status:', backendStatus);
                console.log('Mock mode:', useMockMode);
                console.log('Loading:', loading);
              }}
              style={{ 
                width: '100%', 
                marginTop: '10px', 
                padding: '8px',
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🐛 Debug: Check Form State (Click Me First!)
            </button>
          </form>
          
          <div className="register-footer">
            <span>Already have an account?</span>
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;