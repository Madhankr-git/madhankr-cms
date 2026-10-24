'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  Image as ImageIcon,
  Search,
  Settings,
  ExternalLink,
  HardDrive,
  ShieldCheck
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/content', label: 'Content Manager', icon: FileText },
    { href: '/admin/editor', label: 'Post Editor', icon: PenSquare },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
    { href: '/admin/seo', label: 'SEO Suite', icon: Search },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="admin-sidebar" style={{
      width: '250px',
      minWidth: '250px',
      background: 'var(--cms-surface)',
      borderRight: '1px solid var(--cms-border)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      minHeight: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
      fontFamily: 'var(--cms-font)',
      boxSizing: 'border-box'
    }}>
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px', borderBottom: '1px solid var(--cms-border)' }}>
          <div style={{
            width: '38px',
            height: '38px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 900,
            fontFamily: 'var(--cms-font-mono)',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}>
            MK
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--cms-text-heading)', letterSpacing: '-0.02em' }}>
              MadhanKR CMS
            </div>
            <div style={{ fontSize: '11px', color: 'var(--cms-text-muted)', fontWeight: 600 }}>
              V2 · Headless Studio
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ marginTop: '24px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--cms-font-mono)', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--cms-text-subtle)', padding: '0 12px 10px', textTransform: 'uppercase' }}>
            Main Navigation
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', padding: 0, margin: 0 }}>
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const IconComponent = item.icon;
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
                      color: active ? 'var(--cms-primary)' : 'var(--cms-text-body)',
                      background: active ? 'var(--cms-primary-light)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <IconComponent size={18} strokeWidth={active ? 2.2 : 1.8} color={active ? 'var(--cms-primary)' : 'var(--cms-text-muted)'} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div style={{ fontSize: '10px', fontFamily: 'var(--cms-font-mono)', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--cms-text-subtle)', padding: '24px 12px 10px', textTransform: 'uppercase' }}>
            Live Deployment
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
                  color: 'var(--cms-primary)',
                  background: 'var(--cms-primary-light)',
                  textDecoration: 'none'
                }}
              >
                <span>View Public Site</span>
                <ExternalLink size={14} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Storage & Status Widget */}
      <div>
        <div style={{ background: 'var(--cms-surface-subtle)', border: '1px solid var(--cms-border)', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--cms-text-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HardDrive size={13} color="var(--cms-primary)" />
              <span>Media Storage</span>
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--cms-font-mono)', color: 'var(--cms-primary)', fontWeight: 700 }}>24%</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: 'var(--cms-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '24%', height: '100%', background: 'var(--cms-primary)' }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--cms-text-muted)', marginTop: '6px', fontFamily: 'var(--cms-font)' }}>
            1.2 GB of 5 GB used in Supabase
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 6px' }}>
          <ShieldCheck size={14} color="var(--cms-success)" />
          <span style={{ fontSize: '11px', color: 'var(--cms-text-muted)', fontWeight: 600 }}>RLS &amp; Auth Active</span>
        </div>
      </div>
    </aside>
  );
}
