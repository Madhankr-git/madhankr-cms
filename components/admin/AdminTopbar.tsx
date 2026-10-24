'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminAuth } from './AdminAuthContext';

export default function AdminTopbar() {
  const { user, logout } = useAdminAuth();

  return (
    <header style={{
      height: '70px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Search Input Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '8px 16px',
        width: '320px'
      }}>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>🔍</span>
        <input
          type="text"
          placeholder="Search articles, projects, settings..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '13px',
            width: '100%',
            color: '#0f172a'
          }}
        />
        <span style={{
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          color: '#94a3b8',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          ⌘K
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link
          href="/admin/editor"
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '12.5px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
          }}
        >
          <span>+</span>
          <span>New Post</span>
        </Link>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)'
          }}>
            MK
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              {user?.name || 'MadhanKR'}
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748b' }}>
              Super Admin
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => logout()}
          style={{
            background: 'transparent',
            border: '1px solid #e2e8f0',
            padding: '7px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#ef4444',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
