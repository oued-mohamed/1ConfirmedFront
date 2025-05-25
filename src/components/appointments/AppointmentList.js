// src/components/appointments/AppointmentList.js
import React, { useState } from 'react';

const AppointmentList = ({ appointments = [], onDelete, onUpdate, onSendReminder, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter(appointment => {
    const nameMatch = appointment.patient?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const statusMatch = statusFilter === 'All Status' || appointment.status === statusFilter.toLowerCase();
    
    return nameMatch && statusMatch;
  });

  const handleSendReminder = (appointmentId) => {
    if (onSendReminder) {
      onSendReminder(appointmentId);
    } else {
      alert(`Sending WhatsApp reminder for appointment ${appointmentId}`);
    }
  };

  const handleEdit = (appointment) => {
    // For now, just show appointment info - you can implement edit form later
    alert(`Edit functionality for appointment with ${appointment.patient} - Coming soon!`);
  };

  const handleDelete = (appointmentId) => {
    if (onDelete) {
      onDelete(appointmentId);
    }
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>All Appointments ({appointments.length})</h3>
          {appointments.length > 0 && (
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
      
      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📅</div>
          <h3>No appointments yet</h3>
          <p>Schedule your first appointment to get started.</p>
        </div>
      ) : (
        <>
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
                      {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
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
                        onClick={() => handleEdit(appointment)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#ff6b6b', color: 'white' }}
                        onClick={() => handleDelete(appointment.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAppointments.length === 0 && appointments.length > 0 && (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
              <h3>No appointments found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentList;