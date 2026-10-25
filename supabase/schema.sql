-- ══════════════════════════════════════════════════════════════════
-- MADHANKR CMS V2 — SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- ══════════════════════════════════════════════════════════════════

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Admin & Editor Role Directory)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT DEFAULT 'MadhanKR',
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile Auto-Provisioning Trigger for Supabase Auth
-- Automatically creates a public.profiles entry when a user is added to auth.users.
-- Default role is strictly 'editor' (non-admin).
-- 'admin' role is only granted if explicitly set in raw_app_meta_data (service_role or dashboard).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.raw_app_meta_data->>'role' = 'admin' THEN 'admin'
      ELSE 'editor'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. ARTICLES (Journal Posts & Essays)
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  read_time TEXT DEFAULT '5 min read',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  motif TEXT DEFAULT 'sq' CHECK (motif IN ('sq', 'semi', 'circ')),
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  seo_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS (Portfolio Case Studies & Experiments)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tag TEXT NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  year TEXT DEFAULT '2026',
  client TEXT NOT NULL,
  role TEXT NOT NULL,
  motif TEXT DEFAULT 'motif-square',
  featured BOOLEAN DEFAULT FALSE,
  summary TEXT NOT NULL,
  case_study JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEDIA ASSETS (Images, Badges, SVGs, Attachments)
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Brand Assets',
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  mime_type TEXT DEFAULT 'image/png',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SEO SETTINGS (Per-Page Metadata & OpenGraph)
CREATE TABLE IF NOT EXISTS public.seo_settings (
  page_key TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  canonical TEXT NOT NULL,
  keywords TEXT NOT NULL,
  og_type TEXT DEFAULT 'website',
  og_image TEXT,
  featured_image TEXT,
  twitter_card TEXT DEFAULT 'summary_large_image',
  index_robots BOOLEAN DEFAULT TRUE,
  follow_robots BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS (Brand, Identity, Accent & Socials)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'MADHANKR',
  site_tagline TEXT DEFAULT 'Digital Designer × Creative Developer',
  author TEXT DEFAULT 'MadhanKR',
  bio TEXT,
  contact_email TEXT DEFAULT 'madhankumarrajagopal@gmail.com',
  primary_accent TEXT DEFAULT '#2563eb',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  allow_comments BOOLEAN DEFAULT TRUE,
  favicon_url TEXT DEFAULT '/favicon.ico',
  social_links JSONB DEFAULT '{}'::jsonb,
  nav_items JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read own profile; Admin can read and update all
CREATE POLICY "Public profiles are readable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Articles: Public can read published articles; Admins have full access
CREATE POLICY "Public read published articles" ON public.articles
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admin full access to articles" ON public.articles
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Projects: Public can read all projects; Admins have full access
CREATE POLICY "Public read projects" ON public.projects
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin full access to projects" ON public.projects
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Media Assets: Public can read media; Admins have full access
CREATE POLICY "Public read media assets" ON public.media_assets
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin full access to media assets" ON public.media_assets
  FOR ALL TO authenticated
  USING (public.is_admin());

-- SEO Settings: Public can read; Admins can update
CREATE POLICY "Public read seo settings" ON public.seo_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin full access to seo settings" ON public.seo_settings
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Site Settings: Public can read; Admins can update
CREATE POLICY "Public read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin full access to site settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════════
-- STORAGE BUCKET CONFIGURATION (cms-media)
-- ══════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-media', 'cms-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access cms-media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'cms-media');

CREATE POLICY "Admin Upload cms-media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-media' AND public.is_admin());

CREATE POLICY "Admin Update cms-media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-media' AND public.is_admin());

CREATE POLICY "Admin Delete cms-media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cms-media' AND public.is_admin());
