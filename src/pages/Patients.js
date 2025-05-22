// src/pages/Patients.js
import React, { useState } from 'react';
import PatientList from '../components/patients/PatientList';
import PatientForm from '../components/patients/PatientForm';
import './Patients.css';

const Patients = () => {
  const [showForm, setShowForm] = useState(false);

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

      <PatientList />

      {showForm && (
        <PatientForm 
          onClose={() => setShowForm(false)}
          onSave={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Patients;

