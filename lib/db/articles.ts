import { Article } from '../types';
import { INITIAL_ARTICLES } from './seedData';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client';
import { slugify } from '../utils/slugify';

const LOCAL_STORAGE_ARTICLES_KEY = 'madhankr_cms_articles_v2';

/**
 * Normalizes any database row, local-storage object, or partial Article
 * into a fully populated, type-safe Article model.
 *
 * Maps:
 * - row.category_slug ↔ categorySlug (and keeps category_slug populated)
 * - row.read_time ↔ readTime (and keeps read_time populated)
 * - row.cover_image ↔ cover_image (trimmed string or undefined)
 */

export function mapDbRowToArticle(row: any): Article {
  if (!row) {
    throw new Error('Cannot map null or undefined row to Article');
  }

  const category = String(row.category || 'Design');
  const categorySlug = String(row.category_slug || row.categorySlug || slugify(category));
  const readTime = String(row.read_time || row.readTime || '4 min read');

  let coverImage: string | undefined = undefined;
  if (typeof row.cover_image === 'string' && row.cover_image.trim()) {
    coverImage = row.cover_image.trim();
  }

  const validStatus: 'draft' | 'published' | 'archived' =
    row.status === 'published' || row.status === 'archived' || row.status === 'draft'
      ? row.status
      : 'draft';

  const validMotif: 'sq' | 'semi' | 'circ' =
    row.motif === 'circ' || row.motif === 'semi' || row.motif === 'sq'
      ? row.motif
      : 'sq';

  return {
    id: String(row.id || slugify(row.title || 'untitled-note')),
    slug: String(row.slug || slugify(row.title || 'untitled-note')),
    title: String(row.title || 'Untitled Article'),
    summary: String(row.summary || ''),
    content: String(row.content || ''),
    category,
    categorySlug,
    category_slug: categorySlug,
    readTime,
    read_time: readTime,
    status: validStatus,
    featured: Boolean(row.featured),
    motif: validMotif,
    tags: Array.isArray(row.tags) ? row.tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
    cover_image: coverImage,
    views: typeof row.views === 'number' && !isNaN(row.views) ? row.views : 0,
    likes: typeof row.likes === 'number' && !isNaN(row.likes) ? row.likes : 0,
    published_at: row.published_at || undefined,
    created_at: row.created_at || undefined,
    updated_at: row.updated_at || undefined,
  };
}

/**
 * Transforms an application Article instance into a snake_case database
 * payload matching the Supabase PostgreSQL table definition.
 *
 * Strips camelCase properties (categorySlug, readTime) so Postgres does not
 * throw column-not-found errors during upserts.
 */

export function mapArticleToDbPayload(article: Article): Record<string, any> {
  const normalized = mapDbRowToArticle(article);

  const payload: Record<string, any> = {
    id: normalized.id,
    slug: normalized.slug,
    title: normalized.title,
    summary: normalized.summary,
    content: normalized.content,
    category: normalized.category,
    category_slug: normalized.categorySlug,
    read_time: normalized.readTime,
    status: normalized.status,
    featured: normalized.featured,
    motif: normalized.motif,
    tags: normalized.tags,
    views: normalized.views,
    likes: normalized.likes,
    published_at: normalized.published_at || null,
    updated_at: new Date().toISOString(),
  };

  if (normalized.cover_image !== undefined) {
    payload.cover_image = normalized.cover_image || null;
  }

  return payload;
}

export function getLocalArticles(): Article[] {
  if (typeof window === 'undefined') {
    return INITIAL_ARTICLES.map(mapDbRowToArticle);
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ARTICLES_KEY);
    if (!raw) {
      const seeded = INITIAL_ARTICLES.map(mapDbRowToArticle);
      localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Purge any stale Unsplash mock images that were not selected by the user
      const cleaned = parsed.map((item) => {
        if (typeof item.cover_image === 'string' && item.cover_image.includes('images.unsplash.com')) {
          delete item.cover_image;
        }
        return mapDbRowToArticle(item);
      });
      return cleaned;
    }
    return INITIAL_ARTICLES.map(mapDbRowToArticle);
  } catch {
    return INITIAL_ARTICLES.map(mapDbRowToArticle);
  }
}

export function saveLocalArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    const normalized = articles.map(mapDbRowToArticle);
    localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export async function getAllArticles(): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    if (typeof window !== 'undefined') {
      const client = getSupabaseBrowserClient();
      if (client) {
        const { data, error } = await client
          .from('articles')
          .select('*')
          .order('published_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(mapDbRowToArticle);
        }
      }
    } else {
      // Server-side query directly from Supabase REST endpoint
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (url && key) {
          const res = await fetch(`${url}/rest/v1/articles?select=*&order=published_at.desc`, {
            headers: {
              'apikey': key,
              'Authorization': `Bearer ${key}`
            },
            next: { revalidate: 60 }
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              return data.map(mapDbRowToArticle);
            }
          }
        }
      } catch (err) {
        console.warn('[Articles DB] Server fetch fallback:', err);
      }
    }
  }

  return getLocalArticles();
}

export async function getPublishedArticles(): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.status === 'published');
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const all = await getAllArticles();
  return all.find((a) => a.slug === slug) || null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const all = await getAllArticles();
  return all.find((a) => a.id === id) || null;
}

export async function saveArticle(article: Article): Promise<{ success: boolean; data?: Article; error?: string }> {
  const normalized = mapDbRowToArticle(article);

  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'Unauthorized: Admin authentication session is required.' };
      }

      const payload = mapArticleToDbPayload(normalized);

      let { data, error } = await client
        .from('articles')
        .upsert(payload)
        .select()
        .single();

      // Graceful fallback if the remote Supabase database has not had the cover_image column added yet
      if (error && (error.code === '42703' || error.message?.includes('cover_image'))) {
        console.warn('[Supabase Articles] Retrying upsert without cover_image (column not in remote schema):', error.message);
        const fallbackPayload = { ...payload };
        delete fallbackPayload.cover_image;
        const retryResult = await client
          .from('articles')
          .upsert(fallbackPayload)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (error) {
        return { success: false, error: error.message };
      }

      // Synchronize local cache with newly saved data
      const mappedResult = mapDbRowToArticle({
        ...data,
        cover_image: normalized.cover_image || data?.cover_image
      });
      const all = getLocalArticles();
      const existingIdx = all.findIndex((a) => a.id === mappedResult.id);
      if (existingIdx >= 0) {
        all[existingIdx] = mappedResult;
      } else {
        all.unshift(mappedResult);
      }
      saveLocalArticles(all);

      return { success: true, data: mappedResult };
    }
  }

  // Fallback for local preview / offline demo
  const all = getLocalArticles();
  const existingIdx = all.findIndex((a) => a.id === normalized.id);
  if (existingIdx >= 0) {
    all[existingIdx] = { ...normalized, updated_at: new Date().toISOString() };
  } else {
    all.unshift({ ...normalized, updated_at: new Date().toISOString() });
  }
  saveLocalArticles(all);
  return { success: true, data: normalized };
}

export async function deleteArticle(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        console.error('Unauthorized: Admin authentication required.');
        return false;
      }

      const { error } = await client.from('articles').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete error:', error);
        return false;
      }

      const all = getLocalArticles().filter((a) => a.id !== id);
      saveLocalArticles(all);
      return true;
    }
  }

  const all = getLocalArticles().filter((a) => a.id !== id);
  saveLocalArticles(all);
  return true;
}
