'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article, MediaAsset } from '@/lib/types';
import { saveArticle, getArticleById, getAllArticles } from '@/lib/db/articles';
import { getMediaAssets, uploadMedia } from '@/lib/db/media';
import { logActivity } from '@/lib/db/settings';
import { slugify } from '@/lib/utils/slugify';
import { calculateReadTime } from '@/lib/utils/markdown';
import {
  CheckCircle2,
  Save,
  Send,
  Eye,
  Edit3,
  Image as ImageIcon,
  UploadCloud,
  X,
  Plus,
  Folder,
  Trash2,
  Tag,
  FolderPlus
} from 'lucide-react';

interface PostEditorProps {
  initialId?: string;
}

export default function PostEditor({ initialId }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(initialId));
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Media library picker modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category management state
  const [availableCategories, setAvailableCategories] = useState<string[]>([
    'AI & Workflows',
    'Design',
    'Engineering',
    'Philosophy'
  ]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Keyword / Topic Taxonomy state
  const [tagInput, setTagInput] = useState('');

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
    cover_image: '',
    readTime: '4 min read',
    featured: false,
    views: 0,
    likes: 0
  });

  // Load article if editing, plus load categories and media library assets
  useEffect(() => {
    // Load existing categories dynamically from all published & draft articles
    getAllArticles().then((all) => {
      const distinct = new Set<string>([
        'AI & Workflows',
        'Design',
        'Engineering',
        'Philosophy'
      ]);
      all.forEach((a) => {
        if (a.category?.trim()) distinct.add(a.category.trim());
      });
      setAvailableCategories(Array.from(distinct));
    });

    // Load media assets for image selector
    getMediaAssets().then((assets) => {
      setMediaAssets(assets);
    });

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

  // Add tag(s) from tagInput
  const handleAddTags = () => {
    if (!tagInput.trim()) return;
    const newItems = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const currentTags = article.tags || [];
    const combined = Array.from(new Set([...currentTags, ...newItems]));
    setArticle({ ...article, tags: combined });
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = article.tags || [];
    setArticle({
      ...article,
      tags: currentTags.filter((t) => t !== tagToRemove)
    });
  };

  // Add new category
  const handleAddNewCategoryConfirm = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setIsAddingNewCategory(false);
      return;
    }
    if (!availableCategories.includes(trimmed)) {
      setAvailableCategories([...availableCategories, trimmed]);
    }
    setArticle({
      ...article,
      category: trimmed,
      categorySlug: slugify(trimmed)
    });
    setNewCategoryName('');
    setIsAddingNewCategory(false);
  };

  // Direct file upload for cover image
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    const res = await uploadMedia(files[0], 'Blog Covers');
    setUploadingImage(false);
    if (res.success && res.asset) {
      setArticle({ ...article, cover_image: res.asset.public_url });
      // Refresh media library
      const updatedList = await getMediaAssets();
      setMediaAssets(updatedList);
    } else {
      alert(`Upload failed: ${res.error || 'Could not upload image'}`);
    }
  };

  const handleSelectMedia = (asset: MediaAsset) => {
    setArticle({ ...article, cover_image: asset.public_url });
    setMediaModalOpen(false);
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
      cover_image: article.cover_image || '',
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

      setToastMsg(publishNow ? 'Published! Public page generated and ISR cache purged.' : 'Saved to drafts.');
      setTimeout(() => {
        router.push('/admin/content');
      }, 1500);
    } else {
      alert(`Save error: ${res.error || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#64748b', fontFamily: 'var(--cms-font)' }}>Loading article editor...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'var(--cms-font)' }}>
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '14px 24px',
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #22c55e'
        }}>
          <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Editor Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
            {initialId ? 'Edit Article' : 'Write New Article'}
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Markdown typography, image cover selection, topic taxonomy, and instant static generation
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
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#334155'
            }}
          >
            <Save size={14} />
            <span>Save Draft</span>
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
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={14} />
            <span>{isSaving ? 'Publishing...' : 'Publish & Revalidate'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1.1fr', gap: '24px' }}>
        {/* Left Column: Form & Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--cms-font-mono)', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>
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
                paddingBottom: '8px',
                fontFamily: 'var(--cms-font)'
              }}
            />

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
              <span style={{ fontFamily: 'var(--cms-font-mono)' }}>Slug:</span>
              <span style={{ fontFamily: 'var(--cms-font-mono)', color: '#2563eb' }}>/journal/{article.slug || 'untitled'}</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--cms-font-mono)', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>
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
                outline: 'none',
                fontFamily: 'var(--cms-font)'
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
                <button type="button" onClick={() => insertMarkdown('```\n', '\n```')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontFamily: 'var(--cms-font-mono)', cursor: 'pointer' }}>Code</button>
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
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit3 size={13} />
                  <span>Write</span>
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
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={13} />
                  <span>Live Preview</span>
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
                  fontFamily: 'var(--cms-font-mono)',
                  color: '#0f172a',
                  resize: 'vertical'
                }}
              />
            ) : (
              <div style={{ padding: '24px', background: '#ffffff', minHeight: '360px', lineHeight: 1.8 }}>
                <div style={{ fontSize: '12px', fontFamily: 'var(--cms-font-mono)', color: '#2563eb', marginBottom: '16px' }}>
                  [ LIVE TYPOGRAPHY PREVIEW ]
                </div>
                <div style={{ whiteSpace: 'pre-wrap', color: '#0f172a' }}>
                  {article.content || 'Nothing to preview yet.'}
                </div>
              </div>
            )}

            <div style={{ padding: '8px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontFamily: 'var(--cms-font-mono)' }}>
              <span>Reading time: {article.readTime}</span>
              <span>{(article.content || '').split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>
        </div>

        {/* Right Column: Settings, Images & Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* 1. Blog Thumbnail & Feature Image Selection Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={15} style={{ color: '#2563eb' }} />
                <span>Thumbnail &amp; Feature Image</span>
              </h3>
              {article.cover_image && (
                <button
                  type="button"
                  onClick={() => setArticle({ ...article, cover_image: '' })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px', lineHeight: 1.5 }}>
              Serves as the blog thumbnail in list views and the featured cover banner on the article reader page.
            </p>

            {/* Image Preview with Geometric Motif Reference Badge */}
            {article.cover_image ? (
              <div style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #cbd5e1',
                marginBottom: '14px',
                height: '160px',
                background: '#f8fafc'
              }}>
                <img
                  src={article.cover_image}
                  alt="Article Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Geometric motif reference badge overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #38bdf8',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      background: '#38bdf8',
                      display: 'inline-block',
                      borderRadius: article.motif === 'circ' ? '50%' : article.motif === 'semi' ? '4px 4px 0 0' : '0'
                    }}
                  />
                  <span style={{ fontSize: '9px', fontFamily: 'var(--cms-font-mono)', color: '#ffffff', letterSpacing: '0.1em' }}>
                    {article.motif === 'circ' ? 'CIRCLE' : article.motif === 'semi' ? 'SEMI' : 'SQUARE'}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{
                border: '1.5px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '24px 16px',
                textAlign: 'center',
                background: '#f8fafc',
                marginBottom: '14px'
              }}>
                <UploadCloud size={32} style={{ color: '#94a3b8', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                  No Cover Image Selected
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Select from media library, upload, or paste an image URL.
                </div>
              </div>
            )}

            {/* Image Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => setMediaModalOpen(true)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #2563eb',
                  background: '#eff6ff',
                  color: '#2563eb',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Folder size={13} />
                <span>Media Library</span>
              </button>

              <label style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <UploadCloud size={13} />
                <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Direct URL Input */}
            <div>
              <input
                type="text"
                placeholder="Or paste external image URL..."
                value={article.cover_image || ''}
                onChange={(e) => setArticle({ ...article, cover_image: e.target.value })}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '11.5px',
                  outline: 'none',
                  fontFamily: 'var(--cms-font)'
                }}
              />
            </div>
          </div>

          {/* 2. Category & Brand Motif Settings Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '13.5px', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
              Category &amp; Visual Style
            </h3>

            {/* Category Section with "Add New Category" */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                  CATEGORY
                </label>
                {!isAddingNewCategory ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Plus size={12} />
                    <span>Add New Category</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isAddingNewCategory ? (
                <select
                  value={article.category || 'AI & Workflows'}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsAddingNewCategory(true);
                    } else {
                      setArticle({
                        ...article,
                        category: e.target.value,
                        categorySlug: slugify(e.target.value)
                      });
                    }
                  }}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__NEW__">+ Add New Category...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="New category name (e.g. Creative Tech)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewCategoryConfirm();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #2563eb',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategoryConfirm}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Geometric Motif Reference */}
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        background: article.motif === m.key ? '#2563eb' : '#94a3b8',
                        display: 'inline-block',
                        borderRadius: m.key === 'circ' ? '50%' : m.key === 'semi' ? '4px 4px 0 0' : '0'
                      }}
                    />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '4px' }}>
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

          {/* 3. Topic Taxonomy & Keywords Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Tag size={15} style={{ color: '#2563eb' }} />
              <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                Topic Taxonomy (Keywords)
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px', lineHeight: 1.5 }}>
              Add relevant keywords and tags for search indexing and the topic taxonomy badge row.
            </p>

            {/* Tag Pills List */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px', minHeight: '32px' }}>
              {(article.tags || []).map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    fontSize: '11px',
                    fontFamily: 'var(--cms-font-mono)',
                    fontWeight: 700,
                    color: '#334155'
                  }}
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1px'
                    }}
                    title={`Remove ${tag}`}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              {(article.tags || []).length === 0 && (
                <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                  No keywords assigned yet.
                </span>
              )}
            </div>

            {/* Keyword Input & Add Button */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Type keyword(s), comma-separated..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    handleAddTags();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12.5px',
                  outline: 'none',
                  fontFamily: 'var(--cms-font)'
                }}
              />
              <button
                type="button"
                onClick={handleAddTags}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
              Press Enter or separate with commas to add multiple keywords at once.
            </p>
          </div>
        </div>
      </div>

      {/* Media Library Asset Selector Modal */}
      {mediaModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setMediaModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  Choose from Media Library
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  Select an image to use as the blog thumbnail and featured banner.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body: Assets Grid */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {mediaAssets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <ImageIcon size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
                  <p>No media assets found in library.</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '16px'
                }}>
                  {mediaAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => handleSelectMedia(asset)}
                      style={{
                        border: article.cover_image === asset.public_url ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: '#ffffff',
                        transition: 'transform 0.15s, box-shadow 0.15s'
                      }}
                    >
                      <div style={{ height: '110px', background: '#f8fafc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={asset.public_url}
                          alt={asset.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div style={{ padding: '10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {asset.name}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>
                          {asset.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <label style={{
                padding: '8px 16px',
                borderRadius: '6px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <UploadCloud size={14} />
                <span>Upload New to Library</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    await handleCoverFileUpload(e);
                    setMediaModalOpen(false);
                  }}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
