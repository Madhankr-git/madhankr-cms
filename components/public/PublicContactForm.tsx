'use client';

import React, { useState } from 'react';

export default function PublicContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setFeedback(data.message || 'Inquiry transmitted successfully!');
        setFormData({ name: '', email: '', type: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch {
      setStatus('error');
      setFeedback('Network error occurred. Please check your connection.');
    }
  };

  return (
    <form className="c-form" id="contactForm" onSubmit={handleSubmit}>
      <div className="input-block">
        <label htmlFor="contactName">YOUR NAME</label>
        <input
          id="contactName"
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="input-block">
        <label htmlFor="contactEmail">YOUR EMAIL</label>
        <input
          id="contactEmail"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="input-block">
        <label htmlFor="contactType">ENGAGEMENT TYPE</label>
        <input
          id="contactType"
          type="text"
          name="type"
          placeholder="UI/UX / Branding / Web Design / Collaboration"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        />
      </div>

      <div className="input-block">
        <label htmlFor="contactMessage">BRIEF SPECIFICATION</label>
        <textarea
          id="contactMessage"
          name="message"
          rows={4}
          placeholder="Tell me a little about your idea..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>

      {status === 'success' && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', color: '#166534', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
          ✓ {feedback}
        </div>
      )}

      {status === 'error' && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
          ✕ {feedback}
        </div>
      )}

      <button type="submit" className="submit-action-btn" id="submitBtn" disabled={status === 'submitting'}>
        <span className="btn-text">
          {status === 'submitting' ? 'TRANSMITTING...' : 'TRANSMIT INQUIRY'}
        </span>
        <span className="btn-icon">→</span>
      </button>
    </form>
  );
}
