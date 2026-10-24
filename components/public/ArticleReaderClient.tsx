'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getArticleBySlug } from '@/lib/db/articles';
import { Copy, Check, Heart, ArrowLeft, ArrowRight } from 'lucide-react';

interface ArticleReaderClientProps {
  article: Article;
  htmlContent: string;
}

export default function ArticleReaderClient({ article: initialArticle, htmlContent }: ArticleReaderClientProps) {
  const [article, setArticle] = useState<Article>(initialArticle);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialArticle.likes || 142);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getArticleBySlug(initialArticle.slug).then((fresh) => {
      if (fresh) {
        setArticle(fresh);
        if (fresh.likes !== undefined) setLikeCount(fresh.likes);
      }
    });
  }, [initialArticle.slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <>
      {/* Top Reading Progress Bar */}
      <div
        id="readingProgress"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '4px',
          width: `${scrollProgress}%`,
          backgroundColor: 'var(--sky-blue)',
          zIndex: 1000,
          transition: 'width 0.1s linear'
        }}
      />

      <article className="article-page" style={{ maxWidth: '880px', margin: '0 auto', padding: '40px var(--pad-x) 120px' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="breadcrumb-wrap" style={{ marginBottom: '32px' }}>
          <Link href="/">HOME</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href="/journal">JOURNAL</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{article.category.toUpperCase()}</span>
        </nav>

        {/* Article Header */}
        <header className="article-header" style={{ marginBottom: '40px', borderBottom: '1.5px solid var(--sky-border)', paddingBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span className={`b-shape ${article.motif || 'sq'}`} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--sky-blue)', fontWeight: 800, letterSpacing: '0.15em' }}>
              {article.category.toUpperCase()}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--grey-text)' }}>• {article.readTime}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: '20px' }}>
            {article.title}
          </h1>

          <p style={{ fontSize: '19px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
            {article.summary}
          </p>

          <div className="art-header-meta" style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px dashed var(--sky-border)'
          }}>
            <div className="author-pill" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="author-avatar" style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--dark-solid)',
                border: '1.5px solid var(--sky-solid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 800
              }}>
                MK
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>MadhanKR</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--grey-text)' }}>Author &amp; Designer</div>
              </div>
            </div>

            <div className="art-quick-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="icon-action-btn"
                onClick={handleCopyLink}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--sky-border)',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copied ? (
                  <>
                    <Check size={13} />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>COPY LINK</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="icon-action-btn"
                onClick={handleLike}
                style={{
                  background: liked ? 'var(--sky-solid)' : 'var(--bg-surface)',
                  border: '1px solid var(--sky-border)',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Heart size={13} style={{ fill: liked ? 'var(--dark-solid)' : 'none' }} />
                <span>{likeCount}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Cover Image with Geometric Motif Badge */}
        {article.cover_image && (
          <div
            className="article-featured-cover"
            style={{
              position: 'relative',
              width: '100%',
              maxHeight: '460px',
              marginBottom: '44px',
              border: '2px solid var(--dark-solid)',
              boxShadow: '8px 8px 0px var(--sky-solid)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-deep)'
            }}
          >
            <img
              src={article.cover_image}
              alt={article.title}
              style={{
                width: '100%',
                maxHeight: '460px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {/* Geometric Shape Style Reference Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: 'rgba(10, 15, 29, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid var(--sky-border)',
                borderRadius: '4px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                zIndex: 2
              }}
            >
              <div
                className={`p-motif ${article.motif === 'circ' ? 'motif-circle' : article.motif === 'semi' ? 'motif-semi' : 'motif-square'}`}
                style={{ transform: 'scale(0.55)', margin: 0 }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  color: 'var(--sky-blue)',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                {article.motif === 'circ' ? 'CIRCULAR' : article.motif === 'semi' ? 'SEMI-RADIAL' : 'PRISMATIC'}
              </span>
            </div>
          </div>
        )}

        {/* Article Body */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            fontSize: 'clamp(17px, 1.3vw, 19px)',
            lineHeight: 1.85,
            color: 'var(--text-main)'
          }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ marginTop: '54px', paddingTop: '28px', borderTop: '1px solid var(--sky-border)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--grey-text)', marginBottom: '12px' }}>
              TOPIC TAXONOMY
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {article.tags.map((tag, idx) => (
                <span key={idx} className="p-badge" style={{ fontSize: '12px', padding: '6px 14px' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Post Bottom Navigation */}
        <div style={{ marginTop: '54px', paddingTop: '32px', borderTop: '1.5px solid var(--sky-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/journal" className="ghost-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={13} />
            <span>Back to Journal</span>
          </Link>
          <Link href="/contact" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>Send a Note / Response</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </article>
    </>
  );
}
