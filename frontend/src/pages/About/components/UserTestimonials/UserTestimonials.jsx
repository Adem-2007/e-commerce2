// frontend/src/pages/About/components/UserTestimonials/UserTestimonials.jsx

import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext'; // --- IMPORT THE HOOK ---
import { testimonials } from '../../../../data/testimonialsData';
import './UserTestimonials.css';

// Duplicate arrays for a seamless loop
const topRowTestimonials = [...testimonials.slice(0, 8), ...testimonials.slice(0, 8)];
const bottomRowTestimonials = [...testimonials.slice(8, 16), ...testimonials.slice(8, 16)];

const UserTestimonials = () => {
  const { t, dir } = useLanguage(); // --- INITIALIZE HOOK FOR TRANSLATION AND DIRECTION ---

  // --- Determine animation direction based on language ---
  const topRowDirection = dir === 'rtl' ? 'left' : 'right';
  const bottomRowDirection = dir === 'rtl' ? 'right' : 'left';

  return (
    <section className="testimonial-kinetic-wall text-gray-900 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-cyan-600">
            {t('about_page.testimonials.badge')}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl font-serif">
            {t('about_page.testimonials.title')}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t('about_page.testimonials.description')}
          </p>
        </div>
      </div>

      <div className="kinetic-container mt-20">
        <div className="marquee-container">
          {/* Top Marquee */}
          <div className="marquee marquee-top p-5">
            {/* --- UPDATED: Dynamic class for animation direction --- */}
            <div className={`marquee-track-${topRowDirection}`}>
              {topRowTestimonials.map((testimonial, index) => (
                <div key={`top-${testimonial.id}-${index}`} className="testimonial-card-kinetic group">
                  <div className="card-aurora-border"></div>
                  <div className="card-content">
                    <img className="avatar" src={testimonial.avatar} alt={testimonial.name} />
                    <div className="user-info">
                      <p className="user-name">{testimonial.name}</p>
                      <p className="comment-preview">"{testimonial.comment.substring(0, 80)}..."</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Marquee */}
          <div className="marquee marquee-bottom">
            {/* --- UPDATED: Dynamic class for animation direction --- */}
            <div className={`marquee-track-${bottomRowDirection} p-5`}>
              {bottomRowTestimonials.map((testimonial, index) => (
                <div key={`bottom-${testimonial.id}-${index}`} className="testimonial-card-kinetic group">
                   <div className="card-aurora-border"></div>
                   <div className="card-content">
                    <img className="avatar" src={testimonial.avatar} alt={testimonial.name} />
                    <div className="user-info">
                      <p className="user-name">{testimonial.name}</p>
                      <p className="comment-preview">"{testimonial.comment.substring(0, 80)}..."</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserTestimonials;