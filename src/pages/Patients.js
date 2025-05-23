// src/pages/Patients.js
import React, { useState } from 'react';
import PatientList from '../components/patients/PatientList';
import PatientForm from '../components/patients/PatientForm';
import './Patients.css';

const Patients = () => {
  const [showForm, setShowForm] = useState(false);
  const [newPatients, setNewPatients] = useState([]);

  // Handle saving a new patient
  const handleSavePatient = (patientData) => {
    console.log('Parent component received new patient:', patientData);
    
    // Create a new patient object with required fields
    const newPatient = {
      id: Date.now(), // Generate a unique ID
      name: `${patientData.firstName} ${patientData.lastName}`,
      phone: patientData.phone,
      email: patientData.email,
      dateOfBirth: patientData.dateOfBirth,
      gender: patientData.gender,
      address: patientData.address,
      emergencyContact: patientData.emergencyContact,
      whatsappOptIn: patientData.whatsappOptIn,
      lastVisit: new Date().toISOString().split('T')[0] // Set today as last visit
    };
    
    // Add the new patient to our state
    setNewPatients(prevPatients => [...prevPatients, newPatient]);
    
    // Close the form
    setShowForm(false);
  };

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
      
      <PatientList newPatients={newPatients} />
      
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