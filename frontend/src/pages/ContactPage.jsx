import React, { useState } from 'react';
import {
  Mail, MessageSquare, Phone, MapPin, Send, CheckCircle,
  Clock, Sparkles, Linkedin, Twitter, Instagram, ArrowRight,
  HelpCircle, Briefcase, Bug, HeartHandshake
} from 'lucide-react';
import './ContactPage.css';

const contactReasons = [
  { icon: <HelpCircle size={20} />, label: 'General Enquiry', color: '#635bff' },
  { icon: <Bug size={20} />, label: 'Report a Bug', color: '#ef4444' },
  { icon: <Briefcase size={20} />, label: 'Partnership', color: '#10b981' },
  { icon: <HeartHandshake size={20} />, label: 'College Tie-up', color: '#f59e0b' },
];

const contactInfo = [
  { icon: <Mail size={20} />, label: 'Email Us', value: 'hello@interact.ai', sub: 'We reply within 24 hours', color: '#635bff' },
  { icon: <MessageSquare size={20} />, label: 'Live Chat', value: 'Available in app', sub: 'Mon–Fri, 9AM–6PM IST', color: '#06b6d4' },
  { icon: <MapPin size={20} />, label: 'HQ', value: 'Nagpur, Maharashtra', sub: 'India 🇮🇳', color: '#10b981' },
  { icon: <Clock size={20} />, label: 'Response Time', value: '< 24 hours', sub: 'Guaranteed on weekdays', color: '#a78bfa' },
];

const faqs = [
  { q: 'Is Interact.ai free to use?', a: 'Yes! The core AI mock interview experience is completely free. Premium features are available on paid plans.' },
  { q: 'How does the AI evaluate my answers?', a: 'Our Gemini-powered engine analyses 50+ parameters — technical accuracy, communication, confidence, structure, and more — to give you a holistic score.' },
  { q: 'Can my college partner with Interact.ai?', a: 'Absolutely. We offer white-label portals and bulk access for placement cells. Reach out via the Partnership option above.' },
  { q: 'Is my interview data private?', a: 'Yes. Your data is encrypted, never sold to third parties, and you can request deletion at any time from your profile settings.' },
];

export default function ContactPage({ onNavigate }) {
  const [form, setForm] = useState({ name: '', email: '', reason: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="contact-page-root">

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="contact-hero-orb" />
        <div className="container contact-hero-inner animate-fade-in">
          <span className="about-badge"><Sparkles size={14} /> Get in Touch</span>
          <h1 className="contact-hero-title">
            We're Here to <span className="purple-gradient-text">Help You</span>
          </h1>
          <p className="contact-hero-sub">
            Got a question, a bug to report, or want to bring Interact.ai to your college?
            Our team is just a message away.
          </p>
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="contact-info-strip">
        <div className="container contact-info-grid">
          {contactInfo.map((c, i) => (
            <div key={i} className="contact-info-card card-base" style={{ '--ci-color': c.color }}>
              <div className="ci-icon-ring">{c.icon}</div>
              <div>
                <span className="ci-label">{c.label}</span>
                <strong className="ci-value">{c.value}</strong>
                <span className="ci-sub">{c.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main: Form + FAQ ── */}
      <section className="contact-main-section">
        <div className="container contact-main-grid">

          {/* Form */}
          <div className="contact-form-col">
            <h2 className="contact-section-title">Send Us a Message</h2>
            <p className="contact-section-sub">Fill in the form and we'll get back to you within 24 hours.</p>

            {submitted ? (
              <div className="contact-success-card animate-scale-up">
                <CheckCircle size={48} className="contact-success-icon" />
                <h3>Message Sent! 🎉</h3>
                <p>Thanks, <strong>{form.name}</strong>! We've received your message and will reply to <strong>{form.email}</strong> shortly.</p>
                <button className="btn-primary-purple" onClick={() => { setSubmitted(false); setForm({ name:'',email:'',reason:'',message:'' }); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form className="contact-form card-base" onSubmit={handleSubmit}>
                {/* Reason chips */}
                <div className="form-field">
                  <label className="form-label">What's this about?</label>
                  <div className="reason-chips">
                    {contactReasons.map((r, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`reason-chip ${form.reason === r.label ? 'selected' : ''}`}
                        style={{ '--rc-color': r.color }}
                        onClick={() => handleChange('reason', r.label)}
                      >
                        {r.icon} {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Your Name *</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Aditya Thakre"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Email Address *</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    value={form.message}
                    onChange={e => handleChange('message', e.target.value)}
                    required
                  />
                </div>

                <button className="btn-primary-purple contact-submit-btn" type="submit" disabled={loading}>
                  {loading ? (
                    <span className="contact-spinner" />
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="contact-faq-col">
            <h2 className="contact-section-title">Frequently Asked</h2>
            <p className="contact-section-sub">Quick answers to the most common questions.</p>

            <div className="faq-list">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className={`faq-item card-base ${openFaq === i ? 'open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="faq-header">
                    <span className="faq-q">{f.q}</span>
                    <span className="faq-toggle">{openFaq === i ? '−' : '+'}</span>
                  </div>
                  {openFaq === i && <p className="faq-a">{f.a}</p>}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="contact-social-block card-base">
              <h4>Follow the Journey</h4>
              <p>Stay updated with new features, tips, and campus events.</p>
              <div className="contact-social-links">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-pill linkedin">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href="https://x.com" target="_blank" rel="noreferrer" className="social-pill twitter">
                  <Twitter size={16} /> X / Twitter
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-pill instagram">
                  <Instagram size={16} /> Instagram
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Map-style location card ── */}
      <section className="contact-location-section">
        <div className="container">
          <div className="contact-location-card card-base">
            <div className="location-left">
              <MapPin size={32} className="location-icon" />
              <div>
                <h3>Visit Our Headquarters</h3>
                <p>Nagpur, Maharashtra, India 🇮🇳</p>
                <p className="location-sub">Open for pre-scheduled visits. Reach out first!</p>
              </div>
            </div>
            <div className="location-map-placeholder">
              <div className="map-dot" />
              <div className="map-ring map-ring-1" />
              <div className="map-ring map-ring-2" />
              <span>Nagpur, India</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
