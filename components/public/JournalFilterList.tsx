'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getAllArticles } from '@/lib/db/articles';
import { Search, X, ArrowRight, ArrowUpRight } from 'lucide-react';

interface JournalFilterListProps {
  initialArticles: Article[];
}

export default function JournalFilterList({ initialArticles }: JournalFilterListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    getAllArticles().then((latest) => {
      if (latest && latest.length > 0) {
        setArticles(latest.filter((a) => a.status === 'published'));
      }
    });
  }, []);

  // Extract unique categories dynamically from articles so newly created categories immediately appear
  const uniqueCategoryMap = new Map<string, string>();
  articles.forEach((article) => {
    if (article.categorySlug && article.category) {
      if (!uniqueCategoryMap.has(article.categorySlug)) {
        uniqueCategoryMap.set(article.categorySlug, article.category);
      }
    }
  });

  const categories = [
    { key: 'all', label: 'ALL ARTICLES' },
    ...Array.from(uniqueCategoryMap.entries()).map(([key, label]) => ({
      key,
      label: label.toUpperCase(),
    })),
  ];

  const filtered = articles.filter((article) => {
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
          <Search size={16} style={{ color: 'var(--sky-blue)', flexShrink: 0 }} />
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
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--grey-text)', display: 'flex', alignItems: 'center' }}
            >
              <X size={15} />
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--sky-blue)', marginBottom: '12px' }}>00 / NO ARTICLES FOUND</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            No articles match your query &quot;{searchTerm}&quot;. Try selecting a different topic or resetting the search.
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
                FEATURED ARTICLE
              </div>
              <article
                className="spotlight-card"
                style={{
                  background: 'var(--bg-surface)',
                  border: '2px solid var(--dark-solid)',
                  boxShadow: '8px 8px 0px var(--sky-solid)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: 'clamp(28px, 4vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span className="p-badge">{featured.category}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--grey-text)' }}>
                        {featured.readTime}
                      </span>
                    </div>

                    <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '16px' }}>
                      {featured.title}
                    </h2>

                    <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '20px' }}>
                      {featured.summary}
                    </p>

                    {/* Topic Taxonomy / Keywords */}
                    {featured.tags && featured.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                        {featured.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: 'var(--sky-blue)',
                              background: 'rgba(2, 132, 199, 0.08)',
                              border: '1px solid var(--sky-border)',
                              borderRadius: '2px',
                              padding: '3px 8px',
                              letterSpacing: '0.04em'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href={`/article/${featured.slug}`} className="cta-btn" id="spotlightReadBtn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span>Read Article</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-deep)',
                  borderLeft: '1.5px solid var(--sky-border)',
                  position: 'relative',
                  minHeight: '260px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {featured.cover_image ? (
                    <>
                      <img
                        src={featured.cover_image}
                        alt={featured.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          minHeight: '280px',
                          display: 'block'
                        }}
                      />
                      {/* Geometric shape style reference badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        background: 'rgba(10, 15, 29, 0.88)',
                        backdropFilter: 'blur(8px)',
                        border: '1.5px solid var(--sky-border)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                        zIndex: 2
                      }}>
                        <div className={`p-motif ${featured.motif === 'circ' ? 'motif-circle' : featured.motif === 'semi' ? 'motif-semi' : 'motif-square'}`} style={{ transform: 'scale(0.55)', margin: 0 }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--sky-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {featured.motif === 'circ' ? 'CIRCULAR' : featured.motif === 'semi' ? 'SEMI-RADIAL' : 'PRISMATIC'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className={`p-motif ${featured.motif === 'circ' ? 'motif-circle' : featured.motif === 'semi' ? 'motif-semi' : 'motif-square'}`} style={{ transform: 'scale(1.4)' }} />
                  )}
                </div>
              </article>
            </div>
          )}

          {/* Regular Articles List */}
          {regularList.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--grey-text)', fontWeight: 800, marginBottom: '16px' }}>
                ALL ARTICLES ({regularList.length})
              </div>
              <div className="blog-manifest" id="blogList">
                {regularList.map((article, idx) => (
                  <article key={article.id} className="b-entry">
                    <div className="b-meta">
                      <span className="b-date">NOTE 0{idx + 1}</span>
                      {article.cover_image ? (
                        <div className="b-thumb-wrap">
                          <img src={article.cover_image} alt={article.title} className="b-thumb-img" />
                          <span className="b-thumb-shape-badge" title={`Motif: ${article.motif || 'sq'}`}>
                            <span className={`b-shape ${article.motif || 'sq'}`} />
                          </span>
                        </div>
                      ) : (
                        <div className="b-shape-only">
                          <span className={`b-shape ${article.motif || 'sq'}`} />
                        </div>
                      )}
                    </div>
                    <div className="b-content">
                      <div className="b-top-row">
                        <span className="b-cat-tag">
                          {article.category.toUpperCase()}
                        </span>
                        <span className="b-read-time">• {article.readTime}</span>
                      </div>
                      <h3 className="b-title">{article.title}</h3>
                      <p className="b-summary">{article.summary}</p>
                      {article.tags && article.tags.length > 0 && (
                        <div className="b-tags-list">
                          {article.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="b-tag-pill">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="b-action">
                      <Link href={`/article/${article.slug}`} className="b-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span>READ</span>
                        <ArrowUpRight size={13} />
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
