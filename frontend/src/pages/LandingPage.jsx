import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Building2, 
  Star, 
  GraduationCap, 
  Mic, 
  Briefcase, 
  Code, 
  BarChart3, 
  Brain, 
  ShieldCheck, 
  Palette, 
  LineChart, 
  ChevronLeft, 
  ChevronRight,
  Book,
  Compass
} from 'lucide-react';
import LiveOrb from '../components/LiveOrb';
import FAQSection from '../components/FAQSection';
import './LandingPage.css';

export default function LandingPage({ onGetStarted, onNavigate }) {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'B.Tech CSE, Delhi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'Interact.ai helped me find the right roadmap and improve my interview skills. I got my first internship easily.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Rahul Verma',
      role: 'B.Tech IT, Bhopal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      text: 'The mock interviews and feedback really improved my confidence. Great platform for students.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Sneha Gupta',
      role: 'BCA, Indore',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      text: 'Quality content and real opportunities. Interact.ai made my career preparation much easier.',
      rating: 5,
    },
  ];

  const careerPaths = [
    { id: 'software', title: 'Software Development', icon: Code, color: 'blue' },
    { id: 'datascience', title: 'Data Science & Analytics', icon: BarChart3, color: 'cyan' },
    { id: 'aiml', title: 'AI & Machine Learning', icon: Brain, color: 'purple' },
    { id: 'cyber', title: 'Cyber Security', icon: ShieldCheck, color: 'blue-dark' },
    { id: 'uiux', title: 'UI/UX Design', icon: Palette, color: 'pink' },
    { id: 'analytics', title: 'Business Analytics', icon: LineChart, color: 'orange' },
  ];

  return (
    <div className="landing-page-root animate-fade-in">
      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="container landing-hero-container">
          {/* Left Text */}
          <div className="hero-text-side">
            <h1 className="hero-main-heading">
              Campus to <br />
              <span className="purple-gradient-text">Corporate</span>
            </h1>
            <p className="hero-description-text">
              Learn industry-relevant skills, practice with real-world tools, and get career-ready with Interact.ai.
            </p>

            <button className="btn-primary-purple hero-cta-btn" onClick={onGetStarted}>
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>

            <div className="hero-check-badges">
              <div className="check-badge-item">
                <CheckCircle2 size={16} className="badge-check-icon" />
                <span>Curated content</span>
              </div>
              <div className="check-badge-item">
                <CheckCircle2 size={16} className="badge-check-icon" />
                <span>For students & freshers</span>
              </div>
              <div className="check-badge-item">
                <CheckCircle2 size={16} className="badge-check-icon" />
                <span>Updated regularly</span>
              </div>
            </div>
          </div>

          {/* Right Visual Graphic */}
          <div className="hero-graphic-side">
            <div className="landing-orb-wrapper">
              <LiveOrb 
                variant="custom" 
                color="#635bff" 
                size="100%"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="landing-stats-section">
        <div className="container">
          <div className="stats-bar-card">
            <div className="stat-box">
              <div className="stat-icon-circle purple">
                <Users size={22} />
              </div>
              <div className="stat-details">
                <h3 className="stat-number">200K+</h3>
                <p className="stat-name">Students Learning</p>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-circle blue">
                <BookOpen size={22} />
              </div>
              <div className="stat-details">
                <h3 className="stat-number">5K+</h3>
                <p className="stat-name">Courses & Resources</p>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-circle orange">
                <Building2 size={22} />
              </div>
              <div className="stat-details">
                <h3 className="stat-number">500+</h3>
                <p className="stat-name">Partner Companies</p>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-circle green">
                <Star size={22} />
              </div>
              <div className="stat-details">
                <h3 className="stat-number">90%</h3>
                <p className="stat-name">User Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Everything You Need for a Successful Career */}
      <section className="landing-services-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">
              Everything You Need for a <span className="purple-gradient-text">Successful Career</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Get the right guidance, resources and opportunities at every step.
            </p>
          </div>

          <div className="services-grid-4">
            {/* Card 1: Career Paths */}
            <div className="service-card purple-tint" onClick={() => onNavigate('career-paths')}>
              <div className="service-icon-box purple">
                <Book size={24} />
              </div>
              <h3 className="service-card-title">Career Paths</h3>
              <p className="service-card-desc">Explore different career options based on your interests and skills.</p>
              <div className="service-arrow-btn">
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 2: Learn Skills */}
            <div className="service-card blue-tint" onClick={() => onNavigate('courses')}>
              <div className="service-icon-box blue">
                <GraduationCap size={24} />
              </div>
              <h3 className="service-card-title">Learn Skills</h3>
              <p className="service-card-desc">Access high-quality courses and certifications.</p>
              <div className="service-arrow-btn">
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 3: Practice Interviews */}
            <div className="service-card yellow-tint" onClick={() => onNavigate('mock-interviews')}>
              <div className="service-icon-box yellow">
                <Mic size={24} />
              </div>
              <h3 className="service-card-title">Practice Interviews</h3>
              <p className="service-card-desc">Improve with AI-powered mock interviews and personalized feedback.</p>
              <div className="service-arrow-btn">
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 4: Find Opportunities */}
            <div className="service-card green-tint" onClick={() => onNavigate('jobs')}>
              <div className="service-icon-box green">
                <Briefcase size={24} />
              </div>
              <h3 className="service-card-title">Find Opportunities</h3>
              <p className="service-card-desc">Discover internships and job opportunities from top companies.</p>
              <div className="service-arrow-btn">
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Explore In-Demand Career Paths */}
      <section className="landing-paths-section">
        <div className="container">
          <div className="paths-header-row">
            <div>
              <h2 className="section-title">
                Explore In-Demand <span className="purple-gradient-text">Career Paths</span>
              </h2>
              <p className="section-subtitle">Choose a domain and start building skills for your future.</p>
            </div>
            <button className="btn-outline-secondary" onClick={() => onNavigate('career-paths')}>
              <span>Explore All Paths</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="paths-cards-grid">
            {careerPaths.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="path-small-card" onClick={() => onNavigate('career-paths')}>
                  <div className={`path-icon-square ${item.color}`}>
                    <Icon size={22} />
                  </div>
                  <span className="path-title-text">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Loved by Students Like You */}
      <section className="landing-testimonials-section">
        <div className="container">
          <div className="testimonials-header-row">
            <div>
              <h2 className="section-title">
                Loved by <span className="purple-gradient-text">Students Like You</span>
              </h2>
              <p className="section-subtitle">Hear from learners who are building their careers with Interact.ai.</p>
            </div>
            <div className="slider-arrows">
              <button className="arrow-btn" title="Previous"><ChevronLeft size={18} /></button>
              <button className="arrow-btn" title="Next"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="testimonials-3-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-box">
                <p className="testimonial-quote">"{t.text}"</p>
                
                <div className="testimonial-author-row">
                  <img src={t.avatar} alt={t.name} className="author-photo" />
                  <div className="author-details">
                    <h4 className="author-name">{t.name}</h4>
                    <p className="author-degree">{t.role}</p>
                  </div>
                  <div className="author-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Start Your Journey Today Banner */}
      <section className="landing-cta-banner-section">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-text-content">
              <h2 className="cta-heading">
                Start <span className="purple-gradient-text">Your Journey Today</span>
              </h2>
              <p className="cta-subheading">
                Build the skills, confidence and opportunities you need for a successful career.
              </p>
              <button className="btn-primary-purple cta-action-btn" onClick={onGetStarted}>
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="cta-image-content">
              <div className="cap-books-graphic">
                <GraduationCap size={80} className="floating-cap-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
