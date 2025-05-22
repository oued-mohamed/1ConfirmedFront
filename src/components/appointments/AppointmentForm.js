// src/components/appointments/AppointmentForm.js
import React, { useState } from 'react';

const AppointmentForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    doctor: '',
    department: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving appointment:', formData);
    onSave();
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
          <h3>📅 New Appointment</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Patient Name *</label>
              <input
                type="text"
                name="patientName"
                className="form-input"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Doctor *</label>
              <select
                name="doctor"
                className="form-select"
                value={formData.doctor}
                onChange={handleChange}
                required
              >
                <option value="">Select Doctor</option>
                <option value="Dr. Johnson">Dr. Johnson</option>
                <option value="Dr. Brown">Dr. Brown</option>
                <option value="Dr. Lee">Dr. Lee</option>
                <option value="Dr. Martinez">Dr. Martinez</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time *</label>
              <input
                type="time"
                name="time"
                className="form-input"
                value={formData.time}
                onChange={handleChange}
                required
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
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              📅 Schedule Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;

