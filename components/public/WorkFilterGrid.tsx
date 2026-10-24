'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { ArrowRight, ExternalLink, X } from 'lucide-react';

interface WorkFilterGridProps {
  initialProjects: Project[];
}

export default function WorkFilterGrid({ initialProjects }: WorkFilterGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { key: 'all', label: 'ALL WORKS' },
    { key: 'ui-ux', label: 'UI/UX & PRODUCT' },
    { key: 'web-apps', label: 'WEB APPLICATIONS' },
    { key: 'ai-tools', label: 'AI & TOOLING' },
  ];

  const filtered = activeCategory === 'all'
    ? initialProjects
    : initialProjects.filter(p => p.categorySlug === activeCategory || p.category.toLowerCase().includes(activeCategory));

  return (
    <>
      {/* Category Filter Pills */}
      <div className="work-filter-bar" style={{
        marginTop: '36px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--sky-border)',
        padding: '18px 24px',
        boxShadow: '0 4px 16px rgba(2, 132, 199, 0.05)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                padding: '8px 16px',
                border: activeCategory === cat.key ? '1.5px solid var(--sky-solid)' : '1px solid var(--sky-border)',
                background: activeCategory === cat.key ? 'var(--sky-solid)' : 'transparent',
                color: activeCategory === cat.key ? 'var(--dark-solid)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--grey-text)' }}>
          SHOWING {filtered.length} OF {initialProjects.length} CASE STUDIES
        </span>
      </div>

      {/* Projects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '36px',
        padding: '48px 0 100px'
      }}>
        {filtered.map((project, idx) => (
          <article
            key={project.id}
            className={`p-card card-col-${(idx % 2) + 1}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedProject(project)}
          >
            <div className="p-card-header">
              <span className="p-card-tag">{project.tag}</span>
              <span className="p-card-year">{project.year}</span>
            </div>
            <div className="p-card-graphic">
              <div className={`p-motif ${project.motif || 'motif-square'}`} />
            </div>
            <div className="p-card-info">
              <h3 className="p-card-title">{project.title.toUpperCase()}</h3>
              <p className="p-card-desc">{project.summary}</p>
              <div className="p-card-meta">
                <span className="p-badge">{project.category}</span>
                <span className="p-badge">{project.client}</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center' }}>
                <span className="p-card-link" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>Quick Preview</span>
                  <ArrowRight size={13} />
                </span>
                <Link
                  href={`/work/${project.slug}`}
                  className="p-card-link"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: 'var(--sky-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Full Case Study</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Case Study Drawer Modal */}
      {selectedProject && (
        <div
          className="case-modal-overlay open"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1200,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="case-drawer"
            style={{
              width: 'min(720px, 94vw)',
              height: '100dvh',
              background: 'var(--bg-surface)',
              borderLeft: '2px solid var(--dark-solid)',
              boxShadow: '-15px 0 40px rgba(0, 0, 0, 0.15)',
              padding: '48px clamp(24px, 4vw, 48px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '40px',
                height: '40px',
                background: 'var(--bg-card)',
                border: '1px solid var(--sky-border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close Case Study"
            >
              <X size={18} />
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span className="p-card-tag">{selectedProject.tag}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--grey-text)' }}>
                  {selectedProject.year} · {selectedProject.client}
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                {selectedProject.title}
              </h2>

              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '28px' }}>
                {selectedProject.summary}
              </p>

              {/* Metrics */}
              {selectedProject.caseStudy?.metrics && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '16px',
                  margin: '28px 0'
                }}>
                  {selectedProject.caseStudy.metrics.map((m, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-deep)', border: '1.5px solid var(--sky-border)', padding: '16px 20px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color: 'var(--sky-blue)' }}>
                        {m.value}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {m.label.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Challenge & Solution */}
              <div style={{ margin: '24px 0' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.15em', color: 'var(--sky-blue)', marginBottom: '8px' }}>
                  THE CHALLENGE
                </h4>
                <p style={{ color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '20px' }}>
                  {selectedProject.caseStudy?.challenge}
                </p>

                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.15em', color: 'var(--sky-blue)', marginBottom: '8px' }}>
                  THE SOLUTION &amp; EXECUTION
                </h4>
                <p style={{ color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '20px' }}>
                  {selectedProject.caseStudy?.solution}
                </p>
              </div>

              {/* Tech Stack */}
              {selectedProject.caseStudy?.techStack && (
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--grey-text)', marginBottom: '10px' }}>
                    TECH STACK &amp; METHODOLOGY
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedProject.caseStudy.techStack.map((tech, idx) => (
                      <span key={idx} className="p-badge">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--sky-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link
                href={`/work/${selectedProject.slug}`}
                className="cta-btn"
                style={{ fontSize: '12px', padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span>View Full Dedicated Page</span>
                <ArrowRight size={14} />
              </Link>
              <button
                type="button"
                className="ghost-btn"
                style={{ fontSize: '12px', padding: '12px 24px' }}
                onClick={() => setSelectedProject(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
