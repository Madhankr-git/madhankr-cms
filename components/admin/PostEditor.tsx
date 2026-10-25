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
  getArticlePublicUrl,
  resolveArticleCanonicalUrl,
  isValidAbsoluteUrl,
  getSiteBaseUrl,
  toAbsoluteImageUrl
} from '@/lib/utils/seo';
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
  FolderPlus,
  Globe,
  Link2,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Share2
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
  const [selectingMediaTarget, setSelectingMediaTarget] = useState<'cover' | 'content'>('cover');
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // In-article image URL insertion state
  const [showImageInserter, setShowImageInserter] = useState(false);
  const [imageUrlToInsert, setImageUrlToInsert] = useState('');
  const [imageAltToInsert, setImageAltToInsert] = useState('');

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

  // Explicit slug editing state
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [customSlugInput, setCustomSlugInput] = useState('');
  const [slugManuallySet, setSlugManuallySet] = useState(Boolean(initialId));

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
    likes: 0,
    seo_title: '',
    meta_description: '',
    canonical_url: '',
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
          setCustomSlugInput(found.slug);
          setSlugManuallySet(true);
        }
        setLoading(false);
      });
    }
  }, [initialId]);

  const handleTitleChange = (val: string) => {
    const updated = { ...article, title: val };
    // As long as the slug has not been explicitly locked / customized via "Edit Slug",
    // dynamically derive and sync the slug in real time from the title.
    if (!slugManuallySet) {
      const generated = slugify(val);
      updated.slug = generated;
      updated.id = generated;
      setCustomSlugInput(generated);
    }
    setArticle(updated);
  };

  const handleApplySlug = () => {
    const cleaned = slugify(customSlugInput || article.slug || '');
    if (cleaned) {
      setArticle({ ...article, slug: cleaned, id: article.id || cleaned });
      setCustomSlugInput(cleaned);
      setSlugManuallySet(true);
    }
    setIsEditingSlug(false);
  };

  const handleResetSlugToTitle = () => {
    const generated = slugify(article.title || '');
    setArticle({ ...article, slug: generated, id: article.id || generated });
    setCustomSlugInput(generated);
    setSlugManuallySet(false);
    setIsEditingSlug(false);
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

  // Insert image markdown snippet into article content at cursor position
  const handleInsertImageToContent = (overrideUrl?: string, overrideAlt?: string) => {
    const url = (overrideUrl || imageUrlToInsert).trim();
    if (!url) return;
    const alt = (overrideAlt !== undefined ? overrideAlt : imageAltToInsert).trim() || 'Article visual';
    const markdownSnippet = `\n\n![${alt}](${url})\n\n`;

    const textarea = document.getElementById('editorTextarea') as HTMLTextAreaElement | null;
    if (textarea) {
      const start = textarea.selectionStart ?? (article.content || '').length;
      const end = textarea.selectionEnd ?? start;
      const current = article.content || '';
      const updated = current.substring(0, start) + markdownSnippet + current.substring(end);
      handleContentChange(updated);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + markdownSnippet.length, start + markdownSnippet.length);
      }, 50);
    } else {
      handleContentChange((article.content || '') + markdownSnippet);
    }

    setImageUrlToInsert('');
    setImageAltToInsert('');
    setShowImageInserter(false);
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
      if (selectingMediaTarget === 'content') {
        handleInsertImageToContent(res.asset.public_url, res.asset.name);
      } else {
        setArticle({ ...article, cover_image: res.asset.public_url });
      }
      // Refresh media library
      const updatedList = await getMediaAssets();
      setMediaAssets(updatedList);
    } else {
      alert(`Upload failed: ${res.error || 'Could not upload image'}`);
    }
  };

  const handleSelectMedia = (asset: MediaAsset) => {
    if (selectingMediaTarget === 'content') {
      handleInsertImageToContent(asset.public_url, asset.name);
    } else {
      setArticle({ ...article, cover_image: asset.public_url });
    }
    setMediaModalOpen(false);
  };

  const handleSave = async (publishNow = false) => {
    if (!article.title?.trim()) {
      alert('Please enter an article title.');
      return;
    }

    // Validate canonical override format if provided
    if (article.canonical_url && article.canonical_url.trim()) {
      if (!isValidAbsoluteUrl(article.canonical_url.trim())) {
        alert('Invalid Canonical URL. Please provide a full absolute URL starting with http:// or https:// (or leave the field empty for automatic self-canonical).');
        return;
      }
    }

    setIsSaving(true);
    const resolvedSlug = (article.slug && slugify(article.slug)) || slugify(article.title);
    const finalArticle: Article = {
      id: article.id || resolvedSlug,
      slug: resolvedSlug,
      title: article.title,
      summary: article.summary || 'Article reflection by MadhanKR.',
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
      seo_title: article.seo_title?.trim() || undefined,
      meta_description: article.meta_description?.trim() || undefined,
      canonical_url: article.canonical_url?.trim() || undefined,
      published_at: publishNow ? (article.published_at || new Date().toISOString()) : article.published_at,
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
            <span>{isSaving ? 'Publishing...' : 'Publish Article'}</span>
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

            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
              <span style={{ fontFamily: 'var(--cms-font-mono)', color: '#64748b' }}>Route:</span>
              {!isEditingSlug ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--cms-font-mono)', color: '#2563eb', fontWeight: 700 }}>
                    /article/{article.slug || 'untitled'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSlugInput(article.slug || '');
                      setIsEditingSlug(true);
                    }}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      padding: '3px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit3 size={11} />
                    <span>Edit Slug</span>
                  </button>
                  {slugManuallySet && (
                    <button
                      type="button"
                      onClick={handleResetSlugToTitle}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#2563eb',
                        cursor: 'pointer'
                      }}
                      title="Re-sync slug dynamically with article title"
                    >
                      ↺ Sync with Title
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--cms-font-mono)', color: '#64748b' }}>/article/</span>
                  <input
                    type="text"
                    value={customSlugInput}
                    onChange={(e) => setCustomSlugInput(e.target.value)}
                    placeholder="custom-article-slug"
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontFamily: 'var(--cms-font-mono)',
                      borderRadius: '4px',
                      border: '1.5px solid #2563eb',
                      outline: 'none',
                      color: '#0f172a'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplySlug();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplySlug}
                    style={{
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Save Slug
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingSlug(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '11px',
                      color: '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
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
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => insertMarkdown('**', '**')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>B</button>
                <button type="button" onClick={() => insertMarkdown('*', '*')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontStyle: 'italic', cursor: 'pointer' }}>I</button>
                <button type="button" onClick={() => insertMarkdown('## ')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>H2</button>
                <button type="button" onClick={() => insertMarkdown('### ')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>H3</button>
                <button type="button" onClick={() => insertMarkdown('> ')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', cursor: 'pointer' }}>Quote</button>
                <button type="button" onClick={() => insertMarkdown('```\n', '\n```')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontFamily: 'var(--cms-font-mono)', cursor: 'pointer' }}>Code</button>
                <button type="button" onClick={() => insertMarkdown('- ')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', cursor: 'pointer' }}>List</button>
                <span style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 4px' }} />
                <button
                  type="button"
                  onClick={() => setShowImageInserter(!showImageInserter)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: showImageInserter ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                    background: showImageInserter ? '#eff6ff' : '#ffffff',
                    color: showImageInserter ? '#2563eb' : '#0f172a',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Insert an image URL anywhere in the article (21:9 ratio)"
                >
                  <ImageIcon size={13} style={{ color: '#2563eb' }} />
                  <span>+ Image URL</span>
                </button>
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

            {/* In-Article Image URL Inserter Bar */}
            {showImageInserter && activeTab === 'write' && (
              <div style={{
                background: '#f8fafc',
                borderBottom: '1.5px solid #e2e8f0',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--cms-font-mono)', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em' }}>
                    INSERT IN-ARTICLE IMAGE (CINEMATIC 21:9 RATIO)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowImageInserter(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Image URL (e.g. https://... or /assets/...)"
                    value={imageUrlToInsert}
                    onChange={(e) => setImageUrlToInsert(e.target.value)}
                    style={{
                      flex: '2',
                      minWidth: '220px',
                      padding: '7px 10px',
                      borderRadius: '5px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleInsertImageToContent();
                      }
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Caption / Alt text (optional)"
                    value={imageAltToInsert}
                    onChange={(e) => setImageAltToInsert(e.target.value)}
                    style={{
                      flex: '1',
                      minWidth: '150px',
                      padding: '7px 10px',
                      borderRadius: '5px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleInsertImageToContent();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleInsertImageToContent()}
                    disabled={!imageUrlToInsert.trim()}
                    style={{
                      background: imageUrlToInsert.trim() ? '#2563eb' : '#94a3b8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: imageUrlToInsert.trim() ? 'pointer' : 'not-allowed',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Plus size={13} />
                    <span>Insert into Article</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectingMediaTarget('content');
                      setMediaModalOpen(true);
                    }}
                    style={{
                      background: '#ffffff',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: '5px',
                      padding: '7px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Folder size={13} style={{ color: '#2563eb' }} />
                    <span>Pick from Media</span>
                  </button>
                </div>
              </div>
            )}

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
                <div style={{ fontSize: '11px', fontFamily: 'var(--cms-font-mono)', color: '#2563eb', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.08em' }}>
                  [ LIVE TYPOGRAPHY &amp; 21:9 MEDIA PREVIEW ]
                </div>
                {article.cover_image && (
                  <div style={{
                    width: '100%',
                    aspectRatio: '21 / 9',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    border: '1.5px solid #0f172a',
                    marginBottom: '24px',
                    background: '#f8fafc'
                  }}>
                    <img
                      src={article.cover_image}
                      alt={article.title || 'Cover'}
                      style={{ width: '100%', height: '100%', aspectRatio: '21 / 9', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}
                <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px', color: '#0f172a' }}>
                  {article.title || 'Untitled Article'}
                </h1>
                {article.summary && (
                  <p style={{ fontSize: '16px', color: '#64748b', fontStyle: 'italic', marginBottom: '24px' }}>
                    {article.summary}
                  </p>
                )}
                <div style={{ color: '#0f172a', fontSize: '15px' }}>
                  {(article.content || '').split('\n\n').map((block, bIdx) => {
                    const trimmed = block.trim();
                    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                    if (imgMatch) {
                      return (
                        <div key={bIdx} style={{ margin: '24px 0', width: '100%' }}>
                          <div style={{
                            width: '100%',
                            aspectRatio: '21 / 9',
                            overflow: 'hidden',
                            borderRadius: '6px',
                            border: '1.5px solid #cbd5e1',
                            background: '#f8fafc'
                          }}>
                            <img
                              src={imgMatch[2]}
                              alt={imgMatch[1]}
                              style={{ width: '100%', height: '100%', aspectRatio: '21 / 9', objectFit: 'cover', display: 'block' }}
                            />
                          </div>
                          {imgMatch[1] && (
                            <div style={{ fontSize: '11px', fontFamily: 'var(--cms-font-mono)', color: '#64748b', textAlign: 'center', marginTop: '6px' }}>
                              {imgMatch[1]} (21:9 ratio)
                            </div>
                          )}
                        </div>
                      );
                    }
                    if (trimmed.startsWith('## ')) {
                      return <h2 key={bIdx} style={{ fontSize: '20px', fontWeight: 800, margin: '24px 0 8px' }}>{trimmed.replace(/^## /, '')}</h2>;
                    }
                    if (trimmed.startsWith('### ')) {
                      return <h3 key={bIdx} style={{ fontSize: '17px', fontWeight: 700, margin: '18px 0 6px' }}>{trimmed.replace(/^### /, '')}</h3>;
                    }
                    if (trimmed.startsWith('> ')) {
                      return <blockquote key={bIdx} style={{ borderLeft: '3px solid #2563eb', paddingLeft: '14px', margin: '16px 0', fontStyle: 'italic', color: '#475569' }}>{trimmed.replace(/^> /, '')}</blockquote>;
                    }
                    return <p key={bIdx} style={{ marginBottom: '14px', lineHeight: 1.7 }}>{block}</p>;
                  })}
                </div>
              </div>
            )}

            <div style={{ padding: '8px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontFamily: 'var(--cms-font-mono)' }}>
              <span>Reading time: {article.readTime}</span>
              <span>{(article.content || '').split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>

          {/* ─── SEO & SOCIAL METADATA SECTION ─────────────────── */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Search Engine Optimization (SEO) &amp; Social Sharing
                </h3>
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--cms-font-mono)', color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                AUTOMATIC SCHEMA &amp; OPEN GRAPH
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              Fine-tune search engine indexability and social sharing cards. All fields are optional and default intelligently to your article content and thumbnail.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Field A: SEO Title */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', fontFamily: 'var(--cms-font-mono)', fontWeight: 800, color: '#475569' }}>
                    SEO TITLE TAG (OPTIONAL)
                  </label>
                  <span style={{ fontSize: '11px', color: (article.seo_title || '').length > 60 ? '#f59e0b' : '#94a3b8' }}>
                    {(article.seo_title || '').length} / 60 chars (Recommended: 50–60)
                  </span>
                </div>
                <input
                  type="text"
                  placeholder={`Leave blank to use article title: "${article.title || 'Untitled Article'}"`}
                  value={article.seo_title || ''}
                  onChange={(e) => setArticle({ ...article, seo_title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    fontFamily: 'var(--cms-font)',
                    outline: 'none',
                    color: '#0f172a'
                  }}
                />
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  {article.seo_title?.trim() ? (
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ Custom SEO title active.</span>
                  ) : (
                    <span>Defaulting to article title: &quot;{article.title || 'Untitled Article'}&quot;</span>
                  )}
                </div>
              </div>

              {/* Field B: Meta Description */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', fontFamily: 'var(--cms-font-mono)', fontWeight: 800, color: '#475569' }}>
                    META DESCRIPTION (OPTIONAL)
                  </label>
                  <span style={{ fontSize: '11px', color: (article.meta_description || '').length > 160 ? '#f59e0b' : '#94a3b8' }}>
                    {(article.meta_description || '').length} / 160 chars (Recommended: 120–160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder={`Leave blank to use executive summary: "${(article.summary || 'Short summary of article...').substring(0, 80)}..."`}
                  value={article.meta_description || ''}
                  onChange={(e) => setArticle({ ...article, meta_description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'var(--cms-font)',
                    lineHeight: 1.5,
                    outline: 'none',
                    color: '#0f172a'
                  }}
                />
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  {article.meta_description?.trim() ? (
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ Custom meta description active.</span>
                  ) : (
                    <span>Defaulting to executive summary fallback.</span>
                  )}
                </div>
              </div>

              {/* Field C: Canonical URL Override */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', fontFamily: 'var(--cms-font-mono)', fontWeight: 800, color: '#475569' }}>
                    CANONICAL URL (OPTIONAL OVERRIDE)
                  </label>
                  {article.canonical_url && (
                    <button
                      type="button"
                      onClick={() => setArticle({ ...article, canonical_url: '' })}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Clear Override
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. https://medium.com/@madhankr/how-to-become-designer"
                  value={article.canonical_url || ''}
                  onChange={(e) => setArticle({ ...article, canonical_url: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: article.canonical_url?.trim() && !isValidAbsoluteUrl(article.canonical_url.trim())
                      ? '1.5px solid #ef4444'
                      : '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'var(--cms-font-mono)',
                    outline: 'none',
                    color: '#0f172a'
                  }}
                />

                {/* Validation and Helper Messages */}
                {article.canonical_url?.trim() && !isValidAbsoluteUrl(article.canonical_url.trim()) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#ef4444', marginTop: '6px' }}>
                    <AlertCircle size={13} />
                    <span>Please enter a valid absolute URL starting with http:// or https://</span>
                  </div>
                ) : article.canonical_url?.trim() ? (
                  <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '6px', padding: '8px 12px', marginTop: '8px', fontSize: '12px', color: '#92400e' }}>
                    <strong>★ Custom Canonical Override Active:</strong> Search engines will treat <code>{article.canonical_url.trim()}</code> as the preferred canonical version instead of this website&apos;s URL.
                  </div>
                ) : (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 12px', marginTop: '8px', fontSize: '12px', color: '#475569' }}>
                    <strong>✓ Self-Canonical Active (Recommended):</strong> Field is empty, so search engines automatically use this article&apos;s own public URL:
                    <div style={{ marginTop: '3px', fontFamily: 'var(--cms-font-mono)', color: '#2563eb', fontSize: '11.5px' }}>
                      {getArticlePublicUrl(article.slug || 'untitled')}
                    </div>
                  </div>
                )}
              </div>

              {/* SERP & Social Sharing Card Preview */}
              <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--cms-font-mono)', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  GOOGLE SEARCH SNIPPET PREVIEW
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '12px', color: '#202124', marginBottom: '2px', fontFamily: 'Arial, sans-serif' }}>
                    <span style={{ color: '#4d5156', fontSize: '11px' }}>
                      {getSiteBaseUrl()} › article › {article.slug || 'untitled'}
                    </span>
                  </div>
                  <div style={{ fontSize: '18px', color: '#1a0dab', fontWeight: 500, lineHeight: 1.3, marginBottom: '4px', fontFamily: 'Arial, sans-serif' }}>
                    {article.seo_title?.trim() || article.title || 'Untitled Article'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#4d5156', lineHeight: 1.5, fontFamily: 'Arial, sans-serif' }}>
                    {article.meta_description?.trim() || article.summary || 'Observations and reflections on design craft, front-end architecture, and creative workflows.'}
                  </div>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#64748b' }}>
                  <Share2 size={13} style={{ color: '#2563eb', flexShrink: 0 }} />
                  <span>
                    Social cards (OpenGraph &amp; Twitter) will automatically use your article cover thumbnail (<strong>{article.cover_image ? 'Cover image attached' : 'Default visual brand asset'}</strong>) as <code>og:image</code> and <code>twitter:image</code>.
                  </span>
                </div>
              </div>
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
                border: '1.5px solid #cbd5e1',
                marginBottom: '14px',
                width: '100%',
                aspectRatio: '21 / 9',
                background: '#f8fafc'
              }}>
                <img
                  src={article.cover_image}
                  alt="Article Preview"
                  style={{ width: '100%', height: '100%', aspectRatio: '21 / 9', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #38bdf8',
                  borderRadius: '3px',
                  padding: '2px 6px',
                  fontFamily: 'var(--cms-font-mono)',
                  fontSize: '9px',
                  fontWeight: 800,
                  color: '#38bdf8',
                  letterSpacing: '0.08em'
                }}>
                  21:9 RATIO
                </div>
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
                  Select from media library, upload, or paste an image URL (21:9 ratio).
                </div>
              </div>
            )}

            {/* Image Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectingMediaTarget('cover');
                  setMediaModalOpen(true);
                }}
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
