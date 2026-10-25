import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { buildPageMetadata } from '@/lib/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('about');
}

export const revalidate = 3600;

export default function AboutPage() {
  const experiences = [
    {
      period: 'FEB 2025 — PRESENT',
      role: 'Software Designer',
      company: 'Colan Infotech Private Limited',
      desc: 'Working across digital marketing, visual design, branding, and web experiences. Leveraging AI-assisted workflows to streamline recurring tasks and accelerate creative delivery by up to 55%.'
    },
    {
      period: 'NOV 2022 — AUG 2024',
      role: 'Associate Software Engineer',
      company: 'Cognitive Platform Solutions',
      desc: 'Designed UI/UX for EdTech platforms associated with IIT Hyderabad, IIT Dharwad, and NIT Calicut. Translated product requirements into responsive interfaces, interactive prototypes, and user-focused digital experiences.'
    },
    {
      period: '2022 — 2025',
      role: 'Independent Digital Design & Development',
      company: 'Creative Projects & Personal Portfolio',
      desc: 'Created brand visuals, website interfaces, and digital experiences using Figma, Adobe Creative Suite, HTML, CSS, and JavaScript. Explored AI-powered creative workflows and front-end development to bridge design and implementation.'
    }
  ];

  const skillGauges = [
    { name: 'UI/UX & Interface Design', pct: '90%' },
    { name: 'Graphic Design & Brand Identity', pct: '90%' },
    { name: 'Front-End Development (HTML, CSS, JavaScript, Bootstrap)', pct: '82%' },
    { name: 'AI-Augmented Creative Workflows', pct: '88%' },
    { name: 'Digital Marketing Creatives & Landing Pages', pct: '85%' },
    { name: 'Prototyping & Responsive Web Design', pct: '85%' },
  ];

  const stackItems = [
    'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe After Effects',
    'Canva', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Tailwind CSS',
    'WordPress', 'Git / GitHub', 'Supabase', 'Netlify', 'Google Antigravity',
    'Make', 'ChatGPT', 'Claude', 'Gemini', 'Google Flow', 'Higgsfield',
    'Adobe Firefly', 'Runway', 'ElevenLabs'
  ];

  return (
    <div className="standard-page-container" style={{ padding: '40px var(--pad-x) 120px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <div className="section-tag-box">
          <span className="section-num">01</span>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}>
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
      <div style={{ paddingTop: '36px', borderTop: '1.5px solid var(--sky-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <Link href="/work" className="ghost-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={13} />
          <span>View Portfolio Works</span>
        </Link>
        <Link href="/contact" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span>Get in Touch</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
