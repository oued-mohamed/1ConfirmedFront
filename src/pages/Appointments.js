// src/pages/Appointments.js
import React, { useState, useEffect } from 'react';
import AppointmentList from '../components/appointments/AppointmentList';
import AppointmentForm from '../components/appointments/AppointmentForm';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import apiService from '../services/api';
import './Appointments.css';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load appointments when component mounts
  useEffect(() => {
    loadAppointments();
  }, []);

  // Function to load appointments from API
  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading appointments from API...');
      
      const response = await apiService.getAppointments();
      console.log('Appointments loaded:', response);
      
      if (response.success) {
        setAppointments(response.data || []);
      } else {
        setAppointments(response.data || []);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError(error.message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle saving a new appointment
  const handleSaveAppointment = async (appointmentData) => {
    try {
      console.log('Saving appointment via API:', appointmentData);
      
      // Call the API to create the appointment
      const response = await apiService.createAppointment(appointmentData);
      console.log('Appointment created response:', response);
      
      if (response.success) {
        console.log('Appointment created successfully!');
        
        // Add the new appointment to our local state
        setAppointments(prevAppointments => [...prevAppointments, response.data]);
        
        // Close the form
        setShowForm(false);
        
        // Show success message
        alert('Appointment created successfully!');
      } else {
        throw new Error(response.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert(`Error creating appointment: ${error.message}`);
    }
  };

  // Handle deleting an appointment
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      console.log('Deleting appointment via API:', appointmentId);
      
      const response = await apiService.deleteAppointment(appointmentId);
      console.log('Appointment deleted response:', response);
      
      if (response.success) {
        // Remove the appointment from local state
        setAppointments(prevAppointments => 
          prevAppointments.filter(a => a.id !== appointmentId)
        );
        alert('Appointment deleted successfully!');
      } else {
        throw new Error(response.message || 'Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert(`Error deleting appointment: ${error.message}`);
    }
  };

  // Handle updating an appointment
  const handleUpdateAppointment = async (appointmentId, appointmentData) => {
    try {
      console.log('Updating appointment via API:', appointmentId, appointmentData);
      
      const response = await apiService.updateAppointment(appointmentId, appointmentData);
      console.log('Appointment updated response:', response);
      
      if (response.success) {
        // Update the appointment in local state
        setAppointments(prevAppointments => 
          prevAppointments.map(a => a.id === appointmentId ? response.data : a)
        );
        alert('Appointment updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert(`Error updating appointment: ${error.message}`);
    }
  };

  // Handle sending appointment reminder
  const handleSendReminder = async (appointmentId) => {
    try {
      console.log('Sending reminder via API:', appointmentId);
      
      const response = await apiService.sendAppointmentReminder(appointmentId);
      console.log('Reminder sent response:', response);
      
      if (response.success) {
        // Update the appointment to mark WhatsApp as sent
        setAppointments(prevAppointments => 
          prevAppointments.map(a => 
            a.id === appointmentId ? {...a, whatsappSent: true} : a
          )
        );
        alert('Reminder sent successfully!');
      } else {
        throw new Error(response.message || 'Failed to send reminder');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert(`Error sending reminder: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="appointments-page">
        <div className="appointments-header">
          <h1>Appointments Management</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <h3>Loading appointments...</h3>
        </div>
      </div>
    );
  }

  if (error) {
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
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h3>Error loading appointments</h3>
          <p>{error}</p>
          <button 
            className="btn btn-secondary" 
            onClick={loadAppointments}
            style={{ marginTop: '20px' }}
          >
            🔄 Retry
          </button>
        </div>
        
        {showForm && (
          <AppointmentForm 
            onClose={() => setShowForm(false)}
            onSave={handleSaveAppointment}
          />
        )}
      </div>
    );
  }

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
        {activeTab === 'list' && (
          <AppointmentList 
            appointments={appointments}
            onDelete={handleDeleteAppointment}
            onUpdate={handleUpdateAppointment}
            onSendReminder={handleSendReminder}
            onRefresh={loadAppointments}
          />
        )}
        {activeTab === 'calendar' && (
          <AppointmentCalendar 
            appointments={appointments}
            onRefresh={loadAppointments}
          />
        )}
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