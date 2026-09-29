import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import './FAQSection.css';

const faqs = [
  {
    question: "What is InteractAI?",
    answer: "InteractAI is an AI-powered platform designed to help students and candidates practice and improve their interview skills through realistic, AI-driven mock interviews, comprehensive assessments, and tailored feedback."
  },
  {
    question: "How does InteractAI conduct a good interview?",
    answer: "Our advanced AI agent asks dynamic, context-aware questions based on your resume, the job description, and your previous answers, mimicking the conversational flow of a real human interviewer to truly test your knowledge and adaptability."
  },
  {
    question: "How does InteractAI help detect cheating during interviews?",
    answer: "During supervised assessments, InteractAI uses advanced proctoring mechanisms including tab-switching detection, audio analysis, and visual monitoring to ensure the integrity of the interview process."
  },
  {
    question: "What do you get after each interview?",
    answer: "You receive a comprehensive performance report that includes a detailed breakdown of your communication skills, technical accuracy, areas of improvement, and actionable feedback to help you perform better in your next interview."
  },
  {
    question: "Does InteractAI replace human interviewers?",
    answer: "No, InteractAI is designed to act as a powerful preparation tool and an initial screening assistant. It helps candidates practice and helps recruiters filter candidates efficiently, but the final hiring decisions and cultural fit assessments remain human-led."
  },
  {
    question: "How do candidates take the interview?",
    answer: "Candidates simply click on an invite link or select a mock interview module from their dashboard. The interview takes place entirely within their web browser, utilizing their microphone and camera for a seamless, software-free experience."
  },
  {
    question: "How much does InteractAI cost?",
    answer: "We offer a generous free tier for students to practice essential skills. For advanced features, deep analytics, and unlimited mock interviews, we offer premium subscription plans tailored for individuals and institutions."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="container faq-container">
        <h2 className="faq-heading">Frequently asked questions</h2>
        
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFAQ(index)}
                role="button"
                aria-expanded={isOpen}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQ(index);
                  }
                }}
              >
                <div className="faq-question-row">
                  <h3 className="faq-question">{faq.question}</h3>
                  <div className="faq-icon-wrapper">
                    {isOpen ? (
                      <Minus size={20} className="faq-icon active" />
                    ) : (
                      <Plus size={20} className="faq-icon" />
                    )}
                  </div>
                </div>
                <div 
                  className="faq-answer-wrapper" 
                  style={{ 
                    maxHeight: isOpen ? '500px' : '0',
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
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
