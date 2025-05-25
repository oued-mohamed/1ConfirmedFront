// src/components/doctors/DoctorList.js
import React, { useState } from 'react';

const DoctorList = ({ doctors = [], onDelete, onUpdate, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Filter doctors based on search and department
  const filteredDoctors = doctors.filter(doctor => {
    const nameMatch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const departmentMatch = !departmentFilter || departmentFilter === 'All Departments' || doctor.department === departmentFilter;
    return nameMatch && departmentMatch;
  });

  const handleDelete = (doctorId) => {
    if (onDelete) {
      onDelete(doctorId);
    }
  };

  const handleEdit = (doctor) => {
    // For now, just show doctor info - you can implement edit form later
    alert(`Edit functionality for ${doctor.name} - Coming soon!`);
  };

  const handleSchedule = (doctor) => {
    alert(`Schedule functionality for ${doctor.name} - Coming soon!`);
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>All Doctors ({doctors.length})</h3>
          {doctors.length > 0 && (
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
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option>All Departments</option>
            <option>Cardiology</option>
            <option>Dermatology</option>
            <option>Orthopedics</option>
            <option>Pediatrics</option>
            <option>General Medicine</option>
          </select>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search doctors..."
            style={{ width: '200px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {doctors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍⚕️</div>
          <h3>No doctors yet</h3>
          <p>Add your first doctor to get started.</p>
        </div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Contact</th>
                <th>Working Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{doctor.name}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{doctor.department}</div>
                  </td>
                  <td>{doctor.specialization}</td>
                  <td>
                    <div>
                      <div style={{ fontSize: '14px' }}>{doctor.phone}</div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>{doctor.email || 'No email'}</div>
                    </div>
                  </td>
                  <td>{doctor.workingHours || '9:00 AM - 5:00 PM'}</td>
                  <td>
                    <span className={`status-badge ${doctor.status === 'active' ? 'status-confirmed' : 'status-pending'}`}>
                      {doctor.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                        onClick={() => handleSchedule(doctor)}
                      >
                        📅 Schedule
                      </button>
                      <button 
                        className="btn btn-primary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                        onClick={() => handleEdit(doctor)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#ff6b6b', color: 'white' }}
                        onClick={() => handleDelete(doctor.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredDoctors.length === 0 && doctors.length > 0 && (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
              <h3>No doctors found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorList;