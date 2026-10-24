'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: '📊' },
    { href: '/admin/content', label: 'Content Manager', icon: '📄' },
    { href: '/admin/editor', label: 'Post Editor', icon: '✏️' },
    { href: '/admin/media', label: 'Media Library', icon: '🖼️' },
    { href: '/admin/seo', label: 'SEO Suite', icon: '🔍' },
    { href: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="cms-sidebar" style={{
      width: '260px',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      minHeight: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}>
            MK
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a', letterSpacing: '-0.02em' }}>
              MadhanKR CMS
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
              V2 · Headless Studio
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ marginTop: '24px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.15em', color: '#94a3b8', padding: '0 12px 10px', textTransform: 'uppercase' }}>
            Main Navigation
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: active ? 700 : 500,
                      color: active ? '#2563eb' : '#475569',
                      background: active ? '#eff6ff' : 'transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.15em', color: '#94a3b8', padding: '24px 12px 10px', textTransform: 'uppercase' }}>
            Live Deployment
          </div>
          <ul style={{ listStyle: 'none' }}>
            <li>
              <Link
                href="/"
                target="_blank"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0284c7',
                  background: '#f0f9ff'
                }}
              >
                <span>View Public Site</span>
                <span>↗</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Storage & Status Widget */}
      <div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Media Storage</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#2563eb', fontWeight: 700 }}>24%</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '24%', height: '100%', background: '#2563eb' }} />
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>
            1.2 GB of 5 GB used in Supabase
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>RLS &amp; Auth Active</span>
        </div>
      </div>
    </aside>
  );
}
