'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getAllArticles } from '@/lib/db/articles';
import { ArrowUpRight } from 'lucide-react';

interface HomeBlogListProps {
  initialArticles: Article[];
}

export default function HomeBlogList({ initialArticles }: HomeBlogListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  useEffect(() => {
    getAllArticles().then((latest) => {
      if (latest && latest.length > 0) {
        setArticles(latest.filter((a) => a.status === 'published'));
      }
    });
  }, []);

  return (
    <div className="blog-manifest" id="blogList">
      {articles.slice(0, 4).map((article, idx) => (
        <article key={article.id} className="b-entry">
          <div className="b-meta">
            <span className="b-date">IDEA 0{idx + 1}</span>
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
                {article.tags.slice(0, 3).map((tag, tIdx) => (
                  <span key={tIdx} className="b-tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="b-action">
            <Link href={`/journal/${article.slug}`} className="b-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>READ</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
