// src/components/layout/Header.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">🏥</div>
            <span className="logo-text">HealthPing</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-menu">
            <div className="user-avatar">{user?.avatar}</div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button className="logout-btn" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

