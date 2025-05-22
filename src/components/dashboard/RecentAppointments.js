// src/components/dashboard/RecentAppointments.js
import React from 'react';

const RecentAppointments = () => {
  const appointments = [
    {
      id: 1,
      patient: 'John Smith',
      doctor: 'Dr. Johnson',
      time: '09:00 AM',
      status: 'confirmed',
      type: 'Cardiology'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      doctor: 'Dr. Brown',
      time: '10:30 AM',
      status: 'pending',
      type: 'Dermatology'
    },
    {
      id: 3,
      patient: 'Mike Davis',
      doctor: 'Dr. Lee',
      time: '02:00 PM',
      status: 'confirmed',
      type: 'Orthopedics'
    },
    {
      id: 4,
      patient: 'Emily Chen',
      doctor: 'Dr. Martinez',
      time: '03:30 PM',
      status: 'cancelled',
      type: 'Pediatrics'
    }
  ];

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Today's Appointments</h3>
      <div className="appointments-list">
        {appointments.map(appointment => (
          <div key={appointment.id} className="appointment-item">
            <div className="appointment-info">
              <div className="patient-name">{appointment.patient}</div>
              <div className="appointment-details">
                {appointment.doctor} • {appointment.type} • {appointment.time}
              </div>
            </div>
            <span className={`status-badge status-${appointment.status}`}>
              {appointment.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAppointments;

