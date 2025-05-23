// src/components/doctors/DoctorList.js
import React, { useState } from 'react';

const DoctorList = ({ newDoctors = [] }) => {
  // Original doctors (preserved)
  const originalDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      department: 'Cardiology',
      phone: '+1234567890',
      email: 'sarah.johnson@hospital.com',
      workingHours: '9:00 AM - 5:00 PM',
      status: 'active'
    },
    {
      id: 2,
      name: 'Dr. Michael Brown',
      specialization: 'Dermatology',
      department: 'Dermatology',
      phone: '+1234567891',
      email: 'michael.brown@hospital.com',
      workingHours: '10:00 AM - 6:00 PM',
      status: 'active'
    },
    {
      id: 3,
      name: 'Dr. Emily Lee',
      specialization: 'Orthopedics',
      department: 'Orthopedics',
      phone: '+1234567892',
      email: 'emily.lee@hospital.com',
      workingHours: '8:00 AM - 4:00 PM',
      status: 'on_leave'
    }
  ];

  // Combine original doctors with new doctors
  const allDoctors = [...originalDoctors, ...newDoctors];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Filter doctors based on search and department
  const filteredDoctors = allDoctors.filter(doctor => {
    const nameMatch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const departmentMatch = !departmentFilter || departmentFilter === 'All Departments' || doctor.department === departmentFilter;
    return nameMatch && departmentMatch;
  });

  return (
    <div className="card">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>All Doctors</h3>
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
                  <div style={{ fontSize: '12px', color: '#718096' }}>{doctor.email}</div>
                </div>
              </td>
              <td>{doctor.workingHours}</td>
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
                  >
                    📅 Schedule
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
      
      {filteredDoctors.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍⚕️</div>
          <h3>No doctors found</h3>
          <p>Try adjusting your search criteria or add a new doctor.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorList;