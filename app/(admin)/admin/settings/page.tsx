'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, saveSiteSettings, logActivity } from '@/lib/db/settings';
import { SiteSettings } from '@/lib/types';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    getSiteSettings().then((data) => setSettings(data));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const ok = await saveSiteSettings(settings);
    if (ok) {
      logActivity({
        type: 'seo_updated',
        title: 'Site Settings Updated',
        detail: 'Global branding and contact parameters saved'
      });
      setToastMsg('✓ Site settings updated successfully.');
      setTimeout(() => setToastMsg(''), 3000);
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

  if (!settings) return <div style={{ padding: '32px' }}>Loading settings...</div>;

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
          padding: '12px 20px',
          fontSize: '13px',
          fontWeight: 700,
          zIndex: 1000
        }}>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Site Settings &amp; Preferences
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b' }}>
            Manage brand identity, contact email, social channels, and backup archives
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportBackup}
          style={{
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          ⬇ Export JSON Backup
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>General Brand Identity</h2>

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

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>Social Profiles</h2>

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
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
