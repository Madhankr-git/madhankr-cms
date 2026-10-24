'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/cms-admin.css';
import { AdminAuthProvider, useAdminAuth } from '@/components/admin/AdminAuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fa', fontFamily: 'var(--cms-font)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Authenticating CMS Studio...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-app" style={{ display: 'flex', minHeight: '100vh', background: 'var(--cms-canvas)', fontFamily: 'var(--cms-font)' }}>
      <AdminSidebar />
      <div className="admin-main-wrapper">
        <AdminTopbar />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
