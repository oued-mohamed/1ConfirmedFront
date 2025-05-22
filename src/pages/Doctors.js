// src/pages/Doctors.js
import React, { useState } from 'react';
import DoctorList from '../components/doctors/DoctorList';
import DoctorForm from '../components/doctors/DoctorForm';
import './Doctors.css';

const Doctors = () => {
  const [showForm, setShowForm] = useState(false);

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

      <DoctorList />

      {showForm && (
        <DoctorForm 
          onClose={() => setShowForm(false)}
          onSave={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Doctors;

