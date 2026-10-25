import React from 'react';
import type { Metadata } from 'next';
import PublicContactForm from '@/components/public/PublicContactForm';

export const metadata: Metadata = {
  title: 'Contact MadhanKR — Transmission & Inquiries',
  description: 'Initiate a dialogue with MadhanKR regarding product design, UI/UX engineering, creative technology, or AI workflows.',
  alternates: {
    canonical: '/contact'
  }
};

export default function ContactPage() {
  return (
    <div className="standard-page-container" style={{ padding: '40px var(--pad-x) 120px' }}>
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <div className="section-tag-box">
          <span className="section-num">01</span>
          <span className="section-bracket">[ TRANSMISSION ]</span>
        </div>
        <h1 className="section-title">LET’S CONNECT</h1>
      </div>

      <div className="contact-frame">
        <div className="contact-pitch">
          <h2 className="contact-big-call" style={{ fontSize: 'clamp(28px, 4.5vw, 44px)' }}>
            LET’S MAKE<br />
            <span>IT MEANINGFUL.</span>
          </h2>
          <p className="contact-subtext">
            Open to opportunities in digital design, UI/UX, AI-assisted creative work, and web experiences. If you have an interesting idea or collaboration in mind, let’s talk.
          </p>

          <div className="contact-links-list">
            <a href="https://www.linkedin.com/in/madhankrajagopal" target="_blank" rel="noopener noreferrer" className="contact-row">
              <span className="cr-shape sq" />
              <span className="cr-label">LINKEDIN PROFILE</span>
              <span className="cr-val">linkedin.com/in/madhankrajagopal</span>
            </a>
            <a href="https://madhankumarrajagopal.netlify.app/" target="_blank" rel="noopener noreferrer" className="contact-row">
              <span className="cr-shape semi" />
              <span className="cr-label">PORTFOLIO</span>
              <span className="cr-val">madhankumarrajagopal.netlify.app</span>
            </a>
            <a href="https://www.linkedin.com/in/madhankrajagopal" target="_blank" rel="noopener noreferrer" className="contact-row">
              <span className="cr-shape circ" />
              <span className="cr-label">LET’S CONNECT</span>
              <span className="cr-val">MadhanKR on LinkedIn</span>
            </a>
          </div>
        </div>

        <div className="contact-form-box">
          <PublicContactForm />
        </div>
      </div>
    </div>
  );
}
