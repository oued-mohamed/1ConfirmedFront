// src/components/patients/PatientList.js
import React, { useState } from 'react';

const PatientList = ({ patients = [], onDelete, onUpdate, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [whatsappFilter, setWhatsappFilter] = useState('All Patients');

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Unknown';
    
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
  const filteredPatients = patients.filter(patient => {
    const nameMatch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    
    if (whatsappFilter === 'All Patients') {
      return nameMatch;
    } else if (whatsappFilter === 'WhatsApp Enabled') {
      return nameMatch && patient.whatsappOptIn;
    } else if (whatsappFilter === 'WhatsApp Disabled') {
      return nameMatch && !patient.whatsappOptIn;
    }
    
    return nameMatch;
  });

  const handleDelete = (patientId) => {
    if (onDelete) {
      onDelete(patientId);
    }
  };

  const handleEdit = (patient) => {
    // For now, just show patient info - you can implement edit form later
    alert(`Edit functionality for ${patient.name} - Coming soon!`);
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>All Patients ({patients.length})</h3>
          {patients.length > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={onRefresh}
              style={{ fontSize: '12px', padding: '4px 8px', marginTop: '5px' }}
            >
              🔄 Refresh
            </button>
          )}
        </div>
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
      
      {patients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
          <h3>No patients yet</h3>
          <p>Add your first patient to get started.</p>
        </div>
      ) : (
        <>
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
                      <div style={{ fontSize: '12px', color: '#718096' }}>{patient.email || 'No email'}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>{calculateAge(patient.dateOfBirth)} years</div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>{patient.gender || 'Not specified'}</div>
                    </div>
                  </td>
                  <td>{patient.lastVisit || 'Never'}</td>
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
                        onClick={() => handleEdit(patient)}
                      >
                        👁️ View
                      </button>
                      <button 
                        className="btn btn-primary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                        onClick={() => handleEdit(patient)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#ff6b6b', color: 'white' }}
                        onClick={() => handleDelete(patient.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPatients.length === 0 && patients.length > 0 && (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
              <h3>No patients found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientList;