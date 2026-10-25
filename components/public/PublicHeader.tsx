'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import gsap from 'gsap';

export default function PublicHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Unified Drawer state for all pages
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Close with Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDrawerOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Stagger animation when drawer opens
  useEffect(() => {
    if (drawerOpen && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        const links = document.querySelectorAll('#sideNav .nav-link');
        const shapes = document.querySelectorAll('#sideNav .nav-shape-item');
        if (links.length > 0) {
          gsap.fromTo(
            links,
            { x: 30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.42, stagger: 0.06, ease: 'power3.out' }
          );
        }
        if (shapes.length > 0) {
          gsap.fromTo(
            shapes,
            { scale: 0, rotate: -45 },
            { scale: 1, rotate: 0, duration: 0.45, stagger: 0.08, ease: 'back.out(2)', delay: 0.2 }
          );
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [drawerOpen]);

  // Standard public navigation items
  const publicNavItems = [
    { href: '/work', label: 'WORK' },
    { href: '/articles', label: 'ARTICLES' },
    { href: '/gallery', label: 'GALLERY' },
    { href: '/about', label: 'ABOUT' },
    { href: '/contact', label: 'CONTACT' },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ─── UNIFIED FLEXBOX NAVBAR ──────────────────────────────── */}
      <header
        className={`public-header ${isHome ? 'public-header--home' : ''}`}
        id="publicSiteHeader"
      >
        <div className="public-header-container">
          {/* Brand Logo: Always on left on ALL pages (mobile & desktop) */}
          <Link
            href="/"
            className="public-brand"
            aria-label="MadhanKR Portfolio Home"
            onClick={() => {
              if (isHome && typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="brand-marks">
              <span className="b-mark sq" />
              <span className="b-mark semi" />
              <span className="b-mark circ" />
            </div>
            <span className="brand-name">MADHANKR</span>
          </Link>

          {/* Desktop Nav Links (Center): Visible on desktop inner pages only */}
          {!isHome && (
            <nav className="public-nav-desktop" aria-label="Main Navigation">
              <ul className="public-nav-list">
                {publicNavItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="public-nav-item">
                      <Link
                        href={item.href}
                        className={`public-nav-link ${active ? 'active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {/* Actions Group (Right): In normal flex flow */}
          <div className="public-header-actions">
            {/* Desktop Inner Pages Contact CTA */}
            {!isHome && (
              <Link href="/contact" className="public-header-cta" id="headerCtaBtn">
                <span className="cta-dot" />
                <span>LET&apos;S TALK</span>
              </Link>
            )}

            {/* Burger Menu Button (In normal flex flow, NOT floating) */}
            <button
              type="button"
              className={`burger ${drawerOpen ? 'open' : ''}`}
              id="burger"
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={drawerOpen}
            >
              <span className="b-line top" />
              <span className="b-line mid" />
              <span className="b-line bot" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── UNIFIED SLIDE-OUT NAVIGATION DRAWER ─────────────────── */}
      <nav
        className={`side-nav ${drawerOpen ? 'open' : ''}`}
        id="sideNav"
        aria-label="Main Navigation Drawer"
        aria-hidden={!drawerOpen}
      >
        <div className="nav-inner">
          <div className="nav-brand-row">
            <Link
              href="/"
              className="nav-brand"
              onClick={() => {
                setDrawerOpen(false);
                if (isHome && typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <span className="nav-sq" />
              <span className="nav-brand-text">MADHANKR</span>
            </Link>

            <button
              type="button"
              className="nav-close-btn"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>

          <ul className="nav-list">
            <li>
              <Link
                href="/"
                className={`nav-link ${isHome ? 'active' : ''}`}
                onClick={() => {
                  setDrawerOpen(false);
                  if (isHome && typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <span className="nav-idx">00</span>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/work"
                className={`nav-link ${pathname.startsWith('/work') ? 'active' : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="nav-idx">01</span>
                <span>Work</span>
              </Link>
            </li>
            <li>
              <Link
                href="/articles"
                className={`nav-link ${pathname.startsWith('/articles') ? 'active' : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="nav-idx">02</span>
                <span>Articles</span>
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className={`nav-link ${pathname.startsWith('/gallery') ? 'active' : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="nav-idx">03</span>
                <span>Gallery</span>
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`nav-link ${pathname.startsWith('/about') ? 'active' : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="nav-idx">04</span>
                <span>About</span>
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`nav-link ${pathname.startsWith('/contact') ? 'active' : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="nav-idx">05</span>
                <span>Contact</span>
              </Link>
            </li>
          </ul>

          {/* Geometric shapes in drawer */}
          <div className="nav-shapes">
            <div className="nav-shape-item n-square" />
            <div className="nav-shape-item n-circle" />
            <div className="nav-shape-item n-semi" />
          </div>

          <div className="nav-footer">
            <span>DESIGN × AI × CODE</span>
            <span>© 2026</span>
          </div>
        </div>
      </nav>

      {/* Backdrop Overlay */}
      <div
        className={`overlay ${drawerOpen ? 'show' : ''}`}
        id="overlay"
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
