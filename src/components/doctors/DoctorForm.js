// src/components/doctors/DoctorForm.js
import React, { useState } from 'react';

const DoctorForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    department: '',
    phone: '',
    email: '',
    licenseNumber: '',
    workingHours: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('Saving doctor:', formData);
    
    // Call the onSave function passed from parent component with the form data
    if (onSave) {
      onSave(formData);
    } else {
      // If no onSave function was provided, just close the form
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>👨‍⚕️ New Doctor</h3>
          <button className="close-btn" onClick={onClose} disabled={isSubmitting}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="doctor-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="firstName"
                className="form-input"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                className="form-input"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <input
                type="text"
                name="specialization"
                className="form-input"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g., Cardiology"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@hospital.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                className="form-input"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="Medical license number"
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Working Hours</label>
              <input
                type="text"
                name="workingHours"
                className="form-input"
                value={formData.workingHours}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM - 5:00 PM"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              className="form-input"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Processing...' : '👨‍⚕️ Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;