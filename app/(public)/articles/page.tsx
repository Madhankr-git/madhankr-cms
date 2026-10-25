import React from 'react';
import type { Metadata } from 'next';
import { getPublishedArticles } from '@/lib/db/articles';
import JournalFilterList from '@/components/public/JournalFilterList';
import { buildPageMetadata } from '@/lib/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('journal');
}

export const revalidate = 3600;

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="standard-page-container" style={{ padding: '40px var(--pad-x) 120px' }}>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div className="section-tag-box">
          <span className="section-num">01</span>
          <span className="section-bracket">[ ARTICLES ]</span>
        </div>
        <h1 className="section-title">ARTICLES &amp; NOTES</h1>
      </div>
      <p style={{ maxWidth: '680px', color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.6 }}>
        Observations and reflections on design craft, emerging AI methodologies, front-end architectures, and creative autonomy.
      </p>

      <JournalFilterList initialArticles={articles} />
    </div>
  );
}
