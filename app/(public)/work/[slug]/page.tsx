import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProjects, getProjectBySlug } from '@/lib/db/projects';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Case Study Not Found' };

  return {
    title: `${project.title} — Case Study by MadhanKR`,
    description: project.summary,
    alternates: {
      canonical: `/work/${project.slug}`
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      url: `/work/${project.slug}`,
    }
  };
}

export const revalidate = 3600;

export default async function CaseStudyPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <article style={{ padding: '40px var(--pad-x) 120px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="breadcrumb-wrap" style={{ marginBottom: '32px' }}>
        <Link href="/">HOME</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href="/work">WORK</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{project.title.toUpperCase()}</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span className="p-card-tag">{project.tag}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--grey-text)' }}>
            {project.year} · {project.client}
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '24px' }}>
          {project.title}
        </h1>

        <p style={{ fontSize: '20px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
          {project.summary}
        </p>
      </div>

      {/* Geometric Hero Showcase Graphic */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--sky-border)',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '48px',
        position: 'relative'
      }}>
        <div className={`p-motif ${project.motif || 'motif-square'}`} style={{ transform: 'scale(1.5)' }} />
      </div>

      {/* Metrics Row */}
      {project.caseStudy?.metrics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '54px'
        }}>
          {project.caseStudy.metrics.map((m, idx) => (
            <div key={idx} style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--sky-border)', padding: '24px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900, color: 'var(--sky-blue)' }}>
                {m.value}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginTop: '6px' }}>
                {m.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Challenge and Solution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginBottom: '54px' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--sky-border)', padding: '32px' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.15em', color: 'var(--sky-blue)', marginBottom: '14px' }}>
            01 / THE CHALLENGE
          </h3>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text-main)' }}>
            {project.caseStudy?.challenge}
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--sky-border)', padding: '32px' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.15em', color: 'var(--sky-blue)', marginBottom: '14px' }}>
            02 / THE SOLUTION
          </h3>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text-main)' }}>
            {project.caseStudy?.solution}
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      {project.caseStudy?.techStack && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--sky-border)', padding: '28px', marginBottom: '60px' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.15em', color: 'var(--grey-text)', marginBottom: '16px' }}>
            CORE TECHNOLOGIES &amp; METHODOLOGY
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {project.caseStudy.techStack.map((tech, idx) => (
              <span key={idx} className="p-badge" style={{ fontSize: '12px', padding: '6px 14px' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '32px', borderTop: '1.5px solid var(--sky-border)' }}>
        <Link href="/work" className="ghost-btn">
          ← Back to All Works
        </Link>
        <Link href="/contact" className="cta-btn">
          <span>Discuss Similar Project</span>
          <span className="btn-arrow">→</span>
        </Link>
      </div>
    </article>
  );
}
