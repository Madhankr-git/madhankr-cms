'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

interface JournalFilterListProps {
  initialArticles: Article[];
}

export default function JournalFilterList({ initialArticles }: JournalFilterListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'ALL ESSAYS' },
    { key: 'ai-workflows', label: 'AI & WORKFLOWS' },
    { key: 'design', label: 'DESIGN' },
    { key: 'engineering', label: 'ENGINEERING' },
    { key: 'philosophy', label: 'PHILOSOPHY' },
  ];

  const filtered = initialArticles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.categorySlug === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featured = filtered.find((a) => a.featured) || filtered[0];
  const regularList = filtered.filter((a) => a.id !== featured?.id);

  return (
    <>
      {/* Search and Category Filter Bar */}
      <div className="filter-bar" style={{
        marginTop: '36px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--sky-border)',
        padding: '18px 24px',
        boxShadow: '0 4px 16px rgba(2, 132, 199, 0.05)'
      }}>
        <div className="search-box" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: 1,
          minWidth: '260px',
          background: 'var(--bg-deep)',
          border: '1.5px solid var(--sky-border)',
          padding: '10px 16px'
        }}>
          <span className="search-icon" style={{ color: 'var(--sky-blue)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>⌕</span>
          <input
            type="text"
            placeholder="Search essays by keyword, tag, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              color: 'var(--text-main)'
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--grey-text)' }}
            >
              ✕
            </button>
          )}
        </div>

        <div className="category-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`cat-btn ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                background: selectedCategory === cat.key ? 'var(--sky-solid)' : 'var(--bg-deep)',
                border: selectedCategory === cat.key ? '1px solid var(--sky-blue)' : '1px solid var(--sky-border)',
                color: selectedCategory === cat.key ? 'var(--dark-solid)' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg-surface)', border: '1.5px solid var(--sky-border)', marginTop: '40px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--sky-blue)', marginBottom: '12px' }}>00 / NO ESSAYS FOUND</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            No journal articles match your query &quot;{searchTerm}&quot;. Try selecting a different topic or resetting the search.
          </p>
          <button
            type="button"
            className="cta-btn"
            style={{ marginTop: '20px' }}
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
          >
            <span>Reset Search &amp; Filters</span>
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '48px' }}>
          {/* Spotlight Featured Article */}
          {featured && (
            <div style={{ marginBottom: '48px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--sky-blue)', fontWeight: 800, marginBottom: '12px' }}>
                FEATURED ESSAY
              </div>
              <article
                className="spotlight-card"
                style={{
                  background: 'var(--bg-surface)',
                  border: '2px solid var(--dark-solid)',
                  boxShadow: '8px 8px 0px var(--sky-solid)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: 'clamp(28px, 4vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span className="p-badge">{featured.category}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--grey-text)' }}>
                        {featured.readTime} · {featured.views} readers
                      </span>
                    </div>

                    <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '16px' }}>
                      {featured.title}
                    </h2>

                    <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '24px' }}>
                      {featured.summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href={`/journal/${featured.slug}`} className="cta-btn" id="spotlightReadBtn">
                      <span>Read Essay</span>
                      <span className="btn-arrow">→</span>
                    </Link>
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-card)',
                  borderLeft: '1.5px solid var(--sky-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px'
                }}>
                  <div className={`p-motif ${featured.motif === 'circ' ? 'motif-circle' : featured.motif === 'semi' ? 'motif-semi' : 'motif-square'}`} style={{ transform: 'scale(1.4)' }} />
                </div>
              </article>
            </div>
          )}

          {/* Regular Articles List */}
          {regularList.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--grey-text)', fontWeight: 800, marginBottom: '16px' }}>
                ALL ENTRIES ({regularList.length})
              </div>
              <div className="blog-manifest" id="blogList">
                {regularList.map((article, idx) => (
                  <article key={article.id} className="b-entry">
                    <div className="b-meta">
                      <span className={`b-shape ${article.motif || 'sq'}`} />
                      <span className="b-date">NOTE 0{idx + 1}</span>
                    </div>
                    <div className="b-content">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--sky-blue)', fontWeight: 700, letterSpacing: '0.12em' }}>
                          {article.category.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--grey-text)' }}>• {article.readTime}</span>
                      </div>
                      <h3 className="b-title">{article.title}</h3>
                      <p className="b-summary">{article.summary}</p>
                    </div>
                    <div className="b-action">
                      <Link href={`/journal/${article.slug}`} className="b-btn">
                        READ <span>↗</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
