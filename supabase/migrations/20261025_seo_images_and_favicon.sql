-- ══════════════════════════════════════════════════════════════════
-- MIGRATION: Add Featured Image to SEO Settings & Favicon to Site Settings
-- ══════════════════════════════════════════════════════════════════

-- 1. Add featured_image to seo_settings table
ALTER TABLE public.seo_settings
  ADD COLUMN IF NOT EXISTS featured_image TEXT;

COMMENT ON COLUMN public.seo_settings.featured_image IS 'Optional page-level hero or featured banner image separate from social og_image.';

-- 2. Add favicon_url to site_settings table
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT '/favicon.ico';

COMMENT ON COLUMN public.site_settings.favicon_url IS 'Custom website favicon URL (.ico, .png, .svg, .webp). Falls back to /favicon.ico.';
