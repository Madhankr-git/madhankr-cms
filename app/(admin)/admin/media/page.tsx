'use client';

import React, { useState, useEffect } from 'react';
import { getMediaAssets, uploadMedia, deleteMedia } from '@/lib/db/media';
import { MediaAsset } from '@/lib/types';
import { UploadCloud, Image as ImageIcon, Plus, Check, Copy, Trash2, Folder } from 'lucide-react';

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    const list = await getMediaAssets();
    setAssets(list);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      await uploadMedia(files[i]);
    }
    setUploading(false);
    loadMedia();
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(asset.public_url);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this media asset?')) {
      await deleteMedia(id);
      loadMedia();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'var(--cms-font)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Media Library
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b' }}>
            Manage assets stored in Supabase Storage <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--cms-font-mono)' }}>cms-media</code> bucket
          </p>
        </div>

        <label style={{
          background: '#2563eb',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Plus size={15} />
          <span>{uploading ? 'Uploading...' : 'Upload Asset'}</span>
          <input
            type="file"
            multiple
            accept="image/*,.svg"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Dropzone Area */}
      <div style={{
        background: '#ffffff',
        border: '2px dashed #cbd5e1',
        borderRadius: '12px',
        padding: '36px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <UploadCloud size={40} style={{ color: '#2563eb', marginBottom: '12px' }} />
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
          Drag &amp; drop files here, or click to upload
        </div>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          Supports PNG, JPG, WebP, SVG vectors up to 25MB each.
        </p>
        <label style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          background: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer'
        }}>
          <Folder size={14} />
          <span>Browse Local Files</span>
          <input
            type="file"
            multiple
            accept="image/*,.svg"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Asset Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {assets.map((asset) => (
          <div
            key={asset.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              height: '140px',
              background: '#f8fafc',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}>
              <ImageIcon size={36} style={{ strokeWidth: 1.5 }} />
            </div>
            <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                  {asset.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {asset.category} · {(asset.file_size ? Math.round(asset.file_size / 1024) : 14)} KB
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(asset)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: copiedId === asset.id ? '#dcfce7' : '#ffffff',
                    color: copiedId === asset.id ? '#166534' : '#0f172a',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check size={12} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(asset.id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #fecaca',
                    background: '#fef2f2',
                    color: '#ef4444',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Delete asset"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
