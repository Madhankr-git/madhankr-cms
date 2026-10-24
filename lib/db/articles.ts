import { Article } from '../types';
import { INITIAL_ARTICLES } from './seedData';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client';

const LOCAL_STORAGE_ARTICLES_KEY = 'madhankr_cms_articles_v2';

export function getLocalArticles(): Article[] {
  if (typeof window === 'undefined') {
    return INITIAL_ARTICLES;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ARTICLES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function saveLocalArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(articles));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export async function getAllArticles(): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data, error } = await client
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });
      if (!error && data) {
        return data as Article[];
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
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'Unauthorized: Admin authentication session is required.' };
      }

      const { data, error } = await client
        .from('articles')
        .upsert({
          ...article,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data: data as Article };
    }
  }

  return { success: false, error: 'Database is not configured or authenticated.' };
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
      return true;
    }
  }

  return false;
}
