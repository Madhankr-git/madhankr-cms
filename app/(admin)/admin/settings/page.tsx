'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getSiteSettings, saveSiteSettings, logActivity } from '@/lib/db/settings';
import { INITIAL_SITE_SETTINGS } from '@/lib/db/seedData';
import { getMediaAssets, uploadMedia } from '@/lib/db/media';
import { SiteSettings, MediaAsset } from '@/lib/types';
import {
  Download,
  Save,
  CheckCircle2,
  Globe,
  Upload,
  RotateCcw,
  Trash2,
  FolderOpen,
  X,
  Sparkles
} from 'lucide-react';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [toastMsg, setToastMsg] = useState('');
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  // Media Library state for Favicon selection
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const faviconFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSiteSettings().then((data) => setSettings(data));
    getMediaAssets().then((assets) => setMediaAssets(assets));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const ok = await saveSiteSettings(settings);
    if (ok) {
      logActivity({
        type: 'seo_updated',
        title: 'Site Settings Updated',
        detail: 'Global branding, favicon, and contact parameters saved'
      });

      // Update favicon in active browser tab immediately if changed
      if (typeof document !== 'undefined') {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
          link.href = settings.faviconUrl || '/favicon.ico';
        }
      }

      // Trigger ISR cache revalidation
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ path: '/' })
        });
      } catch (err) {
        console.warn('Revalidation notice:', err);
      }

      setToastMsg('Site settings and favicon updated successfully!');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingFavicon(true);
    const res = await uploadMedia(files[0], 'Favicons');
    setIsUploadingFavicon(false);

    if (res.success && res.asset) {
      if (settings) {
        setSettings({ ...settings, faviconUrl: res.asset.public_url });
      }
      const updatedList = await getMediaAssets();
      setMediaAssets(updatedList);
      setToastMsg('Favicon uploaded! Click Save to apply across the site.');
      setTimeout(() => setToastMsg(''), 3000);
    } else {
      alert(`Upload failed: ${res.error || 'Could not upload favicon'}`);
    }
    e.target.value = '';
  };

  const handleSelectFaviconFromLibrary = (asset: MediaAsset) => {
    if (settings) {
      setSettings({ ...settings, faviconUrl: asset.public_url });
    }
    setMediaModalOpen(false);
  };

  const handleResetFavicon = () => {
    if (settings) {
      setSettings({ ...settings, faviconUrl: '/favicon.ico' });
    }
  };

  const handleRemoveFavicon = () => {
    if (settings) {
      setSettings({ ...settings, faviconUrl: '' });
    }
  };

  const handleExportBackup = () => {
    if (typeof window === 'undefined') return;
    const dump = {
      timestamp: new Date().toISOString(),
      settings,
      version: '2.0.0'
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `madhankr-cms-backup-${Date.now()}.json`;
    a.click();
  };

  const currentFavicon = settings.faviconUrl || '/favicon.ico';

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

      {/* Hidden file input for Favicon */}
      <input
        type="file"
        ref={faviconFileInputRef}
        onChange={handleFaviconUpload}
        accept=".ico,.png,.svg,.webp,image/x-icon,image/png,image/svg+xml,image/webp"
        style={{ display: 'none' }}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Site Settings &amp; Preferences
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b' }}>
            Manage brand identity, favicon, contact channels, and backup archives
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportBackup}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#334155'
          }}
        >
          <Download size={14} />
          <span>Export JSON Backup</span>
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ─── FAVICON MANAGEMENT CARD ───────────────────────────── */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Globe size={16} style={{ color: '#2563eb' }} />
                <span>Website Favicon &amp; Browser Icons</span>
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                Configure the icon displayed on browser tabs, bookmarks, and mobile home screen shortcuts across all public pages.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleResetFavicon}
                title="Reset to default favicon.ico"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#475569'
                }}
              >
                <RotateCcw size={12} />
                <span>Reset Default</span>
              </button>

              {settings.faviconUrl && (
                <button
                  type="button"
                  onClick={handleRemoveFavicon}
                  title="Remove custom favicon"
                  style={{
                    background: 'none',
                    border: 'none',
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
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px' }}>
            {/* Visual Preview Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#64748b' }}>
                BROWSER TAB PREVIEW
              </div>

              {/* Realistic Browser Tab Simulation */}
              <div style={{
                background: '#e2e8f0',
                borderRadius: '8px 8px 0 0',
                padding: '8px 12px 0',
                display: 'flex',
                alignItems: 'flex-end',
                boxShadow: 'inset 0 -1px 0 #cbd5e1'
              }}>
                <div style={{
                  background: '#ffffff',
                  borderRadius: '6px 6px 0 0',
                  padding: '6px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  maxWidth: '220px',
                  boxShadow: '0 -1px 3px rgba(0,0,0,0.05)'
                }}>
                  <img
                    src={currentFavicon}
                    alt="Favicon Tab Preview"
                    style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                    onError={(e) => {
                      // Fallback if custom URL fails to load
                      (e.currentTarget as HTMLImageElement).src = '/favicon.ico';
                    }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {settings.siteName} — {settings.siteTagline}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>×</span>
                </div>
              </div>

              {/* Multi-Resolution Scale Inspection */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '6px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                    <img src={currentFavicon} alt="48px" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>48×48 px</span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '32px', height: '32px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                    <img src={currentFavicon} alt="32px" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>32×32 px</span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                    <img src={currentFavicon} alt="16px" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>16×16 px</span>
                </div>
              </div>
            </div>

            {/* Controls & Upload Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => faviconFileInputRef.current?.click()}
                  disabled={isUploadingFavicon}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '9px 16px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: isUploadingFavicon ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Upload size={14} />
                  <span>{isUploadingFavicon ? 'Uploading...' : 'Upload Favicon File'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaModalOpen(true)}
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
                  <span>Media Library</span>
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  FAVICON URL (OR LOCAL PATH)
                </label>
                <input
                  type="text"
                  value={settings.faviconUrl || ''}
                  placeholder="/favicon.ico or https://..."
                  onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontFamily: 'var(--font-mono)' }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Supported formats: <strong>.ico, .png, .svg, .webp</strong>. Dynamically linked in document head across all public pages.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── GENERAL BRAND IDENTITY ────────────────────────────── */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>General Brand Identity</h2>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
              SITE NAME
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
              SITE TAGLINE
            </label>
            <input
              type="text"
              value={settings.siteTagline}
              onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
              AUTHOR BIOGRAPHY
            </label>
            <textarea
              rows={3}
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', lineHeight: 1.5 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
              CONTACT EMAIL
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
            />
          </div>
        </div>

        {/* ─── SOCIAL PROFILES ───────────────────────────────────── */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Social Profiles</h2>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
              LINKEDIN URL
            </label>
            <input
              type="text"
              value={settings.socialLinks?.linkedin || ''}
              onChange={(e) => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
              })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
              GITHUB URL
            </label>
            <input
              type="text"
              value={settings.socialLinks?.github || ''}
              onChange={(e) => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, github: e.target.value }
              })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            style={{
              background: '#2563eb',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Save size={15} />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>

      {/* Media Library Selection Modal for Favicon */}
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
            maxWidth: '720px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Select Favicon from Media Library
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                  Choose an icon or logo asset to apply as the website favicon
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
                  <Globe size={40} style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>No media assets available</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>Upload an icon file using the upload button in Site Settings.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
                  {mediaAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => handleSelectFaviconFromLibrary(asset)}
                      style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '12px'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                    >
                      <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <img
                          src={asset.public_url}
                          alt={asset.name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {asset.name}
                      </div>
                      <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                        {asset.category || 'Icon'}
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
