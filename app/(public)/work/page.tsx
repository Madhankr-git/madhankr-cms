import React from 'react';
import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/db/projects';
import WorkFilterGrid from '@/components/public/WorkFilterGrid';
import { buildPageMetadata } from '@/lib/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('work');
}

export const revalidate = 3600;

export default async function WorkPage() {
  const projects = await getAllProjects();

  return (
    <div className="standard-page-container" style={{ padding: '40px var(--pad-x) 100px' }}>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div className="section-tag-box">
          <span className="section-num">01</span>
          <span className="section-bracket">[ PORTFOLIO ]</span>
        </div>
        <h1 className="section-title">SELECTED WORKS</h1>
      </div>
      <p style={{ maxWidth: '680px', color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.6 }}>
        Detailed case studies in user experience architecture, front-end implementation, and AI tooling. Designed with geometric clarity and intentionality.
      </p>

      <WorkFilterGrid initialProjects={projects} />
    </div>
  );
}
