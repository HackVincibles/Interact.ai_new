import React from 'react';
import { Compass, BookOpen, Briefcase, Mic, FileText, ArrowRight, Award } from 'lucide-react';
import './FeatureGrid.css';

export default function FeatureGrid({ onSelectFeature }) {
  const features = [
    {
      id: 'career-paths',
      title: 'Career Paths',
      description: 'Explore tailored career options based on your interests, academic profile and skill level.',
      icon: Compass,
      color: 'purple',
    },
    {
      id: 'courses',
      title: 'Courses & Certifications',
      description: 'Access top curated courses from NPTEL, IIITs, Google, IBM, Coursera and Udemy in one place.',
      icon: BookOpen,
      color: 'orange',
    },
    {
      id: 'internships',
      title: 'Internships',
      description: 'Find paid & WFH internships from top product startups and verified platforms.',
      icon: Briefcase,
      color: 'blue',
    },
    {
      id: 'jobs',
      title: 'Jobs',
      description: 'Explore private tech roles & government opportunities (ISRO, DRDO, PSUs) matched to your resume.',
      icon: Award,
      color: 'red',
    },
    {
      id: 'mock-interviews',
      title: 'Mock Interviews',
      description: 'Practice 15-60 min technical & HR mock interviews with live code editor & instant AI PDF report.',
      icon: Mic,
      color: 'purple-dark',
    },
    {
      id: 'resources',
      title: 'Resources',
      description: 'Access curated DSA roadmaps, ATS resume templates, study guides, and interview question banks.',
      icon: FileText,
      color: 'green',
    },
  ];

  return (
    <section className="feature-grid-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">EXPLORE SERVICES</span>
          <h2 className="section-title">
            Everything You Need for a <span>Successful Career</span>
          </h2>
          <p className="section-subtitle">
            Get the right guidance, resources and real opportunities at every step from campus to corporate.
          </p>
        </div>

        <div className="feature-grid grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.id} 
                className="feature-card card"
                onClick={() => onSelectFeature && onSelectFeature(feature.id)}
              >
                <div className={`feature-icon-badge ${feature.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.description}</p>
                <div className="feature-card-footer">
                  <span className="action-text">Explore now</span>
                  <div className="arrow-circle">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
