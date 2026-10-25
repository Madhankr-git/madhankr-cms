'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllArticles, saveArticle, deleteArticle } from '@/lib/db/articles';
import { getAllProjects, saveProject, deleteProject } from '@/lib/db/projects';
import { logActivity } from '@/lib/db/settings';
import { Article, Project } from '@/lib/types';
import { CheckCircle2, Plus, ExternalLink, Edit3, Trash2, Search, FileText, Layers } from 'lucide-react';

export default function ContentManagerPage() {
  const [tab, setTab] = useState<'articles' | 'projects'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const loadData = async () => {
    const [arts, projs] = await Promise.all([
      getAllArticles(),
      getAllProjects()
    ]);
    setArticles(arts);
    setProjects(projs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleArticleStatus = async (article: Article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    const updated = { ...article, status: newStatus as any };
    const res = await saveArticle(updated);
    if (res.success) {
      logActivity({
        type: newStatus === 'published' ? 'article_published' : 'article_saved',
        title: `Article ${newStatus === 'published' ? 'Published' : 'Moved to Draft'}`,
        detail: article.title
      });
      // Call On-Demand Revalidation
      try {
        const revalRes = await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            type: 'article',
            slug: article.slug
          })
        });
        if (!revalRes.ok) {
          const errData = await revalRes.json().catch(() => ({}));
          console.warn('[CMS Content] Revalidation warning:', errData.message || 'Cache revalidation failed');
        }
      } catch (e) {
        console.error('[CMS Content] Revalidation network error:', e);
      }
      triggerToast(`Article status updated to ${newStatus.toUpperCase()} & ISR cache refreshed!`);
      loadData();
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const ok = await deleteArticle(id);
      if (ok) {
        triggerToast('Article deleted successfully.');
        loadData();
      }
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete case study "${title}"?`)) {
      const ok = await deleteProject(id);
      if (ok) {
        triggerToast('Case study deleted successfully.');
        loadData();
      }
    }
  };

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'var(--cms-font)' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          border: '1px solid #2563eb',
          borderRadius: '8px',
          padding: '12px 20px',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Content Manager
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b' }}>
            Manage essays, case studies, publication status, and live revalidations
          </p>
        </div>

        <Link
          href="/admin/editor"
          style={{
            background: '#2563eb',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={15} />
          <span>Write New Post</span>
        </Link>
      </div>

      {/* Navigation Tabs & Search Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setTab('articles')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: tab === 'articles' ? '1px solid #2563eb' : '1px solid #e2e8f0',
              background: tab === 'articles' ? '#eff6ff' : '#ffffff',
              color: tab === 'articles' ? '#2563eb' : '#475569'
            }}
          >
            Articles &amp; Essays ({articles.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('projects')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: tab === 'projects' ? '1px solid #2563eb' : '1px solid #e2e8f0',
              background: tab === 'projects' ? '#eff6ff' : '#ffffff',
              color: tab === 'projects' ? '#2563eb' : '#475569'
            }}
          >
            Portfolio Projects ({projects.length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'var(--cms-font)'
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        {tab === 'articles' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                <th style={{ padding: '14px 20px' }}>TITLE &amp; CATEGORY</th>
                <th style={{ padding: '14px 20px' }}>STATUS</th>
                <th style={{ padding: '14px 20px' }}>READ TIME</th>
                <th style={{ padding: '14px 20px' }}>VIEWS</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((art) => (
                <tr key={art.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {art.cover_image && (
                        <div style={{ position: 'relative', width: '48px', height: '36px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0, backgroundColor: '#f1f5f9' }}>
                          <img src={art.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '6px', height: '6px', background: '#2563eb', borderRadius: art.motif === 'circ' ? '50%' : '1px' }} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '2px' }}>
                          {art.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                          /article/{art.slug} · <span style={{ color: '#2563eb', fontWeight: 600 }}>{art.category}</span>
                          {art.tags && art.tags.length > 0 && (
                            <span style={{ color: '#94a3b8', marginLeft: '6px' }}>
                              · {art.tags.slice(0, 3).map((t) => `#${t}`).join(' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: art.status === 'published' ? '#dcfce7' : '#fef3c7',
                      color: art.status === 'published' ? '#166534' : '#92400e',
                      textTransform: 'uppercase'
                    }}>
                      {art.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#475569' }}>
                    {art.readTime}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#475569', fontFamily: 'var(--font-mono)' }}>
                    {art.views?.toLocaleString() || 0}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleArticleStatus(art)}
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          background: '#ffffff',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {art.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        href={`/admin/editor/${art.id}`}
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #2563eb',
                          borderRadius: '6px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </Link>
                      <Link
                        href={`/article/${art.slug}`}
                        target="_blank"
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          background: '#ffffff',
                          color: '#0f172a',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>View</span>
                        <ExternalLink size={12} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          background: '#fef2f2',
                          color: '#ef4444',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                <th style={{ padding: '14px 20px' }}>PROJECT &amp; CLIENT</th>
                <th style={{ padding: '14px 20px' }}>TAG</th>
                <th style={{ padding: '14px 20px' }}>YEAR</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '2px' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {p.client} · <span style={{ color: '#2563eb' }}>{p.category}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className="p-card-tag">{p.tag}</span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#475569', fontFamily: 'var(--font-mono)' }}>
                    {p.year}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                      <Link
                        href={`/work/${p.slug}`}
                        target="_blank"
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          background: '#ffffff',
                          color: '#0f172a',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>View</span>
                        <ExternalLink size={12} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(p.id, p.title)}
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          background: '#fef2f2',
                          color: '#ef4444',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
