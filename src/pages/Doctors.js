// src/pages/Doctors.js
import React, { useState, useEffect } from 'react';
import DoctorList from '../components/doctors/DoctorList';
import DoctorForm from '../components/doctors/DoctorForm';
import apiService from '../services/api';
import './Doctors.css';

const Doctors = () => {
  const [showForm, setShowForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load doctors when component mounts
  useEffect(() => {
    loadDoctors();
  }, []);

  // Function to load doctors from API
  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading doctors from API...');
      
      const response = await apiService.getDoctors();
      console.log('Doctors loaded:', response);
      
      if (response.success) {
        setDoctors(response.data || []);
      } else {
        setDoctors(response.data || []);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      setError(error.message);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle saving a new doctor
  const handleSaveDoctor = async (doctorData) => {
    try {
      console.log('Saving doctor via API:', doctorData);
      
      // Call the API to create the doctor
      const response = await apiService.createDoctor(doctorData);
      console.log('Doctor created response:', response);
      
      if (response.success) {
        console.log('Doctor created successfully!');
        
        // Add the new doctor to our local state
        setDoctors(prevDoctors => [...prevDoctors, response.data]);
        
        // Close the form
        setShowForm(false);
        
        // Show success message
        alert('Doctor created successfully!');
      } else {
        throw new Error(response.message || 'Failed to create doctor');
      }
    } catch (error) {
      console.error('Error creating doctor:', error);
      alert(`Error creating doctor: ${error.message}`);
    }
  };

  // Handle deleting a doctor
  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      console.log('Deleting doctor via API:', doctorId);
      
      const response = await apiService.deleteDoctor(doctorId);
      console.log('Doctor deleted response:', response);
      
      if (response.success) {
        // Remove the doctor from local state
        setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== doctorId));
        alert('Doctor deleted successfully!');
      } else {
        throw new Error(response.message || 'Failed to delete doctor');
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert(`Error deleting doctor: ${error.message}`);
    }
  };

  // Handle updating a doctor
  const handleUpdateDoctor = async (doctorId, doctorData) => {
    try {
      console.log('Updating doctor via API:', doctorId, doctorData);
      
      const response = await apiService.updateDoctor(doctorId, doctorData);
      console.log('Doctor updated response:', response);
      
      if (response.success) {
        // Update the doctor in local state
        setDoctors(prevDoctors => 
          prevDoctors.map(d => d.id === doctorId ? response.data : d)
        );
        alert('Doctor updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update doctor');
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert(`Error updating doctor: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="doctors-page">
        <div className="doctors-header">
          <h1>Doctor Management</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <h3>Loading doctors...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctors-page">
        <div className="doctors-header">
          <h1>Doctor Management</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            👨‍⚕️ Add New Doctor
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h3>Error loading doctors</h3>
          <p>{error}</p>
          <button 
            className="btn btn-secondary" 
            onClick={loadDoctors}
            style={{ marginTop: '20px' }}
          >
            🔄 Retry
          </button>
        </div>
        
        {showForm && (
          <DoctorForm 
            onClose={() => setShowForm(false)}
            onSave={handleSaveDoctor}
          />
        )}
      </div>
    );
  }

  return (
    <div className="doctors-page">
      <div className="doctors-header">
        <h1>Doctor Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          👨‍⚕️ Add New Doctor
        </button>
      </div>
      
      <DoctorList 
        doctors={doctors}
        onDelete={handleDeleteDoctor}
        onUpdate={handleUpdateDoctor}
        onRefresh={loadDoctors}
      />
      
      {showForm && (
        <DoctorForm 
          onClose={() => setShowForm(false)}
          onSave={handleSaveDoctor}
        />
      )}
    </div>
  );
};

export default Doctors;