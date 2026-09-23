import React, { useState } from 'react';
import { MapPin, Clock, Bookmark, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import './LatestOpportunities.css';

export default function LatestOpportunities({ onViewAll }) {
  const [activeCategory, setActiveCategory] = useState('internships');

  const opportunities = {
    internships: [
      {
        id: 1,
        company: 'Google',
        logo: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
        title: 'Software Development Intern',
        location: 'Bengaluru (Hybrid)',
        stipend: '₹80,000 / mo',
        duration: '6 Months',
        tags: ['Web Development', 'Python', 'React'],
        posted: '2 days ago',
      },
      {
        id: 2,
        company: 'Microsoft',
        logo: 'https://cdn-icons-png.flaticon.com/512/732/732221.png',
        title: 'Data Science Intern',
        location: 'Hyderabad (Hybrid)',
        stipend: '₹60,000 / mo',
        duration: '3-6 Months',
        tags: ['Data Analysis', 'Python', 'SQL'],
        posted: '3 days ago',
      },
      {
        id: 3,
        company: 'Flipkart',
        logo: 'https://cdn-icons-png.flaticon.com/512/888/888849.png',
        title: 'Frontend Developer Intern',
        location: 'Work From Home',
        stipend: '₹40,000 / mo',
        duration: '3 Months',
        tags: ['React', 'TypeScript', 'UI/UX'],
        posted: '5 days ago',
      },
    ],
    jobs: [
      {
        id: 4,
        company: 'Amazon',
        logo: 'https://cdn-icons-png.flaticon.com/512/732/732177.png',
        title: 'Software Development Engineer I (SDE-1)',
        location: 'Bengaluru (On-site)',
        stipend: '₹20-28 LPA',
        duration: '0-2 Yrs Exp',
        tags: ['Java', 'Distributed Systems', 'AWS'],
        posted: '1 day ago',
      },
      {
        id: 5,
        company: 'TCS',
        logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968866.png',
        title: 'System Engineer - Digital',
        location: 'Pune (Hybrid)',
        stipend: '₹7-11 LPA',
        duration: 'Fresher',
        tags: ['Java', 'Spring Boot', 'SQL'],
        posted: '4 days ago',
      },
    ],
    govt: [
      {
        id: 6,
        company: 'ISRO 🇮🇳 (Indian Space Research Org)',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Indian_Space_Research_Organisation_Logo.svg',
        title: 'Scientist / Engineer - Computer Science',
        location: 'All India',
        stipend: '₹56,100 / mo + Allowances',
        duration: 'Govt Permanent',
        tags: ['Computer Science', 'Space Tech', 'Research'],
        posted: '5 days ago',
        isGovt: true,
      },
      {
        id: 7,
        company: 'DRDO 🇮🇳 (Def Research Org)',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/DRDO_Logo.svg',
        title: 'Junior Research Fellow (JRF - CSE)',
        location: 'New Delhi',
        stipend: '₹37,000 / mo',
        duration: '2 Years',
        tags: ['Cyber Security', 'C++', 'OS'],
        posted: '1 week ago',
        isGovt: true,
      },
    ],
  };

  const currentList = opportunities[activeCategory] || opportunities.internships;

  return (
    <section className="latest-opps-section">
      <div className="container">
        <div className="opps-header">
          <div>
            <span className="section-label">OPPORTUNITIES</span>
            <h2 className="section-title">
              Latest <span>Opportunities for You</span>
            </h2>
          </div>

          <div className="opps-tabs">
            <button 
              className={`tab-btn ${activeCategory === 'internships' ? 'active' : ''}`}
              onClick={() => setActiveCategory('internships')}
            >
              Internships
            </button>
            <button 
              className={`tab-btn ${activeCategory === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveCategory('jobs')}
            >
              Private Jobs
            </button>
            <button 
              className={`tab-btn ${activeCategory === 'govt' ? 'active' : ''}`}
              onClick={() => setActiveCategory('govt')}
            >
              Govt. Jobs 🇮🇳
            </button>
          </div>
        </div>

        <div className="opps-grid grid-cols-3">
          {currentList.map((item) => (
            <div key={item.id} className="opp-card card">
              <div className="opp-card-header">
                <div className="company-info">
                  <img src={item.logo} alt={item.company} className="company-logo" />
                  <div>
                    <h4 className="job-title">{item.title}</h4>
                    <p className="company-name">
                      {item.company} <CheckCircle2 size={13} className="verified-icon" />
                    </p>
                  </div>
                </div>
                <button className="bookmark-btn" title="Save opportunity">
                  <Bookmark size={16} />
                </button>
              </div>

              <div className="opp-tags-row">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="opp-tag">{tag}</span>
                ))}
              </div>

              <div className="opp-meta-row">
                <div className="meta-item">
                  <MapPin size={14} />
                  <span>{item.location}</span>
                </div>
                <div className="meta-item">
                  <Clock size={14} />
                  <span>{item.duration}</span>
                </div>
              </div>

              <div className="opp-card-footer">
                <div className="stipend-amount">{item.stipend}</div>
                <button className="btn-primary apply-btn" onClick={onViewAll}>
                  <span>Apply Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="opps-view-all">
          <button className="btn-secondary" onClick={onViewAll}>
            <span>View All Opportunities (520+ Active)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
