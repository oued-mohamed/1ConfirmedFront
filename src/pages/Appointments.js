// src/pages/Appointments.js
import React, { useState } from 'react';
import AppointmentList from '../components/appointments/AppointmentList';
import AppointmentForm from '../components/appointments/AppointmentForm';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import './Appointments.css';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [showForm, setShowForm] = useState(false);
  const [newAppointments, setNewAppointments] = useState([]);

  // Handle saving a new appointment
  const handleSaveAppointment = (appointmentData) => {
    console.log('Parent component received new appointment:', appointmentData);
    
    // Create a new appointment object with required fields
    const newAppointment = {
      id: Date.now(), // Generate a unique ID
      patient: appointmentData.patientName,
      phone: appointmentData.phone,
      doctor: appointmentData.doctor,
      department: appointmentData.department,
      date: appointmentData.date,
      time: appointmentData.time,
      notes: appointmentData.notes,
      status: 'pending',
      whatsappSent: false
    };
    
    // Add the new appointment to our state
    setNewAppointments(prevAppointments => [...prevAppointments, newAppointment]);
    
    // Close the form
    setShowForm(false);
  };

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h1>Appointments Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          📅 New Appointment
        </button>
      </div>

      <div className="appointments-tabs">
        <button 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📋 List View
        </button>
        <button 
          className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar View
        </button>
      </div>

      <div className="appointments-content">
        {activeTab === 'list' && <AppointmentList newAppointments={newAppointments} />}
        {activeTab === 'calendar' && <AppointmentCalendar newAppointments={newAppointments} />}
      </div>

      {showForm && (
        <AppointmentForm 
          onClose={() => setShowForm(false)}
          onSave={handleSaveAppointment}
        />
      )}
    </div>
  );
};

export default Appointments;