// src/components/patients/PatientList.js
import React, { useState } from 'react';

const PatientList = ({ newPatients = [] }) => {
  // Original patients (preserved)
  const originalPatients = [
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
  ];

  // Combine original patients with new patients
  const allPatients = [...originalPatients, ...newPatients];

  const [searchTerm, setSearchTerm] = useState('');
  const [whatsappFilter, setWhatsappFilter] = useState('All Patients');

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

  // Filter patients based on search and WhatsApp status
  const filteredPatients = allPatients.filter(patient => {
    const nameMatch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (whatsappFilter === 'All Patients') {
      return nameMatch;
    } else if (whatsappFilter === 'WhatsApp Enabled') {
      return nameMatch && patient.whatsappOptIn;
    } else if (whatsappFilter === 'WhatsApp Disabled') {
      return nameMatch && !patient.whatsappOptIn;
    }
    
    return nameMatch;
  });

  return (
    <div className="card">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>All Patients</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            className="form-select" 
            style={{ width: 'auto' }}
            value={whatsappFilter}
            onChange={(e) => setWhatsappFilter(e.target.value)}
          >
            <option>All Patients</option>
            <option>WhatsApp Enabled</option>
            <option>WhatsApp Disabled</option>
          </select>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search patients..."
            style={{ width: '200px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          {filteredPatients.map(patient => (
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
      
      {filteredPatients.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
          <h3>No patients found</h3>
          <p>Try adjusting your search criteria or add a new patient.</p>
        </div>
      )}
    </div>
  );
};

export default PatientList;