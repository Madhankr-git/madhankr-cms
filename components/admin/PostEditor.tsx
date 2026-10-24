'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/lib/types';
import { saveArticle, getArticleById } from '@/lib/db/articles';
import { logActivity } from '@/lib/db/settings';
import { slugify } from '@/lib/utils/slugify';
import { calculateReadTime } from '@/lib/utils/markdown';

interface PostEditorProps {
  initialId?: string;
}

export default function PostEditor({ initialId }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(initialId));
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const [article, setArticle] = useState<Partial<Article>>({
    id: '',
    title: '',
    slug: '',
    category: 'AI & Workflows',
    categorySlug: 'ai-workflows',
    summary: '',
    content: '',
    status: 'draft',
    motif: 'sq',
    tags: ['Design', 'Workflows'],
    readTime: '4 min read',
    featured: false,
    views: 0,
    likes: 0
  });

  useEffect(() => {
    if (initialId) {
      getArticleById(initialId).then((found) => {
        if (found) {
          setArticle(found);
        }
        setLoading(false);
      });
    }
  }, [initialId]);

  const handleTitleChange = (val: string) => {
    const updated = { ...article, title: val };
    if (!initialId || !article.slug) {
      updated.slug = slugify(val);
      updated.id = slugify(val);
    }
    setArticle(updated);
  };

  const handleContentChange = (val: string) => {
    const readTime = calculateReadTime(val);
    setArticle({ ...article, content: val, readTime });
  };

  const insertMarkdown = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('editorTextarea') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = article.content || '';
    const selected = current.substring(start, end);
    const replacement = prefix + selected + suffix;
    const updated = current.substring(0, start) + replacement + current.substring(end);
    handleContentChange(updated);
  };

  const handleSave = async (publishNow = false) => {
    if (!article.title?.trim()) {
      alert('Please enter an article title.');
      return;
    }

    setIsSaving(true);
    const finalArticle: Article = {
      id: article.id || slugify(article.title),
      slug: article.slug || slugify(article.title),
      title: article.title,
      summary: article.summary || 'Personal journal reflection by MadhanKR.',
      content: article.content || 'Draft content in progress...',
      category: article.category || 'Design',
      categorySlug: slugify(article.category || 'design'),
      status: publishNow ? 'published' : (article.status || 'draft'),
      motif: article.motif || 'sq',
      tags: article.tags || ['Design'],
      readTime: article.readTime || '4 min read',
      featured: article.featured || false,
      views: article.views || 0,
      likes: article.likes || 0,
      published_at: publishNow ? new Date().toISOString() : article.published_at,
    };

    const res = await saveArticle(finalArticle);
    setIsSaving(false);

    if (res.success) {
      logActivity({
        type: publishNow ? 'article_published' : 'article_saved',
        title: publishNow ? 'Article Published & Revalidated' : 'Article Saved to Draft',
        detail: finalArticle.title
      });

      // Call On-Demand ISR Revalidation Webhook
      if (publishNow || finalArticle.status === 'published') {
        try {
          const revalRes = await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              type: 'article',
              slug: finalArticle.slug
            })
          });
          if (!revalRes.ok) {
            const errData = await revalRes.json().catch(() => ({}));
            console.warn('[CMS Publish] Revalidation warning:', errData.message || 'Cache revalidation failed');
          }
        } catch (e) {
          console.error('[CMS Publish] Revalidation network error:', e);
        }
      }

      setToastMsg(publishNow ? '✓ Published! Public page generated and ISR cache purged.' : '✓ Saved to drafts.');
      setTimeout(() => {
        router.push('/admin/content');
      }, 1500);
    } else {
      alert(`Save error: ${res.error || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#64748b' }}>Loading article editor...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#166534',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '14px 24px',
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}>
          {toastMsg}
        </div>
      )}

      {/* Editor Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
            {initialId ? 'Edit Article' : 'Write New Article'}
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Markdown typography, geometric branding, and instant static generation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            style={{
              padding: '9px 18px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              background: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            style={{
              padding: '9px 18px',
              border: 'none',
              borderRadius: '6px',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
            }}
          >
            {isSaving ? 'Publishing...' : 'Publish & Revalidate ↗'}
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Form & Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>
              ARTICLE TITLE
            </label>
            <input
              type="text"
              placeholder="e.g. Learning to See Like a Designer"
              value={article.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={{
                width: '100%',
                fontSize: '22px',
                fontWeight: 800,
                color: '#0f172a',
                border: 'none',
                outline: 'none',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: '8px'
              }}
            />

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
              <span style={{ fontFamily: 'var(--font-mono)' }}>Slug:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#2563eb' }}>/journal/{article.slug || 'untitled'}</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>
              EXECUTIVE SUMMARY
            </label>
            <textarea
              rows={3}
              placeholder="A short, compelling premise displayed in card previews..."
              value={article.summary || ''}
              onChange={(e) => setArticle({ ...article, summary: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                lineHeight: 1.6,
                outline: 'none'
              }}
            />
          </div>

          {/* Markdown Editor Area */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '10px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button type="button" onClick={() => insertMarkdown('**', '**')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>B</button>
                <button type="button" onClick={() => insertMarkdown('*', '*')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontStyle: 'italic', cursor: 'pointer' }}>I</button>
                <button type="button" onClick={() => insertMarkdown('## ')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>H2</button>
                <button type="button" onClick={() => insertMarkdown('### ')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>H3</button>
                <button type="button" onClick={() => insertMarkdown('> ')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', cursor: 'pointer' }}>Quote</button>
                <button type="button" onClick={() => insertMarkdown('```\n', '\n```')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>Code</button>
                <button type="button" onClick={() => insertMarkdown('- ')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', cursor: 'pointer' }}>List</button>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: activeTab === 'write' ? '#2563eb' : 'transparent',
                    color: activeTab === 'write' ? '#ffffff' : '#64748b',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: activeTab === 'preview' ? '#2563eb' : 'transparent',
                    color: activeTab === 'preview' ? '#ffffff' : '#64748b',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                id="editorTextarea"
                rows={18}
                placeholder="Write your article content in Markdown here..."
                value={article.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '20px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  lineHeight: 1.8,
                  fontFamily: 'var(--font-mono)',
                  color: '#0f172a',
                  resize: 'vertical'
                }}
              />
            ) : (
              <div style={{ padding: '24px', background: '#ffffff', minHeight: '360px', lineHeight: 1.8 }}>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#2563eb', marginBottom: '16px' }}>
                  [ LIVE TYPOGRAPHY PREVIEW ]
                </div>
                <div style={{ whiteSpace: 'pre-wrap', color: '#0f172a' }}>
                  {article.content || 'Nothing to preview yet.'}
                </div>
              </div>
            )}

            <div style={{ padding: '8px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              <span>Reading time: {article.readTime}</span>
              <span>{(article.content || '').split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>Article Settings</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                CATEGORY
              </label>
              <select
                value={article.category || 'AI & Workflows'}
                onChange={(e) => setArticle({ ...article, category: e.target.value, categorySlug: slugify(e.target.value) })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              >
                <option value="AI & Workflows">AI &amp; Workflows</option>
                <option value="Design">Design</option>
                <option value="Engineering">Engineering</option>
                <option value="Philosophy">Philosophy</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                GEOMETRIC BRAND MOTIF
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { key: 'sq', label: 'Square' },
                  { key: 'semi', label: 'Semi-Circle' },
                  { key: 'circ', label: 'Circle' }
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setArticle({ ...article, motif: m.key as any })}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: article.motif === m.key ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                      background: article.motif === m.key ? '#eff6ff' : '#ffffff',
                      color: article.motif === m.key ? '#2563eb' : '#475569',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={article.featured || false}
                  onChange={(e) => setArticle({ ...article, featured: e.target.checked })}
                />
                <span style={{ fontWeight: 600 }}>Feature in Spotlight Header</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
