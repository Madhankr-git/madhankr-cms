import type { Metadata } from 'next';
import { Article } from '@/lib/types';

/**
 * ══════════════════════════════════════════════════════════════════
 * CENTRALIZED SITE DOMAIN & SEO CONFIGURATION ENGINE
 * 
 * Provides unified, single-source-of-truth helpers for:
 * 1. Base URL normalization (prepares for future custom domain).
 * 2. Article public URL generation (/article/:slug).
 * 3. Canonical URL resolution (automatic self-canonical with manual override).
 * 4. OpenGraph & Twitter social metadata generation using article thumbnail.
 * 5. Structured Data (JSON-LD schema.org BlogPosting) serialization.
 * ══════════════════════════════════════════════════════════════════
 */

const DEFAULT_FALLBACK_IMAGE = '/assets/og-journal.svg';
const DEFAULT_AUTHOR_NAME = 'MadhanKR';

/**
 * Normalizes a URL string by trimming trailing slashes and ensuring standard protocol.
 */
export function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Checks if a URL string is an outdated legacy universal fallback that should not override dynamic resolution.
 */
function isLegacyHardcodedDomain(url: string): boolean {
  const lower = url.toLowerCase().trim();
  return (
    lower.includes('madhankumarrajagopal.netlify.app') ||
    lower === 'https://your-site.netlify.app' ||
    lower === 'https://yourdomain.com'
  );
}

/**
 * Returns the normalized site base URL dynamically without hardcoding any Netlify domain:
 * 
 * 1. Explicitly configured canonical base URL via project configuration:
 *    - process.env.NEXT_PUBLIC_SITE_URL or process.env.SITE_URL
 *    (Respected when set to an intentional custom domain or local development URL)
 * 
 * 2. On Netlify, the platform-provided primary site URL:
 *    - process.env.URL (automatically set by Netlify build and server functions, e.g. https://madhankr.netlify.app)
 *    - process.env.NEXT_PUBLIC_NETLIFY_URL (forwarded to client bundle via next.config.mjs)
 *    - process.env.DEPLOY_PRIME_URL
 * 
 * 3. Client-side browser runtime:
 *    - window.location.origin (dynamically matches whatever active domain/port the CMS is opened on)
 * 
 * 4. Local development / server fallback:
 *    - http://localhost:3000 (or http://localhost:${process.env.PORT || 3000})
 */
export function getSiteBaseUrl(): string {
  // 1. Explicit project configuration override (if intentionally provided)
  const explicit = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '').trim();
  if (explicit && !isLegacyHardcodedDomain(explicit)) {
    return normalizeBaseUrl(explicit);
  }

  // 2. Netlify platform-provided primary production site URL
  const netlifyUrl = (
    process.env.URL ||
    process.env.NEXT_PUBLIC_NETLIFY_URL ||
    process.env.DEPLOY_PRIME_URL ||
    ''
  ).trim();
  if (netlifyUrl && !isLegacyHardcodedDomain(netlifyUrl)) {
    return normalizeBaseUrl(netlifyUrl);
  }

  // 3. Client-side dynamic resolution (browser environment)
  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalizeBaseUrl(window.location.origin);
  }

  // 4. Local development & server fallback
  const port = process.env.PORT || '3000';
  return `http://localhost:${port}`;
}

/**
 * Returns the canonical public URL for an article.
 * Dynamically combines the resolved base URL with /article/:slug.
 * Defaults empty slugs to 'untitled'.
 */
export function getArticlePublicUrl(slug?: string | null): string {
  const baseUrl = getSiteBaseUrl();
  const rawSlug = (slug || 'untitled').trim().replace(/^\/+/, '');
  const cleanSlug = encodeURIComponent(rawSlug).replace(/%2F/gi, '/');
  return `${baseUrl}/article/${cleanSlug}`;
}

/**
 * Resolves the canonical URL for an article:
 * - If a manual override is saved and valid, returns that override directly.
 * - Otherwise, automatically defaults to the article's own public URL (self-canonical).
 */
export function resolveArticleCanonicalUrl(article: { slug: string; canonical_url?: string | null }): string {
  if (article.canonical_url && article.canonical_url.trim()) {
    return article.canonical_url.trim();
  }
  return getArticlePublicUrl(article.slug);
}

