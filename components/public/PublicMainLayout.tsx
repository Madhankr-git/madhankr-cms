'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function PublicMainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <main className={`public-main-content ${isHome ? 'is-home' : 'has-header'}`}>
      {children}
    </main>
  );
}
