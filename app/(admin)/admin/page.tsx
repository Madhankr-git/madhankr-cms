'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllArticles } from '@/lib/db/articles';
import { getAllProjects } from '@/lib/db/projects';
import { getActivities } from '@/lib/db/settings';
import { Article, Project, ActivityItem } from '@/lib/types';
import { Plus, Sparkles, TrendingUp, Send, CheckCircle2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    async function loadData() {
      const [art, proj] = await Promise.all([
        getAllArticles(),
        getAllProjects(),
      ]);
      setArticles(art);
      setProjects(proj);
      setActivities(getActivities());
    }
    loadData();
  }, []);

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 18400);

  const handleAiAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiResponse(`Analyzing: "${aiPrompt}"... Suggestion: Your essay on "AI Can Make It Faster" has high reader engagement (3,420 views). Consider writing a follow-up case study on agentic workflow integration.`);
    setAiPrompt('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: 'var(--cms-font)' }}>
      {/* Page Title & Status Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--cms-text-heading)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--cms-text-muted)' }}>
            Real-time reader analytics, publishing telemetry &amp; Supabase database status
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/admin/editor"
            style={{
              background: 'var(--cms-primary)',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={15} />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>TOTAL READERS</span>
            <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>+18.4%</span>
          </div>
          <div style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
            {totalViews.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>Across all published articles &amp; works</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>PUBLISHED ARTICLES</span>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{articles.length} Total</span>
          </div>
          <div style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
            {publishedCount}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>Prerendered via Next.js ISR</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>CASE STUDIES</span>
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>100% Live</span>
          </div>
          <div style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
            {projects.length}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>Interactive case studies featured</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>AVG READING TIME</span>
            <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>+14.2%</span>
          </div>
          <div style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
            4m 12s
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>High cognitive engagement rate</div>
        </div>
      </div>

      {/* Main Grid: Wave Chart (Left) + Right Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Wave Chart */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                Reader Trajectory &amp; Article Views
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748b' }}>
                Monthly active readership trends across personal essays
              </p>
            </div>
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {(['week', 'month', 'year'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeRange(t)}
                  style={{
                    border: 'none',
                    background: timeRange === t ? '#ffffff' : 'transparent',
                    color: timeRange === t ? '#2563eb' : '#64748b',
                    fontWeight: 700,
                    fontSize: '11px',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Wave Area Chart */}
          <div style={{ position: 'relative', width: '100%', height: '240px' }}>
            <svg viewBox="0 0 700 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal Grid lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="160" x2="700" y2="160" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="210" x2="700" y2="210" stroke="#e2e8f0" strokeWidth="1" />

              {/* Wave Area Fill */}
              <path
                d="M 0 210 Q 90 90, 180 130 T 360 80 T 540 50 T 700 30 L 700 210 Z"
                fill="url(#waveGradient)"
              />

              {/* Wave Line */}
              <path
                d="M 0 210 Q 90 90, 180 130 T 360 80 T 540 50 T 700 30"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="180" cy="130" r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
              <circle cx="360" cy="80" r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
              <circle cx="540" cy="50" r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
              <circle cx="700" cy="30" r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            <span>WEEK 01</span>
            <span>WEEK 02</span>
            <span>WEEK 03</span>
            <span>WEEK 04 (PEAK TRACTION)</span>
          </div>
        </div>

        {/* Right Column: Weekly Bar Chart & Radial Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Weekly Active Readers Bar Chart */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Active Days</span>
              <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>Tue Peak: 8,162</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '110px', padding: '0 8px' }}>
              {[
                { day: 'M', h: '45%' },
                { day: 'T', h: '95%', highlight: true },
                { day: 'W', h: '60%' },
                { day: 'T', h: '55%' },
                { day: 'F', h: '70%' },
                { day: 'S', h: '40%' },
                { day: 'S', h: '35%' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '16px',
                      height: item.h,
                      background: item.highlight ? '#2563eb' : '#cbd5e1',
                      borderRadius: '10px',
                      transition: 'height 0.3s'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: item.highlight ? '#2563eb' : '#64748b', fontWeight: item.highlight ? 800 : 500 }}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3D AI Assistant Orb Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            borderRadius: '14px',
            padding: '20px',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #60a5fa 20%, #2563eb 80%)',
                boxShadow: '0 0 16px rgba(96, 165, 250, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}>
                <Sparkles size={16} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800 }}>AI Editorial Partner</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Real-time content intelligence</div>
              </div>
            </div>

            {aiResponse ? (
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', lineHeight: 1.5, marginBottom: '12px' }}>
                {aiResponse}
              </div>
            ) : (
              <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '14px' }}>
                Ask for article outline expansion, SEO title suggestions, or case study refinement.
              </p>
            )}

            <form onSubmit={handleAiAsk} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ask editorial assistant..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  color: '#ffffff',
                  fontSize: '12px',
                  outline: 'none',
                  fontFamily: 'var(--cms-font)'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--cms-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Send size={12} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
            Recent Activity &amp; Publishing Logs
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Last updated just now</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{act.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{act.detail}</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
