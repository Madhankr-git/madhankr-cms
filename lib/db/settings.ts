import { SiteSettings, SeoSettingsMap, ActivityItem } from '../types';
import { INITIAL_SITE_SETTINGS, INITIAL_SEO_SETTINGS, INITIAL_ACTIVITIES } from './seedData';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client';

const LOCAL_STORAGE_SETTINGS_KEY = 'madhankr_cms_site_settings_v2';
const LOCAL_STORAGE_SEO_KEY = 'madhankr_cms_seo_settings_v2';
const LOCAL_STORAGE_ACTIVITIES_KEY = 'madhankr_cms_activities_v2';

export function getLocalSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return INITIAL_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SITE_SETTINGS;
  } catch {
    return INITIAL_SITE_SETTINGS;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data } = await client.from('site_settings').select('*').eq('id', 1).single();
      if (data) {
        return {
          id: data.id,
          siteName: data.site_name,
          siteTagline: data.site_tagline,
          author: data.author,
          bio: data.bio,
          contactEmail: data.contact_email,
          primaryAccent: data.primary_accent,
          maintenanceMode: data.maintenance_mode,
          allowComments: data.allow_comments,
          socialLinks: data.social_links,
          navItems: data.nav_items,
        };
      }
    }
  }
  return getLocalSiteSettings();
}

export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        console.error('Unauthorized: Admin authentication session is required.');
        return false;
      }

      const { error } = await client.from('site_settings').upsert({
        id: 1,
        site_name: settings.siteName,
        site_tagline: settings.siteTagline,
        author: settings.author,
        bio: settings.bio,
        contact_email: settings.contactEmail,
        primary_accent: settings.primaryAccent,
        maintenance_mode: settings.maintenanceMode,
        allow_comments: settings.allowComments,
        social_links: settings.socialLinks,
        nav_items: settings.navItems,
        updated_at: new Date().toISOString()
      });
      if (error) return false;
      return true;
    }
  }

  return false;
}

export function getLocalSeoSettings(): SeoSettingsMap {
  if (typeof window === 'undefined') return INITIAL_SEO_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SEO_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SEO_SETTINGS;
  } catch {
    return INITIAL_SEO_SETTINGS;
  }
}

export async function getSeoSettings(): Promise<SeoSettingsMap> {
  return getLocalSeoSettings();
}

export async function saveSeoSettings(seo: SeoSettingsMap): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        console.error('Unauthorized: Admin authentication session is required.');
        return false;
      }

      const entries = Object.entries(seo);
      for (const [pageKey, pageSeo] of entries) {
        await client.from('seo_settings').upsert({
          page_key: pageKey,
          title: pageSeo.title,
          description: pageSeo.description,
          canonical: pageSeo.canonical,
          keywords: pageSeo.keywords,
          og_type: pageSeo.ogType,
          og_image: pageSeo.ogImage,
          twitter_card: pageSeo.twitterCard,
          index_robots: pageSeo.indexRobots,
          follow_robots: pageSeo.followRobots,
          updated_at: new Date().toISOString()
        });
      }
      return true;
    }
  }

  return false;
}

export function getActivities(): ActivityItem[] {
  if (typeof window === 'undefined') return INITIAL_ACTIVITIES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACTIVITIES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ACTIVITIES;
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function logActivity(item: Omit<ActivityItem, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const current = getActivities();
  const newItem: ActivityItem = {
    ...item,
    id: 'act-' + Date.now(),
    timestamp: 'Just now'
  };
  localStorage.setItem(LOCAL_STORAGE_ACTIVITIES_KEY, JSON.stringify([newItem, ...current.slice(0, 19)]));
}
