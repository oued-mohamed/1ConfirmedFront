// src/components/dashboard/StatisticsCards.js
import React from 'react';
import './StatisticsCards.css';

const StatisticsCards = () => {
  const stats = [
    {
      title: 'Total Appointments',
      value: '156',
      change: '+12%',
      changeType: 'positive',
      icon: '📅',
      color: '#667eea'
    },
    {
      title: 'Confirmed Today',
      value: '23',
      change: '+5%',
      changeType: 'positive',
      icon: '✅',
      color: '#25d366'
    },
    {
      title: 'Response Rate',
      value: '94%',
      change: '+2%',
      changeType: 'positive',
      icon: '📊',
      color: '#ffd89b'
    },
    {
      title: 'No Shows',
      value: '4',
      change: '-8%',
      changeType: 'negative',
      icon: '❌',
      color: '#ff6b6b'
    }
  ];

  return (
    <div className="statistics-cards">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon" style={{ background: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <h3>{stat.title}</h3>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.changeType}`}>
              {stat.change} from last month
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;

