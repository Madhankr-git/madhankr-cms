'use client';

import React, { useState, useEffect } from 'react';
import { getSeoSettings, saveSeoSettings, logActivity } from '@/lib/db/settings';
import { SeoSettingsMap, PageSeoConfig } from '@/lib/types';
import { Save, CheckCircle2, Globe } from 'lucide-react';

export default function SeoSuitePage() {
  const [seo, setSeo] = useState<SeoSettingsMap | null>(null);
  const [activePage, setActivePage] = useState<keyof SeoSettingsMap>('homepage');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    getSeoSettings().then((data) => setSeo(data));
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

  const handleSave = async () => {
    if (!seo) return;
    const ok = await saveSeoSettings(seo);
    if (ok) {
      logActivity({
        type: 'seo_updated',
        title: 'SEO Settings Saved',
        detail: `Updated metadata for ${activePage.toUpperCase()}`
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
      setToastMsg('SEO settings updated and cache purged!');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  if (!seo) return <div style={{ padding: '32px', fontFamily: 'var(--cms-font)' }}>Loading SEO suite...</div>;

  const current = seo[activePage];

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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            SEO &amp; OpenGraph Suite
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b' }}>
            Configure search engine titles, canonical URLs, and social cards with live SERP preview
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
            {p}
          </button>
        ))}
      </div>

      {/* Two-Column Grid: Form + Google Simulation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Left: Inputs */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
              PAGE TITLE TAG
            </label>
            <input
              type="text"
              value={current.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
              META DESCRIPTION
            </label>
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

        {/* Right: Google SERP Preview Simulation */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#64748b', marginBottom: '16px' }}>
            GOOGLE SERP SIMULATION
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#202124', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
              <span style={{ color: '#4d5156', fontSize: '12px' }}>{current.canonical}</span>
            </div>
            <div style={{ fontSize: '18px', color: '#1a0dab', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', marginBottom: '4px' }}>
              {current.title}
            </div>
            <div style={{ fontSize: '13px', color: '#4d5156', lineHeight: 1.5 }}>
              {current.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
