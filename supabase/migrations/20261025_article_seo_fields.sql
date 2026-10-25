-- ══════════════════════════════════════════════════════════════════
-- MIGRATION: Add SEO Metadata Fields to Articles Table
-- Adds optional custom seo_title, meta_description, and canonical_url
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS canonical_url TEXT;

COMMENT ON COLUMN public.articles.seo_title IS 'Optional custom title tag for search results and social cards. Falls back to article title.';
COMMENT ON COLUMN public.articles.meta_description IS 'Optional custom meta description for search engines and social cards. Falls back to article summary.';
COMMENT ON COLUMN public.articles.canonical_url IS 'Optional manual canonical URL override. When NULL or empty, the article defaults to self-canonical.';
