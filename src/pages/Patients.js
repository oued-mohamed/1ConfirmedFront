// src/pages/Patients.js
import React, { useState, useEffect } from 'react';
import PatientList from '../components/patients/PatientList';
import PatientForm from '../components/patients/PatientForm';
import apiService from '../services/api';
import './Patients.css';

const Patients = () => {
  const [showForm, setShowForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load patients when component mounts
  useEffect(() => {
    loadPatients();
  }, []);

  // Function to load patients from API
  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading patients from API...');
      
      const response = await apiService.getPatients();
      console.log('Patients loaded:', response);
      
      if (response.success) {
        setPatients(response.data || []);
      } else {
        setPatients(response.data || []);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      setError(error.message);
      // Set empty array on error
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle saving a new patient
  const handleSavePatient = async (patientData) => {
    try {
      console.log('Saving patient via API:', patientData);
      
      // Call the API to create the patient
      const response = await apiService.createPatient(patientData);
      console.log('Patient created response:', response);
      
      if (response.success) {
        console.log('Patient created successfully!');
        
        // Add the new patient to our local state
        setPatients(prevPatients => [...prevPatients, response.data]);
        
        // Close the form
        setShowForm(false);
        
        // Show success message (optional)
        alert('Patient created successfully!');
      } else {
        throw new Error(response.message || 'Failed to create patient');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      alert(`Error creating patient: ${error.message}`);
    }
  };

  // Handle deleting a patient
  const handleDeletePatient = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      console.log('Deleting patient via API:', patientId);
      
      const response = await apiService.deletePatient(patientId);
      console.log('Patient deleted response:', response);
      
      if (response.success) {
        // Remove the patient from local state
        setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
        alert('Patient deleted successfully!');
      } else {
        throw new Error(response.message || 'Failed to delete patient');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert(`Error deleting patient: ${error.message}`);
    }
  };

  // Handle updating a patient
  const handleUpdatePatient = async (patientId, patientData) => {
    try {
      console.log('Updating patient via API:', patientId, patientData);
      
      const response = await apiService.updatePatient(patientId, patientData);
      console.log('Patient updated response:', response);
      
      if (response.success) {
        // Update the patient in local state
        setPatients(prevPatients => 
          prevPatients.map(p => p.id === patientId ? response.data : p)
        );
        alert('Patient updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update patient');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      alert(`Error updating patient: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="patients-page">
        <div className="patients-header">
          <h1>Patient Management</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <h3>Loading patients...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patients-page">
        <div className="patients-header">
          <h1>Patient Management</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            👤 Add New Patient
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h3>Error loading patients</h3>
          <p>{error}</p>
          <button 
            className="btn btn-secondary" 
            onClick={loadPatients}
            style={{ marginTop: '20px' }}
          >
            🔄 Retry
          </button>
        </div>
        
        {showForm && (
          <PatientForm 
            onClose={() => setShowForm(false)}
            onSave={handleSavePatient}
          />
        )}
      </div>
    );
  }

  return (
    <div className="patients-page">
      <div className="patients-header">
        <h1>Patient Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          👤 Add New Patient
        </button>
      </div>
      
      <PatientList 
        patients={patients}
        onDelete={handleDeletePatient}
        onUpdate={handleUpdatePatient}
        onRefresh={loadPatients}
      />
      
      {showForm && (
        <PatientForm 
          onClose={() => setShowForm(false)}
          onSave={handleSavePatient}
        />
      )}
    </div>
  );
};

export default Patients;