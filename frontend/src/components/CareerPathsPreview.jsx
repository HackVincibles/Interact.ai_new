import React from 'react';
import { Code, BarChart3, Brain, ShieldCheck, Palette, LineChart, ArrowRight } from 'lucide-react';
import './CareerPathsPreview.css';

export default function CareerPathsPreview({ onExploreAll }) {
  const paths = [
    { id: 'software', title: 'Software Development', icon: Code, demand: 'High Demand', color: 'purple' },
    { id: 'data', title: 'Data Science & Analytics', icon: BarChart3, demand: 'High Demand', color: 'blue' },
    { id: 'ai', title: 'AI & Machine Learning', icon: Brain, demand: 'High Demand', color: 'pink' },
    { id: 'cyber', title: 'Cyber Security', icon: ShieldCheck, demand: 'High Demand', color: 'cyan' },
    { id: 'uiux', title: 'UI/UX Design', icon: Palette, demand: 'Medium Demand', color: 'yellow' },
    { id: 'analytics', title: 'Business Analytics', icon: LineChart, demand: 'Medium Demand', color: 'orange' },
  ];

  return (
    <section className="career-paths-preview-section">
      <div className="container">
        <div className="preview-header-row">
          <div>
            <span className="section-label">IN-DEMAND PATHS</span>
            <h2 className="section-title">
              Explore <span>In-Demand Career Paths</span>
            </h2>
          </div>
          <button className="btn-secondary explore-all-btn" onClick={onExploreAll}>
            <span>Explore All Paths</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="paths-preview-grid">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <div 
                key={path.id} 
                className="path-pill-card card"
                onClick={onExploreAll}
              >
                <div className={`path-icon-badge ${path.color}`}>
                  <Icon size={20} />
                </div>
                <div className="path-info">
                  <h4 className="path-name">{path.title}</h4>
                  <span className="demand-tag">{path.demand}</span>
                </div>
                <div className="path-arrow">
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
