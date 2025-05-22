// src/pages/Appointments.js
import React, { useState } from 'react';
import AppointmentList from '../components/appointments/AppointmentList';
import AppointmentForm from '../components/appointments/AppointmentForm';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import './Appointments.css';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [showForm, setShowForm] = useState(false);

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
        {activeTab === 'list' && <AppointmentList />}
        {activeTab === 'calendar' && <AppointmentCalendar />}
      </div>

      {showForm && (
        <AppointmentForm 
          onClose={() => setShowForm(false)}
          onSave={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Appointments;

