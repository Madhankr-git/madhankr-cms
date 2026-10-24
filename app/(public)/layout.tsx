import React from 'react';
import '@/styles/public.css';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import CmsQuickPill from '@/components/public/CmsQuickPill';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-site-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Floating scroll background shapes */}
      <div className="scroll-shapes-container" aria-hidden="true">
        <div className="bg-shape bg-semi" />
        <div className="bg-shape bg-square" />
        <div className="bg-shape bg-circ" />
        <div className="bg-shape bg-diamond" />
      </div>

      <PublicHeader />

      <main style={{ flex: 1, position: 'relative', zIndex: 1, paddingTop: '76px' }}>
        {children}
      </main>

      <PublicFooter />
      <CmsQuickPill />
    </div>
  );
}
