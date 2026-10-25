import React from 'react';
import '@/styles/public.css';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import GsapAnimationEngine from '@/components/public/GsapAnimationEngine';
import PublicMainLayout from '@/components/public/PublicMainLayout';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-site-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GsapAnimationEngine />

      {/* Floating scroll background shapes */}
      <div className="scroll-shapes-container" aria-hidden="true">
        <div className="bg-shape bg-circle" id="bgCircle1" />
        <div className="bg-shape bg-semi" id="bgSemi1" />
        <div className="bg-shape bg-square" id="bgSquare1" />
        <div className="bg-shape bg-semi-h" id="bgSemi2" />
        <div className="bg-shape bg-circle-sm" id="bgCircle2" />
      </div>

      <PublicHeader />

      <PublicMainLayout>{children}</PublicMainLayout>

      <PublicFooter />
    </div>
  );
}
