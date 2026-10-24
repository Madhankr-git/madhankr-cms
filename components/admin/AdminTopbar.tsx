'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminAuth } from './AdminAuthContext';
import { Search, Plus, LogOut } from 'lucide-react';

export default function AdminTopbar() {
  const { user, logout } = useAdminAuth();

  return (
    <header className="cms-topbar" style={{
      height: '68px',
      background: 'var(--cms-surface)',
      borderBottom: '1px solid var(--cms-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      fontFamily: 'var(--cms-font)'
    }}>
      {/* Search Input Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'var(--cms-surface-subtle)',
        border: '1px solid var(--cms-border)',
        borderRadius: 'var(--cms-radius-pill)',
        padding: '7px 16px',
        width: '320px'
      }}>
        <Search size={15} color="var(--cms-text-subtle)" />
        <input
          type="text"
          placeholder="Search articles, projects, settings..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '13px',
            fontFamily: 'var(--cms-font)',
            width: '100%',
            color: 'var(--cms-text-heading)'
          }}
        />
        <span style={{
          fontSize: '10px',
          fontFamily: 'var(--cms-font-mono)',
          color: 'var(--cms-text-subtle)',
          background: 'var(--cms-surface)',
          border: '1px solid var(--cms-border)',
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
            background: 'var(--cms-primary)',
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
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
            fontFamily: 'var(--cms-font)'
          }}
        >
          <Plus size={15} />
          <span>New Post</span>
        </Link>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--cms-border)', paddingLeft: '20px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--cms-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 800,
            fontFamily: 'var(--cms-font-mono)'
          }}>
            MK
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cms-text-heading)', lineHeight: 1.2 }}>
              {user?.name || 'MadhanKR'}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--cms-text-muted)', fontWeight: 500 }}>
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
            border: '1px solid var(--cms-border)',
            padding: '7px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--cms-danger)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
            fontFamily: 'var(--cms-font)'
          }}
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
