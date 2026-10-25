import React from 'react';
import type { Metadata } from 'next';
import GalleryClient from '@/components/public/GalleryClient';
import { buildPageMetadata } from '@/lib/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('gallery');
}

export const revalidate = 3600;

export default function GalleryPage() {
  return (
    <div className="standard-page-container" style={{ padding: '40px var(--pad-x) 120px' }}>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div className="section-tag-box">
          <span className="section-num">01</span>
          <span className="section-bracket">[ LAB ]</span>
        </div>
        <h1 className="section-title">CREATIVE LAB &amp; EXPERIMENTS</h1>
      </div>
      <p style={{ maxWidth: '680px', color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.6 }}>
        A repository of visual investigations, geometric studies, generative AI directions, and experimental interfaces.
      </p>

      <GalleryClient />
    </div>
  );
}
