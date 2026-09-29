import React, { useState } from 'react';
import {
  Sparkles, Users, Target, Zap, Award, Globe, Heart, ArrowRight,
  Code2, Brain, Mic, BarChart3, ShieldCheck, GraduationCap, Briefcase
} from 'lucide-react';
import './AboutPage.css';

const stats = [
  { value: '10K+', label: 'Students Trained', icon: <GraduationCap size={22} />, color: '#635bff' },
  { value: '200+', label: 'Partner Colleges', icon: <Globe size={22} />, color: '#06b6d4' },
  { value: '50+', label: 'AI Parameters', icon: <Brain size={22} />, color: '#a78bfa' },
  { value: '95%', label: 'Placement Rate', icon: <Award size={22} />, color: '#10b981' },
];

const team = [
  { name: 'Team Invincibles', role: 'Founder & CEO', emoji: '👨‍💻', color: '#635bff', bio: 'Visionary builder, AI enthusiast, campus-to-corporate champion.' },
  { name: 'Team Invincibles', role: 'CTO & Lead Engineer', emoji: '⚙️', color: '#06b6d4', bio: 'Full-stack architect powering the Interact AI engine.' },
  { name: 'Team Invincibles', role: 'Head of AI Research', emoji: '🧠', color: '#a78bfa', bio: 'Gemini fine-tuning & NLP specialist making interviews smarter.' },
  { name: 'Team Invincibles', role: 'Head of Partnerships', emoji: '🤝', color: '#10b981', bio: 'Building bridges between students and dream companies.' },
];

const values = [
  { icon: <Target size={28} />, title: 'Merit First', desc: 'We believe every student deserves a fair shot — regardless of college tier, background, or connections.', color: '#635bff' },
  { icon: <Zap size={28} />, title: 'AI-Powered, Human-Centered', desc: 'Our AI gives clinical feedback; our design keeps it warm, actionable and encouraging.', color: '#f59e0b' },
  { icon: <Heart size={28} />, title: 'Student Obsessed', desc: 'Every feature is built with one question: does this help a student get hired?', color: '#ef4444' },
  { icon: <ShieldCheck size={28} />, title: 'Trust & Privacy', desc: 'Your interview data is yours. We never sell it, never share it.', color: '#10b981' },
];

const features = [
  { icon: <Mic size={24} />, label: 'Live AI Interviews', color: '#635bff' },
  { icon: <BarChart3 size={24} />, label: '50-Parameter Reports', color: '#06b6d4' },
  { icon: <Code2 size={24} />, label: 'Coding Rounds', color: '#a78bfa' },
  { icon: <Users size={24} />, label: 'Group Discussions', color: '#10b981' },
  { icon: <Briefcase size={24} />, label: 'Internship Board', color: '#f59e0b' },
  { icon: <GraduationCap size={24} />, label: 'Career Paths', color: '#f97316' },
];

const timeline = [
  { year: '2024', title: 'The Idea', desc: 'Founded in a college dorm room after watching friends struggle with interview prep.', color: '#635bff' },
  { year: 'Q1 2025', title: 'First Beta', desc: 'Launched to 500 students across 10 colleges. 80% reported a confidence boost.', color: '#06b6d4' },
  { year: 'Q3 2025', title: 'Gemini Integration', desc: 'Plugged in Gemini AI for deep evaluation — 50-parameter scoring went live.', color: '#a78bfa' },
  { year: '2026', title: 'Scale Up', desc: '10,000+ students, 200+ colleges, live across India. Just the beginning.', color: '#10b981' },
];

export default function AboutPage({ onNavigate }) {
  return (
    <div className="about-page-root">

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-orb orb-left" />
        <div className="about-hero-orb orb-right" />
        <div className="container about-hero-inner animate-fade-in">
          <span className="about-badge"><Sparkles size={14} /> Our Story</span>
          <h1 className="about-hero-title">
            Built for the Student Who<br />
            <span className="purple-gradient-text">Refuses to Give Up</span>
          </h1>
          <p className="about-hero-sub">
            Interact.ai was born from a simple frustration: great students were failing interviews
            not because they lacked skill — but because they never got a chance to practice with real feedback.
            We fixed that.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="about-stats-strip">
        <div className="container about-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="about-stat-card" style={{ '--stat-color': s.color }}>
              <div className="stat-icon-ring">{s.icon}</div>
              <strong className="stat-value">{s.value}</strong>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-mission-section">
        <div className="container about-mission-inner">
          <div className="about-mission-text">
            <span className="section-label">MISSION</span>
            <h2 className="section-title">
              Democratise Interview<br />Preparation for Every Student
            </h2>
            <p className="about-mission-para">
              The gap between a student who can do the job and one who can interview for it is enormous —
              and totally preventable. Interact.ai gives every student access to an AI interviewer that
              gives honest, detailed, actionable feedback at any time of day, for free.
            </p>
            <p className="about-mission-para">
              No expensive coaching. No premium subscriptions to access basic features.
              Just you, the AI, and the feedback you need to get hired.
            </p>
            <button className="btn-primary-purple" onClick={() => onNavigate?.('mock-interviews')}>
              Start Practicing Free <ArrowRight size={16} />
            </button>
          </div>
          <div className="about-features-visual">
            {features.map((f, i) => (
              <div key={i} className="about-feature-chip" style={{ '--chip-color': f.color }}>
                <span className="chip-icon">{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-values-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-label">WHAT WE STAND FOR</span>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="about-values-grid">
            {values.map((v, i) => (
              <div key={i} className="about-value-card card-base" style={{ '--val-color': v.color }}>
                <div className="value-icon-box">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="about-timeline-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-label">JOURNEY</span>
            <h2 className="section-title">From Dorm Room to 10K Students</h2>
          </div>
          <div className="about-timeline">
            {timeline.map((t, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-dot" style={{ background: t.color }} />
                <div className="timeline-card card-base" style={{ '--tl-color': t.color }}>
                  <span className="timeline-year">{t.year}</span>
                  <h4 className="timeline-title">{t.title}</h4>
                  <p className="timeline-desc">{t.desc}</p>
                </div>
              </div>
            ))}
            <div className="timeline-line" />
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="about-team-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-label">THE TEAM</span>
            <h2 className="section-title">People Behind the Platform</h2>
          </div>
          <div className="about-team-grid">
            {team.map((m, i) => (
              <div key={i} className="team-card card-base" style={{ '--team-color': m.color }}>
                <div className="team-avatar">{m.emoji}</div>
                <h3 className="team-name">{m.name}</h3>
                <span className="team-role">{m.role}</span>
                <p className="team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta-section">
        <div className="container about-cta-inner">
          <h2 className="about-cta-title">Ready to Land Your Dream Job?</h2>
          <p className="about-cta-sub">Join 10,000+ students already practising smarter with Interact.ai.</p>
          <div className="about-cta-btns">
            <button className="btn-primary-purple" onClick={() => onNavigate?.('register')}>
              Get Started Free <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => onNavigate?.('contact')}>
              Talk to Us
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
