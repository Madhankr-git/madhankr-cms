'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getSeoSettings, saveSeoSettings, logActivity } from '@/lib/db/settings';
import { INITIAL_SEO_SETTINGS } from '@/lib/db/seedData';
import { getMediaAssets, uploadMedia } from '@/lib/db/media';
import { getSiteBaseUrl, toAbsoluteImageUrl, isValidAbsoluteUrl } from '@/lib/utils/seo';
import { SeoSettingsMap, PageSeoConfig, MediaAsset } from '@/lib/types';
import {
  Save,
  CheckCircle2,
  Globe,
  Image as ImageIcon,
  Upload,
  Trash2,
  FolderOpen,
  X,
  Share2,
  AlertCircle
} from 'lucide-react';

export default function SeoSuitePage() {
  const [seo, setSeo] = useState<SeoSettingsMap>(INITIAL_SEO_SETTINGS);
  const [activePage, setActivePage] = useState<keyof SeoSettingsMap>('homepage');
  const [toastMsg, setToastMsg] = useState('');
  const [previewTab, setPreviewTab] = useState<'social' | 'google'>('social');

  // Media Library state
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectingTarget, setSelectingTarget] = useState<'ogImage' | 'featuredImage'>('ogImage');
  const [isUploading, setIsUploading] = useState(false);

  const ogFileInputRef = useRef<HTMLInputElement>(null);
  const featuredFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSeoSettings().then((data) => setSeo(data));
    getMediaAssets().then((assets) => setMediaAssets(assets));
  }, []);

  const handleUpdate = (field: keyof PageSeoConfig, value: any) => {
    if (!seo) return;
    setSeo({
      ...seo,
      [activePage]: {
        ...seo[activePage],
        [field]: value
      }
    });
  };

  // Upload handler for OG image or Featured image
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'ogImage' | 'featuredImage'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const category = field === 'ogImage' ? 'SEO OpenGraph' : 'Featured Banners';
    const res = await uploadMedia(files[0], category);
    setIsUploading(false);

    if (res.success && res.asset) {
      handleUpdate(field, res.asset.public_url);
      const updatedList = await getMediaAssets();
      setMediaAssets(updatedList);
      setToastMsg(`${field === 'ogImage' ? 'OpenGraph' : 'Featured'} image uploaded successfully!`);
      setTimeout(() => setToastMsg(''), 3000);
    } else {
      alert(`Upload failed: ${res.error || 'Could not upload image'}`);
    }
    // Reset file input
    e.target.value = '';
  };

  const handleSelectFromLibrary = (asset: MediaAsset) => {
    handleUpdate(selectingTarget, asset.public_url);
    setMediaModalOpen(false);
  };

  const handleRemoveImage = (field: 'ogImage' | 'featuredImage') => {
    handleUpdate(field, '');
  };

  const handleSave = async () => {
    if (!seo) return;
    const ok = await saveSeoSettings(seo);
    if (ok) {
      logActivity({
        type: 'seo_updated',
        title: 'SEO Settings Saved',
        detail: `Updated metadata and social images for ${activePage.toUpperCase()}`
      });
      // Trigger ISR purge for that page
      try {
        const revalRes = await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            path: activePage === 'homepage' ? '/' : `/${activePage}`
          })
        });
        if (!revalRes.ok) {
          const errData = await revalRes.json().catch(() => ({}));
          console.warn('[CMS SEO] Revalidation warning:', errData.message || 'Cache revalidation failed');
        }
      } catch (e) {
        console.error('[CMS SEO] Revalidation network error:', e);
      }
      setToastMsg('SEO settings & images updated and cache purged!');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  const current = seo[activePage];
  const ogDisplayUrl = toAbsoluteImageUrl(current.ogImage);
  const isCustomOgSet = Boolean(current.ogImage && current.ogImage.trim());

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
          padding: '12px 20px',
          fontSize: '13px',
          fontWeight: 700,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #22c55e',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>
          <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={ogFileInputRef}
        onChange={(e) => handleFileUpload(e, 'ogImage')}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={featuredFileInputRef}
        onChange={(e) => handleFileUpload(e, 'featuredImage')}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        style={{ display: 'none' }}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            SEO &amp; OpenGraph Suite
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b' }}>
            Configure search engine titles, canonical URLs, and Open Graph social share images with live previews
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Save size={15} />
          <span>Save &amp; Revalidate</span>
        </button>
      </div>

      {/* Page Tabs */}
      <div style={{ display: 'flex', gap: '8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px' }}>
        {(['homepage', 'journal', 'work', 'gallery', 'about'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setActivePage(p)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: activePage === p ? '#2563eb' : 'transparent',
              color: activePage === p ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '12px',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            {p === 'journal' ? 'articles' : p}
          </button>
        ))}
      </div>

      {/* Two-Column Grid: Form + Live Previews */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '24px' }}>
        {/* Left Column: Inputs & Image Management Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Metadata Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} style={{ color: '#2563eb' }} />
              <span>Search Engine Meta Tags</span>
            </h2>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>PAGE TITLE TAG</label>
                <span style={{ fontSize: '11px', color: (current.title || '').length > 60 ? '#f59e0b' : '#94a3b8' }}>
                  {(current.title || '').length} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={current.title}
                onChange={(e) => handleUpdate('title', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>META DESCRIPTION</label>
                <span style={{ fontSize: '11px', color: (current.description || '').length > 160 ? '#f59e0b' : '#94a3b8' }}>
                  {(current.description || '').length} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={current.description}
                onChange={(e) => handleUpdate('description', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', lineHeight: 1.5 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                CANONICAL URL
              </label>
              <input
                type="text"
                value={current.canonical}
                onChange={(e) => handleUpdate('canonical', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                KEYWORDS (COMMA SEPARATED)
              </label>
              <input
                type="text"
                value={current.keywords}
                onChange={(e) => handleUpdate('keywords', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
              />
            </div>
          </div>

          {/* Dedicated Image Management Area: Open Graph (OG) Image */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={16} style={{ color: '#2563eb' }} />
                <span>Open Graph (OG) Social Image</span>
              </h2>
              {isCustomOgSet && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage('ogImage')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={13} />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Custom social preview card image for Twitter, LinkedIn, WhatsApp, and Facebook. Recommended resolution: <strong>1200 × 630 px</strong> (1.91:1 aspect ratio).
            </p>

            {/* Live Preview of Current OG Image */}
            <div style={{
              width: '100%',
              aspectRatio: '1.91 / 1',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              overflow: 'hidden',
              backgroundColor: '#0f172a',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={ogDisplayUrl}
                alt="Open Graph Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                backdropFilter: 'blur(4px)'
              }}>
                {isCustomOgSet ? 'Custom OG' : 'Default Asset'} (1200×630)
              </div>
            </div>

            {/* Action Buttons: Direct Upload & Media Library */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => ogFileInputRef.current?.click()}
                disabled={isUploading}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '9px 16px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Upload size={14} />
                <span>{isUploading ? 'Uploading...' : 'Upload New OG Image'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectingTarget('ogImage');
                  setMediaModalOpen(true);
                }}
                style={{
                  background: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '9px 16px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FolderOpen size={14} />
                <span>Choose from Media Library</span>
              </button>
            </div>

            {/* Direct URL Input with Accessibility / Crawler Notice */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                IMAGE PUBLIC URL
              </label>
              <input
                type="text"
                value={current.ogImage || ''}
                placeholder="/assets/og-home.svg or https://..."
                onChange={(e) => handleUpdate('ogImage', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontFamily: 'var(--font-mono)' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '11.5px', color: '#64748b' }}>
                <CheckCircle2 size={12} style={{ color: '#22c55e' }} />
                <span>Publicly accessible to search crawlers as <code>og:image</code> and <code>twitter:image</code>.</span>
              </div>
            </div>
          </div>

          {/* Optional Featured Page Banner Image */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={16} style={{ color: '#64748b' }} />
                <span>Page Featured / Hero Image (Optional)</span>
              </h2>
              {current.featuredImage && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage('featuredImage')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
              Specific hero or masthead banner asset associated with this section of the site.
            </p>

            {current.featuredImage && (
              <div style={{
                width: '100%',
                height: '140px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                overflow: 'hidden',
                backgroundColor: '#0f172a'
              }}>
                <img
                  src={toAbsoluteImageUrl(current.featuredImage)}
                  alt="Featured banner preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => featuredFileInputRef.current?.click()}
                disabled={isUploading}
                style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Upload size={13} />
                <span>Upload Banner</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectingTarget('featuredImage');
                  setMediaModalOpen(true);
                }}
                style={{
                  background: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FolderOpen size={13} />
                <span>Media Library</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Previews (Social Share Card + Google SERP) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Preview Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '6px' }}>
            <button
              type="button"
              onClick={() => setPreviewTab('social')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: previewTab === 'social' ? '#2563eb' : 'transparent',
                color: previewTab === 'social' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Share2 size={14} />
              <span>Social Share Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('google')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: previewTab === 'google' ? '#2563eb' : 'transparent',
                color: previewTab === 'google' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Globe size={14} />
              <span>Google SERP</span>
            </button>
          </div>

          {/* Social Share Card Preview */}
          {previewTab === 'social' && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '14px' }}>
                OPENGRAPH &amp; TWITTER SOCIAL CARD SIMULATION
              </div>

              <div style={{
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
              }}>
                {/* Visual Card Image */}
                <div style={{
                  width: '100%',
                  aspectRatio: '1.91 / 1',
                  background: '#0f172a',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src={ogDisplayUrl}
                    alt="Social Card Banner"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    backdropFilter: 'blur(4px)'
                  }}>
                    {activePage.toUpperCase()}
                  </div>
                </div>

                {/* Social Card Content */}
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                    {getSiteBaseUrl().replace(/^https?:\/\//i, '')}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '8px' }}>
                    {current.title || 'Page Title'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {current.description || 'Page meta description for social crawlers...'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                <strong>Crawlers targeted:</strong> Facebook OpenGraph (<code>og:image</code>), Twitter Cards (<code>twitter:image</code>), LinkedIn Post Inspector, WhatsApp &amp; Slack link unfurlers.
              </div>
            </div>
          )}

          {/* Google SERP Snippet Preview */}
          {previewTab === 'google' && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '14px' }}>
                GOOGLE SEARCH SERP SIMULATION
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: '#202124', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
                  <span style={{ color: '#4d5156', fontSize: '12px' }}>
                    {current.canonical || `${getSiteBaseUrl()}/${activePage === 'homepage' ? '' : activePage}`}
                  </span>
                </div>
                <div style={{ fontSize: '18px', color: '#1a0dab', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', marginBottom: '4px', lineHeight: 1.3 }}>
                  {current.title}
                </div>
                <div style={{ fontSize: '13px', color: '#4d5156', lineHeight: 1.5 }}>
                  {current.description}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Library Selection Modal */}
      {mediaModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '780px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Select from Media Assets
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                  Choose an asset to attach as {selectingTarget === 'ogImage' ? 'OpenGraph Image' : 'Featured Banner'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {mediaAssets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                  <ImageIcon size={40} style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>No media assets available</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>Upload an image using the button in the SEO Suite.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                  {mediaAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => handleSelectFromLibrary(asset)}
                      style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: '#f8fafc'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                    >
                      <div style={{ width: '100%', height: '100px', background: '#0f172a' }}>
                        <img
                          src={asset.public_url}
                          alt={asset.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {asset.name}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                          {asset.category || 'Asset'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
