import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About MadhanKR — Background, Philosophy & Skills',
  description: 'Learn about MadhanKR’s 3+ years in visual design, front-end engineering, and AI-driven creative methodologies.',
  alternates: {
    canonical: '/about'
  }
};

export default function AboutPage() {
  const experiences = [
    {
      period: '2025 — PRESENT',
      role: 'Lead UI/UX Designer & Creative Technologist',
      company: 'Premier EdTech Collaborations (IIT Hyderabad & NIT Calicut)',
      desc: 'Architecting design systems, student portals, interactive assessment flows, and high-conversion landing systems serving 25,000+ active learners.'
    },
    {
      period: '2024 — 2025',
      role: 'Product Designer & Front-End Developer',
      company: 'Digital Performance & Brand Studio',
      desc: 'Crafted multi-platform visual identities, CRO landing frameworks, and generative AI visual campaigns with strict focus on speed and clarity.'
    },
    {
      period: '2023 — 2024',
      role: 'Visual Designer & Interface Prototyper',
      company: 'Creative Tech Lab & Independent Client Projects',
      desc: 'Designed web experiences, typography-driven brand assets, and interactive component prototypes using Vanilla CSS, JavaScript, and Figma.'
    }
  ];

  const skillGauges = [
    { name: 'UI/UX & Product Design', pct: '95%' },
    { name: 'Design Systems & Figma Architecture', pct: '92%' },
    { name: 'Modern Front-End (Next.js, React, HTML/CSS)', pct: '88%' },
    { name: 'AI Creative Workflows (Midjourney, Prompting)', pct: '90%' },
    { name: 'Brand & Visual Identity', pct: '86%' },
    { name: 'Headless CMS & Architecture', pct: '85%' },
  ];

  const stackItems = [
    'Figma', 'Next.js', 'React', 'TypeScript',
    'Vanilla CSS', 'Tailwind CSS', 'Supabase', 'PostgreSQL',
    'Node.js', 'Git / GitHub', 'Midjourney', 'Runway Gen-2'
  ];

  return (
    <div style={{ padding: '40px var(--pad-x) 120px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <div className="section-tag-box">
          <span className="section-num">02</span>
          <span className="section-bracket">[ IDENTITY ]</span>
        </div>
        <h1 className="section-title">ABOUT MADHANKR</h1>
      </div>

      {/* Narrative Lead */}
      <div style={{ marginBottom: '54px' }}>
        <p style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, lineHeight: 1.4, color: 'var(--text-main)', marginBottom: '24px' }}>
          I turn ideas into clear digital experiences through visual design, thoughtful interfaces, and AI-assisted workflows.
        </p>
        <p style={{ fontSize: '17px', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '16px' }}>
          Over the past three years, my journey has crossed visual design, front-end development, and AI tools. I enjoy understanding how a visual idea works—not only as a static composition, but as an interactive system people can navigate effortlessly.
        </p>
        <p style={{ fontSize: '17px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
          My approach is grounded in restraint: high contrast, deliberate whitespace, geometric purity, and kinetic physics. Technology is an amplifier; clarity of intent is what gives it soul.
        </p>
      </div>

      {/* Timeline Section */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.18em', color: 'var(--sky-blue)', fontWeight: 800, marginBottom: '28px' }}>
          EXPERIENCE &amp; SELECTED ROLES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {experiences.map((exp, idx) => (
            <div key={idx} style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--sky-border)', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="p-card-tag">{exp.period}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--grey-text)' }}>ROLE 0{idx + 1}</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '4px' }}>{exp.role}</h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--sky-blue)', marginBottom: '12px' }}>
                {exp.company}
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities & Skills Section */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.18em', color: 'var(--sky-blue)', fontWeight: 800, marginBottom: '24px' }}>
          CORE CAPABILITIES &amp; PROFICIENCY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {skillGauges.map((s, idx) => (
            <div key={idx} style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--sky-border)', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{s.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--sky-blue)', fontWeight: 800 }}>{s.pct}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-card)' }}>
                <div style={{ width: s.pct, height: '100%', background: 'var(--sky-solid)' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stack Grid */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.18em', color: 'var(--grey-text)', fontWeight: 800, marginBottom: '16px' }}>
          TOOLS, LIBRARIES &amp; PLATFORMS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {stackItems.map((item, idx) => (
            <span key={idx} className="p-badge" style={{ fontSize: '13px', padding: '8px 16px', background: 'var(--bg-surface)' }}>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Action CTA */}
      <div style={{ paddingTop: '36px', borderTop: '1.5px solid var(--sky-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/work" className="ghost-btn">
          ← View Portfolio Works
        </Link>
        <Link href="/contact" className="cta-btn">
          <span>Get in Touch</span>
          <span className="btn-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}
