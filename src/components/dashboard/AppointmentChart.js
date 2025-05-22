// src/components/dashboard/AppointmentChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AppointmentChart = () => {
  const data = [
    { name: 'Mon', appointments: 12, confirmed: 10 },
    { name: 'Tue', appointments: 15, confirmed: 14 },
    { name: 'Wed', appointments: 18, confirmed: 16 },
    { name: 'Thu', appointments: 22, confirmed: 20 },
    { name: 'Fri', appointments: 25, confirmed: 24 },
    { name: 'Sat', appointments: 8, confirmed: 7 },
    { name: 'Sun', appointments: 5, confirmed: 5 }
  ];

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Weekly Appointments Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#718096" />
          <YAxis stroke="#718096" />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="appointments" 
            stroke="#667eea" 
            strokeWidth={3}
            name="Total Appointments"
          />
          <Line 
            type="monotone" 
            dataKey="confirmed" 
            stroke="#25d366" 
            strokeWidth={3}
            name="Confirmed"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AppointmentChart;

