// ══════════════════════════════════════════════════════════════════
// MADHANKR CMS V2 — CORE TYPESCRIPT DEFINITIONS
// ══════════════════════════════════════════════════════════════════

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  categorySlug: string;
  readTime: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  motif: 'sq' | 'semi' | 'circ';
  tags: string[];
  views: number;
  likes: number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface CaseStudyData {
  challenge: string;
  solution: string;
  techStack: string[];
  metrics: MetricItem[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tag: string;
  category: string;
  categorySlug: string;
  year: string;
  client: string;
  role: string;
  motif: 'motif-square' | 'motif-semi' | 'motif-circle';
  featured: boolean;
  summary: string;
  caseStudy: CaseStudyData;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  category: string;
  file_path: string;
  public_url: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string;
}

export interface PageSeoConfig {
  title: string;
  description: string;
  canonical: string;
  keywords: string;
  ogType: string;
  ogImage: string;
  twitterCard: string;
  index: boolean;
  follow: boolean;
}

export interface SeoSettingsMap {
  homepage: PageSeoConfig;
  journal: PageSeoConfig;
  work: PageSeoConfig;
  gallery: PageSeoConfig;
  about: PageSeoConfig;
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
  visible: boolean;
}

export interface SocialLinks {
  linkedin: string;
  portfolio: string;
  github: string;
  twitter: string;
}

export interface SiteSettings {
  id?: number;
  siteName: string;
  siteTagline: string;
  author: string;
  bio: string;
  contactEmail: string;
  primaryAccent: string;
  maintenanceMode: boolean;
  allowComments: boolean;
  socialLinks: SocialLinks;
  navItems: NavItem[];
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor';
  avatarUrl?: string;
}

export interface ActivityItem {
  id: string;
  type: 'article_published' | 'article_saved' | 'project_updated' | 'media_uploaded' | 'seo_updated';
  title: string;
  detail: string;
  timestamp: string;
}
