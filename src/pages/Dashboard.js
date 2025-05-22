// src/pages/Dashboard.js
import React from 'react';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import AppointmentChart from '../components/dashboard/AppointmentChart';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import ResponseRateWidget from '../components/dashboard/ResponseRateWidget';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your appointments today.</p>
      </div>
      
      <StatisticsCards />
      
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <AppointmentChart />
          <RecentAppointments />
        </div>
        <div className="dashboard-sidebar">
          <ResponseRateWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

