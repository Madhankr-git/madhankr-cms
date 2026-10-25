'use client';

import React, { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  year: string;
  motif: string;
  medium: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Monolithic Geometric Balance',
    category: 'SOLID GEOMETRY',
    categorySlug: 'geometry',
    year: '2026',
    motif: 'motif-square',
    medium: 'Vector & CSS Procedural Canvas',
    description: 'A study on tension and harmony between solid right angles and empty negative canvas space.'
  },
  {
    id: 'gal-2',
    title: 'Radial Momentum Study',
    category: 'SOLID GEOMETRY',
    categorySlug: 'geometry',
    year: '2026',
    motif: 'motif-semi',
    medium: 'Dynamic SVG & Math Curves',
    description: 'Exploration of curved edges creating directional visual momentum across asymmetrical layouts.'
  },
  {
    id: 'gal-3',
    title: 'Sonho — Cinematic Dreamscape',
    category: 'GENERATIVE AI',
    categorySlug: 'ai',
    year: '2025',
    motif: 'motif-quarter',
    medium: 'Midjourney & Runway Gen-2 Direction',
    description: 'Surreal visual storytelling evoking dream memory, fog, and soft atmospheric silhouettes.'
  },
  {
    id: 'gal-4',
    title: 'Orbital Focus Center',
    category: 'SOLID GEOMETRY',
    categorySlug: 'geometry',
    year: '2025',
    motif: 'motif-circle',
    medium: 'CSS Geometric Identity',
    description: 'Minimalist focal geometry anchoring the viewer through high contrast and pure geometry.'
  },
  {
    id: 'gal-5',
    title: 'Dual Axis Interlocking Structure',
    category: 'UI CONCEPTS',
    categorySlug: 'ui',
    year: '2025',
    motif: 'motif-square-sm',
    medium: 'Figma Tokenized Design System',
    description: 'Modular building blocks demonstrating scalable dashboard hierarchy and grid alignments.'
  },
  {
    id: 'gal-6',
    title: 'Synthetic Resonance #04',
    category: 'GENERATIVE AI',
    categorySlug: 'ai',
    year: '2025',
    motif: 'motif-semi-l',
    medium: 'AI Diffusion Latent Walk',
    description: 'Text-to-pattern experimentation fusing brutalist architecture with organic cellular noise.'
  }
];

export default function GalleryClient() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    { key: 'all', label: 'ALL EXPERIMENTS' },
    { key: 'geometry', label: 'SOLID GEOMETRY' },
    { key: 'ai', label: 'GENERATIVE AI' },
    { key: 'ui', label: 'UI CONCEPTS' },
  ];

  const filtered = selectedCat === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.categorySlug === selectedCat);

  return (
    <>
      {/* Filter Bar */}
      <div className="gallery-filter-bar" style={{
        marginTop: '36px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--sky-border)',
        padding: '18px 24px',
        boxShadow: '0 4px 16px rgba(2, 132, 199, 0.05)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCat(cat.key)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                padding: '8px 16px',
                border: selectedCat === cat.key ? '1.5px solid var(--sky-solid)' : '1px solid var(--sky-border)',
                background: selectedCat === cat.key ? 'var(--sky-solid)' : 'transparent',
                color: selectedCat === cat.key ? 'var(--dark-solid)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--grey-text)' }}>
          {filtered.length} ARTIFACTS
        </span>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: '32px',
        padding: '48px 0 100px'
      }}>
        {filtered.map((item) => (
          <article
            key={item.id}
            className="gallery-card"
            style={{
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--sky-border)',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            onClick={() => setActiveItem(item)}
          >
            <div style={{
              width: '100%',
              height: '240px',
              background: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1.5px solid var(--sky-border)'
            }}>
              <div className={`p-motif ${item.motif}`} style={{ transform: 'scale(1.2)' }} />
            </div>

            <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="p-card-tag" style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {item.category}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--grey-text)',
                marginTop: '16px',
                borderTop: '1px solid var(--sky-border)',
                paddingTop: '12px'
              }}>
                <span>{item.year}</span>
                <span style={{ color: 'var(--sky-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>EXPAND</span>
                  <ExternalLink size={12} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 10, 15, 0.92)',
            backdropFilter: 'blur(8px)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px'
          }}
          onClick={() => setActiveItem(null)}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              maxWidth: '680px',
              width: '100%',
              border: '2px solid var(--sky-solid)',
              padding: '36px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--sky-border)',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div style={{ height: '220px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid var(--sky-border)' }}>
              <div className={`p-motif ${activeItem.motif}`} style={{ transform: 'scale(1.4)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="p-card-tag">{activeItem.category}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--grey-text)' }}>
                {activeItem.year} · {activeItem.medium}
              </span>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>
              {activeItem.title}
            </h2>

            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '24px' }}>
              {activeItem.description}
            </p>

            <button
              type="button"
              className="cta-btn"
              onClick={() => setActiveItem(null)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Close Artifact</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
