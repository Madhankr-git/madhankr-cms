import { Project } from '../types';
import { INITIAL_PROJECTS } from './seedData';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client';

const LOCAL_STORAGE_PROJECTS_KEY = 'madhankr_cms_projects_v2';

export function getLocalProjects(): Project[] {
  if (typeof window === 'undefined') {
    return INITIAL_PROJECTS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveLocalProjects(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage', err);
  }
}

export async function getAllProjects(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data, error } = await client
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });
      if (!error && data) {
        return data as Project[];
      }
    }
  }
  return getLocalProjects();
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) || null;
}

export async function saveProject(project: Project): Promise<{ success: boolean; data?: Project; error?: string }> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'Unauthorized: Admin authentication session is required.' };
      }

      const { data, error } = await client
        .from('projects')
        .upsert({
          ...project,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data: data as Project };
    }
  }

  return { success: false, error: 'Database is not configured or authenticated.' };
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        console.error('Unauthorized: Admin authentication required.');
        return false;
      }

      const { error } = await client.from('projects').delete().eq('id', id);
      if (error) {
        console.error('Supabase project delete error:', error);
        return false;
      }
      return true;
    }
  }

  return false;
}
