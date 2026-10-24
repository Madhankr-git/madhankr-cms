'use client';

import React from 'react';
import Link from 'next/link';

export default function CmsQuickPill() {
  return (
    <Link href="/admin" className="cms-quick-pill" aria-label="Open CMS Admin Dashboard" id="cmsQuickPill">
      <span className="pill-shape" />
      <span>CMS ADMIN</span>
      <span className="pill-arrow">↗</span>
    </Link>
  );
}
