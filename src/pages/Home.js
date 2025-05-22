// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <div className="container">
          <nav className="nav">
            <div className="logo">
              <div className="logo-icon">🏥</div>
              HealthPing
            </div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <Link to="/login" className="login-btn">Login</Link>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Never Miss Your <span className="highlight">Healthcare</span> Again</h1>
          <p>Smart appointment reminders delivered directly to your WhatsApp. Keep track of all your medical appointments with intelligent notifications and seamless hospital integration.</p>
          
          <div className="cta-buttons">
            <Link to="/login" className="btn-primary">
              📱 Get Started Free
            </Link>
            <a href="#demo" className="btn-secondary">
              ▶️ Watch Demo
            </a>
          </div>

          <div className="whatsapp-feature">
            <h3>💚 Powered by WhatsApp Integration</h3>
            <p>Receive appointment reminders, confirmations, and updates directly on WhatsApp - the app you already use every day!</p>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <h2>Why Choose HealthPing?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Smart Scheduling</h3>
              <p>Automatically sync with hospital systems and receive intelligent reminders 24 hours, 2 hours, and 30 minutes before your appointment.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>WhatsApp Notifications</h3>
              <p>Get appointment reminders on WhatsApp with one-click confirmation, rescheduling, and direct contact with your healthcare provider.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Multi-Hospital Support</h3>
              <p>Manage appointments across different hospitals and clinics from one unified dashboard with seamless integration.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Custom Reminders</h3>
              <p>Set personalized reminder preferences for medication, follow-ups, and pre-appointment preparations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Health Analytics</h3>
              <p>Track your appointment history, medication schedules, and health progress with detailed analytics and reports.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>HIPAA Compliant</h3>
              <p>Your health information is protected with enterprise-grade security and full HIPAA compliance standards.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-preview">
        <div className="container">
          <h2>Your Health Dashboard</h2>
          <div className="preview-container">
            <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Welcome back, Sarah! 👋</h3>
            <div className="mock-dashboard">
              <div className="mock-card">
                <h4>Upcoming Appointments</h4>
                <p>🩺 Dr. Smith - Cardiology<br />Tomorrow at 2:00 PM</p>
              </div>
              <div className="mock-card">
                <h4>Recent Reminders</h4>
                <p>💊 Blood pressure medication<br />Sent via WhatsApp ✓</p>
              </div>
              <div className="mock-card">
                <h4>Health Summary</h4>
                <p>📈 3 appointments this month<br />100% attendance rate</p>
              </div>
              <div className="mock-card">
                <h4>Quick Actions</h4>
                <p>📱 Schedule new appointment<br />🔄 Reschedule existing</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

