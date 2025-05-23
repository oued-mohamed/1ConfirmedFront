// src/components/appointments/AppointmentList.js
import React, { useState } from 'react';

const AppointmentList = ({ newAppointments = [] }) => {
  // Original appointments (preserved)
  const originalAppointments = [
    {
      id: 1,
      patient: 'John Smith',
      phone: '+1234567890',
      doctor: 'Dr. Johnson',
      department: 'Cardiology',
      date: '2024-01-15',
      time: '09:00',
      status: 'confirmed',
      whatsappSent: true
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      phone: '+1234567891',
      doctor: 'Dr. Brown',
      department: 'Dermatology',
      date: '2024-01-15',
      time: '10:30',
      status: 'pending',
      whatsappSent: false
    },
    {
      id: 3,
      patient: 'Mike Davis',
      phone: '+1234567892',
      doctor: 'Dr. Lee',
      department: 'Orthopedics',
      date: '2024-01-16',
      time: '14:00',
      status: 'confirmed',
      whatsappSent: true
    }
  ];

  // Combine original appointments with new appointments
  const allAppointments = [...originalAppointments, ...newAppointments];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Filter appointments based on search and status
  const filteredAppointments = allAppointments.filter(appointment => {
    const nameMatch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All Status' || appointment.status === statusFilter.toLowerCase();
    
    return nameMatch && statusMatch;
  });

  const handleSendReminder = (appointmentId) => {
    alert(`Sending WhatsApp reminder for appointment ${appointmentId}`);
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>All Appointments</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            className="form-select" 
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
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
            <th>Patient</th>
            <th>Doctor</th>
            <th>Department</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>WhatsApp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map(appointment => (
            <tr key={appointment.id}>
              <td>
                <div>
                  <div style={{ fontWeight: '600' }}>{appointment.patient}</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>{appointment.phone}</div>
                </div>
              </td>
              <td>{appointment.doctor}</td>
              <td>{appointment.department}</td>
              <td>
                <div>
                  <div>{appointment.date}</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>{appointment.time}</div>
                </div>
              </td>
              <td>
                <span className={`status-badge status-${appointment.status}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </td>
              <td>
                {appointment.whatsappSent ? (
                  <span style={{ color: '#25d366' }}>✅ Sent</span>
                ) : (
                  <span style={{ color: '#718096' }}>❌ Not sent</span>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-whatsapp"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => handleSendReminder(appointment.id)}
                  >
                    💬 Remind
                  </button>
                  <button 
                    className="btn btn-secondary"
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
      
      {filteredAppointments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📅</div>
          <h3>No appointments found</h3>
          <p>Try adjusting your search criteria or add a new appointment.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;