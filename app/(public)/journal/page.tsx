import React from 'react';
import type { Metadata } from 'next';
import { getPublishedArticles } from '@/lib/db/articles';
import JournalFilterList from '@/components/public/JournalFilterList';

export const metadata: Metadata = {
  title: 'Journal & Notes — MadhanKR',
  description: 'Reflections on design, front-end architecture, AI-assisted creative workflows, and digital craft by MadhanKR.',
  alternates: {
    canonical: '/journal'
  }
};

export const revalidate = 3600;

export default async function JournalPage() {
  const articles = await getPublishedArticles();

  return (
    <div style={{ padding: '40px var(--pad-x) 120px' }}>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div className="section-tag-box">
          <span className="section-num">03</span>
          <span className="section-bracket">[ ESSAYS ]</span>
        </div>
        <h1 className="section-title">JOURNAL &amp; NOTES</h1>
      </div>
      <p style={{ maxWidth: '680px', color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.6 }}>
        Observations and reflections on design craft, emerging AI methodologies, front-end architectures, and creative autonomy.
      </p>

      <JournalFilterList initialArticles={articles} />
    </div>
  );
}