/**
 * Converts any image path (relative or absolute) to a fully qualified,
 * absolute public URL suitable for Open Graph, Twitter cards, and Schema.org.
 */
export function toAbsoluteImageUrl(imagePath?: string | null): string {
  if (!imagePath || !imagePath.trim()) {
    const baseUrl = getSiteBaseUrl();
    return `${baseUrl}${DEFAULT_FALLBACK_IMAGE}`;
  }

  const trimmed = imagePath.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const baseUrl = getSiteBaseUrl();
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Validates whether a custom string is a well-formed absolute URL.
 * Used for canonical override validation in the editor.
 */
export function isValidAbsoluteUrl(val: string): boolean {
  if (!val || !val.trim()) return false;
  try {
    const parsed = new URL(val.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Builds standard Next.js Metadata for an Article detail page.
 * Renders in initial server-side HTML response.
 */
export function buildArticleMetadata(article: Article): Metadata {
  const title = (article.seo_title && article.seo_title.trim())
    ? article.seo_title.trim()
    : `${article.title} — MadhanKR`;

  const description = (article.meta_description && article.meta_description.trim())
    ? article.meta_description.trim()
    : (article.summary || 'Article by MadhanKR.');

  const canonicalUrl = resolveArticleCanonicalUrl(article);
  const publicArticleUrl = getArticlePublicUrl(article.slug);
  const socialImage = toAbsoluteImageUrl(article.og_image || article.cover_image);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: publicArticleUrl, // Actual public URL for OG
      publishedTime: article.published_at || article.created_at,
      modifiedTime: article.updated_at || article.published_at || article.created_at,
      tags: article.tags,
      images: [
        {
          url: socialImage,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  };
}

/**
 * Builds standard Next.js Metadata for public pages (homepage, work, articles, gallery, about)
 * using the configured SEO Suite settings.
 */
export async function buildPageMetadata(pageKey: 'homepage' | 'journal' | 'work' | 'gallery' | 'about'): Promise<Metadata> {
  const { getSeoSettings } = await import('@/lib/db/settings');
  const seoMap = await getSeoSettings();
  const pageSeo = seoMap[pageKey] || seoMap.homepage;
  const baseUrl = getSiteBaseUrl();
  const canonicalUrl = pageSeo.canonical?.startsWith('http')
    ? pageSeo.canonical
    : `${baseUrl}${pageSeo.canonical?.startsWith('/') ? pageSeo.canonical : `/${pageSeo.canonical || ''}`}`;
  const socialImage = toAbsoluteImageUrl(pageSeo.ogImage);

  return {
    title: pageSeo.title,
    description: pageSeo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageSeo.title,
      description: pageSeo.description,
      url: canonicalUrl,
      type: pageSeo.ogType === 'blog' ? 'article' : 'website',
      images: [
        {
          url: socialImage,
          alt: pageSeo.title,
        },
      ],
    },
    twitter: {
      card: (pageSeo.twitterCard as any) || 'summary_large_image',
      title: pageSeo.title,
      description: pageSeo.description,
      images: [socialImage],
    },
    robots: {
      index: pageSeo.index !== false,
      follow: pageSeo.follow !== false,
    },
  };
}

/**
 * Generates Schema.org BlogPosting JSON-LD object for published articles.
 * Safely serialized and rendered in server HTML.
 */
export function generateArticleJsonLd(article: Article, authorName = DEFAULT_AUTHOR_NAME): Record<string, any> | null {
  // Guard against unpublished / private articles in public schema
  if (article.status !== 'published') {
    return null;
  }

  const baseUrl = getSiteBaseUrl();
  const canonicalUrl = resolveArticleCanonicalUrl(article);
  const headline = (article.seo_title && article.seo_title.trim())
    ? article.seo_title.trim()
    : article.title;

  const description = (article.meta_description && article.meta_description.trim())
    ? article.meta_description.trim()
    : (article.summary || headline);

  const image = toAbsoluteImageUrl(article.cover_image);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    image: [image],
    datePublished: article.published_at || article.created_at || new Date().toISOString(),
    dateModified: article.updated_at || article.published_at || article.created_at || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Person',
      name: authorName,
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    url: canonicalUrl,
    keywords: Array.isArray(article.tags) ? article.tags.join(', ') : undefined,
    articleSection: article.category || 'Design',
  };
}
