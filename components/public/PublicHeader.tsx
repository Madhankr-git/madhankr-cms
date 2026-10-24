'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export default function PublicHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'HOME', idx: '01' },
    { href: '/work', label: 'WORK', idx: '02' },
    { href: '/journal', label: 'JOURNAL', idx: '03' },
    { href: '/gallery', label: 'GALLERY', idx: '04' },
    { href: '/about', label: 'ABOUT', idx: '05' },
    { href: '/contact', label: 'CONTACT', idx: '06' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="public-header" id="publicSiteHeader">
        <Link href="/" className="public-brand" aria-label="MadhanKR Portfolio Home">
          <div className="brand-marks">
            <span className="b-mark sq" />
            <span className="b-mark semi" />
            <span className="b-mark circ" />
          </div>
          <span className="brand-name">MADHANKR</span>
        </Link>

        <nav aria-label="Main Navigation">
          <ul className="public-nav-list">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="public-nav-item">
                  <Link
                    href={item.href}
                    className={`public-nav-link ${active ? 'active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="p-idx">{item.idx}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/contact" className="public-header-cta" id="headerCtaBtn">
            <span className="cta-dot" />
            <span>LET&apos;S TALK</span>
          </Link>

          <button
            type="button"
            className={`public-burger-btn ${drawerOpen ? 'open' : ''}`}
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle Navigation Drawer"
            id="mobileBurgerBtn"
          >
            <span className="line top" />
            <span className="line mid" />
            <span className="line bot" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`drawer-overlay ${drawerOpen ? 'show' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Slide-Out Drawer */}
      <aside className={`public-mobile-drawer ${drawerOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <div className="public-drawer-inner">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="brand-marks">
                <span className="b-mark sq" />
                <span className="b-mark semi" />
                <span className="b-mark circ" />
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <ul className="drawer-links-list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`drawer-nav-link ${isActive(item.href) ? 'active' : ''}`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <span style={{ fontSize: '13px', color: 'var(--sky-blue)', fontFamily: 'var(--font-mono)' }}>
                      {item.idx}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--grey-text)', letterSpacing: '0.15em', marginBottom: '8px' }}>
              CURRENT STATUS
            </p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Available for select Q4 design &amp; code contracts
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
