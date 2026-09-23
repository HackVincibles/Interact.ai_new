import React from 'react';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'B.Tech CSE, Delhi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      comment: 'Interact.ai helped me find the right roadmap and improve my interview skills. I got my first software dev internship easily!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Rahul Verma',
      role: 'B.Tech IT, Bhopal (SISTec-R)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      comment: 'The AI mock interviews and instant code feedback really boosted my confidence. The PDF report highlighted areas I needed to fix.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Sneha Gupta',
      role: 'BCA, Indore',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      comment: 'Quality course aggregation and real hiring opportunities. Having ISRO and top startup jobs in one dashboard is amazing!',
      rating: 5,
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">STUDENT STORIES</span>
          <h2 className="section-title">
            Loved by <span>Students Like You</span>
          </h2>
          <p className="section-subtitle">
            Hear from learners who are building their corporate careers with Interact.ai.
          </p>
        </div>

        <div className="testimonials-grid grid-cols-3">
          {reviews.map((rev) => (
            <div key={rev.id} className="testimonial-card card">
              <div className="quote-icon">
                <Quote size={24} color="#635bff" opacity={0.3} />
              </div>
              <p className="review-text">"{rev.comment}"</p>
              
              <div className="review-rating">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>

              <div className="reviewer-info">
                <img src={rev.avatar} alt={rev.name} className="reviewer-avatar" />
                <div>
                  <h4 className="reviewer-name">{rev.name}</h4>
                  <p className="reviewer-role">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
