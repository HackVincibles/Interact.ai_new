import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Compass, 
  BookOpen, 
  Briefcase, 
  Award, 
  Mic, 
  FileText, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Bookmark, 
  GraduationCap, 
  TrendingUp 
} from 'lucide-react';
import './HomePage.css';

export default function HomePage({ onNavigate, onWatchDemo }) {
  const [oppTab, setOppTab] = useState('internships');

  const exploreCards = [
    {
      id: 'career-paths',
      title: 'Career Paths',
      desc: 'Discover the right career options for you',
      icon: Compass,
      color: 'purple',
    },
    {
      id: 'courses',
      title: 'Courses & Certifications',
      desc: 'Learn industry-relevant skills and get certified',
      icon: BookOpen,
      color: 'orange',
    },
    {
      id: 'internships',
      title: 'Internships',
      desc: 'Find and apply for internship opportunities',
      icon: Briefcase,
      color: 'blue',
    },
    {
      id: 'jobs',
      title: 'Jobs',
      desc: 'Explore job opportunities suitable for you',
      icon: Award,
      color: 'red',
    },
    {
      id: 'mock-interviews',
      title: 'Mock Interviews',
      desc: 'Practice and get real feedback',
      icon: Mic,
      color: 'purple-dark',
    },
    {
      id: 'resources',
      title: 'Resources',
      desc: 'Access guides, templates and useful tools',
      icon: FileText,
      color: 'green',
    },
  ];

  const steps = [
    { num: 1, title: 'Explore', desc: 'Find career options based on your interests.' },
    { num: 2, title: 'Learn', desc: 'Take curated courses and build relevant skills.' },
    { num: 3, title: 'Practice', desc: 'Improve with mock interviews and real questions.' },
    { num: 4, title: 'Apply', desc: 'Get matched with internships and jobs.' },
  ];

  const opportunitiesData = {
    internships: [
      {
        id: 1,
        company: 'Google',
        logo: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
        title: 'Software Development Intern',
        location: 'Remote',
        stipend: '₹50K/month',
        duration: '3-6 months',
        posted: '2 days ago',
      },
      {
        id: 2,
        company: 'Microsoft',
        logo: 'https://cdn-icons-png.flaticon.com/512/732/732221.png',
        title: 'Data Science Intern',
        location: 'Bengaluru',
        stipend: '₹60K/month',
        duration: '3-6 months',
        posted: '2 days ago',
      },
      {
        id: 3,
        company: 'Flipkart',
        logo: 'https://cdn-icons-png.flaticon.com/512/888/888849.png',
        title: 'Frontend Developer Intern',
        location: 'Remote',
        stipend: '₹40K/month',
        duration: '3-6 months',
        posted: '5 days ago',
      },
    ],
    jobs: [
      {
        id: 4,
        company: 'Amazon',
        logo: 'https://cdn-icons-png.flaticon.com/512/732/732177.png',
        title: 'SDE-1 Software Engineer',
        location: 'Bengaluru',
        stipend: '₹22 LPA',
        duration: 'Full-time',
        posted: '1 day ago',
      },
      {
        id: 5,
        company: 'TCS',
        logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968866.png',
        title: 'Digital Systems Engineer',
        location: 'Pune',
        stipend: '₹8 LPA',
        duration: 'Full-time',
        posted: '3 days ago',
      },
    ],
    govt: [
      {
        id: 6,
        company: 'ISRO 🇮🇳',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Indian_Space_Research_Organisation_Logo.svg',
        title: 'Scientist / Engineer (CS)',
        location: 'All India',
        stipend: '₹56,100/mo',
        duration: 'Govt Permanent',
        posted: '4 days ago',
      },
    ],
  };

  const currentOpps = opportunitiesData[oppTab] || opportunitiesData.internships;

  return (
    <div className="home-page-root animate-fade-in">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="container home-hero-container">
          {/* Left Text */}
          <div className="home-hero-left">
            <div className="top-ai-badge">
              <Sparkles size={14} className="sparkle-gold" />
              <span>AI-Powered Career Guidance for Students</span>
            </div>

            <h1 className="home-hero-heading">
              Your Journey From <br />
              <span className="purple-gradient-text">Campus to Corporate</span>
            </h1>

            <p className="home-hero-subtext">
              Discover career paths, learn in-demand skills, find opportunities and get hired — all in one place.
            </p>

            <div className="home-hero-buttons">
              <button className="btn-primary-purple" onClick={() => onNavigate('courses')}>
                <span>Get Started</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="home-social-proof">
              <div className="proof-avatars">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Student" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" alt="Student" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" alt="Student" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120" alt="Student" />
              </div>
              <p className="proof-label">
                Trusted by <strong>10,000+</strong> students from 200+ colleges
              </p>
            </div>
          </div>

          {/* Right Visual Graphic with 4 Floating Chips */}
          <div className="home-hero-right">
            <div className="hero-graphic-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                alt="Student collaborating" 
                className="hero-main-illustration"
              />

              {/* Dynamic Floating Chips */}
              <div className="floating-chip chip-learn">
                <div className="chip-icon-box orange"><BookOpen size={16} /></div>
                <div className="chip-details">
                  <strong className="chip-title">Learn Skills</strong>
                </div>
              </div>

              <div className="floating-chip chip-cert">
                <div className="chip-icon-box purple"><Award size={16} /></div>
                <div className="chip-details">
                  <strong className="chip-title">Get Certified</strong>
                </div>
              </div>

              <div className="floating-chip chip-intern">
                <div className="chip-icon-box blue"><Briefcase size={16} /></div>
                <div className="chip-details">
                  <strong className="chip-title">Find Internships</strong>
                </div>
              </div>

              <div className="floating-chip chip-hire">
                <div className="chip-icon-box green"><TrendingUp size={16} /></div>
                <div className="chip-details">
                  <strong className="chip-title">Get Hired</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Explore - Everything You Need for Your Career */}
      <section className="home-explore-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">EXPLORE</span>
            <h2 className="section-title">
              Everything You Need for <span className="purple-gradient-text">Your Career</span>
            </h2>
            <p className="section-subtitle mx-auto">Choose a section to get started</p>
          </div>

          <div className="explore-cards-grid">
            {exploreCards.map((card) => {
              const Icon = card.icon;
              return (
                <div 
                  key={card.id} 
                  className="explore-white-card card-base"
                  onClick={() => onNavigate(card.id)}
                >
                  <div className={`explore-icon-circle ${card.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="explore-title">{card.title}</h3>
                  <p className="explore-desc">{card.desc}</p>
                  <div className="explore-arrow">
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section className="home-how-it-works-section">
        <div className="container">
          <div className="how-grid-2">
            <div className="how-left-timeline">
              <span className="section-label">HOW IT WORKS</span>
              <h2 className="section-title">
                A Simple Path to a <span className="purple-gradient-text">Brighter Future</span>
              </h2>
              <p className="section-subtitle">Follow a few simple steps and get closer to your dream career.</p>

              <div className="steps-list">
                {steps.map((s) => (
                  <div key={s.num} className="step-row">
                    <div className="step-circle">{s.num}</div>
                    <div className="step-text">
                      <h4 className="step-heading">{s.title}</h4>
                      <p className="step-paragraph">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-primary-purple" onClick={() => onNavigate('courses')}>
                <span>Get Started</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="how-right-laptop">
              <div className="laptop-mockup-frame">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=700" 
                  alt="Platform Laptop Showcase" 
                  className="laptop-screen-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Opportunities - Latest Opportunities for You */}
      <section className="home-opps-section">
        <div className="container">
          <div className="opps-header-bar">
            <div>
              <span className="section-label">OPPORTUNITIES</span>
              <h2 className="section-title">
                Latest <span className="purple-gradient-text">Opportunities for You</span>
              </h2>
            </div>

            <div className="opps-pills-nav">
              <button 
                className={`opp-pill ${oppTab === 'internships' ? 'active' : ''}`}
                onClick={() => setOppTab('internships')}
              >
                Internships
              </button>
              <button 
                className={`opp-pill ${oppTab === 'jobs' ? 'active' : ''}`}
                onClick={() => setOppTab('jobs')}
              >
                Jobs
              </button>
              <button 
                className={`opp-pill ${oppTab === 'govt' ? 'active' : ''}`}
                onClick={() => setOppTab('govt')}
              >
                Govt. Jobs 🇮🇳
              </button>
              <button className="opp-view-all" onClick={() => onNavigate('jobs')}>
                View All →
              </button>
            </div>
          </div>

          <div className="opps-3-cards-grid">
            {currentOpps.map((item) => (
              <div key={item.id} className="home-opp-card card-base">
                <div className="card-top-row">
                  <div className="company-badge-group">
                    <img src={item.logo} alt={item.company} className="co-logo" />
                    <div>
                      <h4 className="card-job-title">{item.title}</h4>
                      <p className="card-co-name">{item.company} • {item.location}</p>
                    </div>
                  </div>
                  <button className="bookmark-icon-btn"><Bookmark size={16} /></button>
                </div>

                <div className="card-pills-row">
                  <span className="info-pill">{item.stipend}</span>
                  <span className="info-pill">{item.duration}</span>
                </div>

                <div className="card-bottom-row">
                  <span className="posted-time">{item.posted}</span>
                  <button className="btn-primary-purple apply-sm-btn" onClick={() => onNavigate('jobs')}>
                    <span>Apply Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Your Next Opportunity Awaits */}
      <section className="home-cta-banner-section">
        <div className="container">
          <div className="home-cta-card">
            <div className="cta-left-info">
              <span className="section-label">YOUR NEXT OPPORTUNITY AWAITS</span>
              <h2 className="cta-main-title">
                Take the Next Step towards <br />
                <span className="purple-gradient-text">Your Dream Career</span>
              </h2>
              <p className="cta-sub-info">
                Join thousands of students who are building their future with Interact.ai.
              </p>
              <button className="btn-primary-purple" onClick={() => onNavigate('courses')}>
                <span>Get Started for Free</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="cta-right-graphic">
              <div className="cap-books-container">
                <GraduationCap size={72} className="purple-cap-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
