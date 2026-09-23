import React from 'react';
import { Users, BookOpen, Building2, Star } from 'lucide-react';
import './StatsCounter.css';

export default function StatsCounter() {
  const stats = [
    {
      id: 1,
      icon: Users,
      value: '200K+',
      label: 'Students Learning',
      bg: 'purple',
    },
    {
      id: 2,
      icon: BookOpen,
      value: '5K+',
      label: 'Courses & Resources',
      bg: 'blue',
    },
    {
      id: 3,
      icon: Building2,
      value: '500+',
      label: 'Partner Companies',
      bg: 'orange',
    },
    {
      id: 4,
      icon: Star,
      value: '90%',
      label: 'User Satisfaction',
      bg: 'green',
    },
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="stat-card card">
                <div className={`stat-icon-wrapper ${stat.bg}`}>
                  <Icon size={24} />
                </div>
                <div className="stat-info">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
