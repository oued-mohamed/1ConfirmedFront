// src/components/patients/PatientList.js
import React, { useState } from 'react';

const PatientList = () => {
  const [patients] = useState([
    {
      id: 1,
      name: 'John Smith',
      phone: '+1234567890',
      email: 'john@email.com',
      dateOfBirth: '1985-03-15',
      gender: 'Male',
      lastVisit: '2024-01-10',
      whatsappOptIn: true
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      phone: '+1234567891',
      email: 'sarah@email.com',
      dateOfBirth: '1990-07-22',
      gender: 'Female',
      lastVisit: '2024-01-08',
      whatsappOptIn: true
    },
    {
      id: 3,
      name: 'Mike Davis',
      phone: '+1234567892',
      email: 'mike@email.com',
      dateOfBirth: '1978-11-03',
      gender: 'Male',
      lastVisit: '2024-01-05',
      whatsappOptIn: false
    }
  ]);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>All Patients</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="form-select" style={{ width: 'auto' }}>
            <option>All Patients</option>
            <option>WhatsApp Enabled</option>
            <option>WhatsApp Disabled</option>
          </select>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search patients..."
            style={{ width: '200px' }}
          />
        </div>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Contact</th>
            <th>Age/Gender</th>
            <th>Last Visit</th>
            <th>WhatsApp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>
                <div style={{ fontWeight: '600' }}>{patient.name}</div>
              </td>
              <td>
                <div>
                  <div style={{ fontSize: '14px' }}>{patient.phone}</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>{patient.email}</div>
                </div>
              </td>
              <td>
                <div>
                  <div>{calculateAge(patient.dateOfBirth)} years</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>{patient.gender}</div>
                </div>
              </td>
              <td>{patient.lastVisit}</td>
              <td>
                {patient.whatsappOptIn ? (
                  <span style={{ color: '#25d366', fontWeight: '600' }}>✅ Enabled</span>
                ) : (
                  <span style={{ color: '#ff6b6b', fontWeight: '600' }}>❌ Disabled</span>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    👁️ View
                  </button>
                  <button 
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    ✏️ Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;

