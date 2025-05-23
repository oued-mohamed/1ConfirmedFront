// src/pages/Doctors.js
import React, { useState } from 'react';
import DoctorList from '../components/doctors/DoctorList';
import DoctorForm from '../components/doctors/DoctorForm';
import './Doctors.css';

const Doctors = () => {
  const [showForm, setShowForm] = useState(false);
  const [newDoctors, setNewDoctors] = useState([]);

  // Handle saving a new doctor
  const handleSaveDoctor = (doctorData) => {
    console.log('Parent component received new doctor:', doctorData);
    
    // Create a new doctor object with required fields
    const newDoctor = {
      id: Date.now(), // Generate a unique ID
      name: `Dr. ${doctorData.firstName} ${doctorData.lastName}`,
      specialization: doctorData.specialization,
      department: doctorData.department,
      phone: doctorData.phone,
      email: doctorData.email,
      workingHours: doctorData.workingHours || '9:00 AM - 5:00 PM',
      status: 'active'
    };
    
    // Add the new doctor to our state
    setNewDoctors(prevDoctors => [...prevDoctors, newDoctor]);
    
    // Close the form
    setShowForm(false);
  };

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
      
      <DoctorList newDoctors={newDoctors} />
      
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