// src/components/layout/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/appointments', icon: '📅', label: 'Appointments' },
    { path: '/patients', icon: '👥', label: 'Patients' },
    { path: '/doctors', icon: '👨‍⚕️', label: 'Doctors' },
    { path: '/messaging', icon: '💬', label: 'Messaging' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

