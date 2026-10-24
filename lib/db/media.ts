import { MediaAsset } from '../types';
import { INITIAL_MEDIA_ASSETS } from './seedData';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client';

const LOCAL_STORAGE_MEDIA_KEY = 'madhankr_cms_media_v2';

export function getLocalMedia(): MediaAsset[] {
  if (typeof window === 'undefined') return INITIAL_MEDIA_ASSETS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEDIA_KEY);
    return raw ? JSON.parse(raw) : INITIAL_MEDIA_ASSETS;
  } catch {
    return INITIAL_MEDIA_ASSETS;
  }
}

export function saveLocalMedia(media: MediaAsset[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(media));
  } catch (err) {
    console.error('Failed to save media locally', err);
  }
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data, error } = await client.from('media_assets').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data as MediaAsset[];
      }
    }
  }
  return getLocalMedia();
}

export async function uploadMedia(file: File, category = 'Uploads'): Promise<{ success: boolean; asset?: MediaAsset; error?: string }> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'Unauthorized: Admin authentication session is required.' };
      }

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = `uploads/${fileName}`;
      const { error: uploadError } = await client.storage.from('cms-media').upload(filePath, file);
      if (uploadError) {
        return { success: false, error: uploadError.message };
      }
      const { data: publicUrlData } = client.storage.from('cms-media').getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      const { data: record, error: recordError } = await client
        .from('media_assets')
        .insert({
          name: file.name,
          category,
          file_path: filePath,
          public_url: publicUrl,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single();

      if (recordError) {
        return { success: false, error: recordError.message };
      }
      return { success: true, asset: record as MediaAsset };
    }
  }

  return { success: false, error: 'Database is not configured or authenticated.' };
}

export async function deleteMedia(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        console.error('Unauthorized: Admin authentication required.');
        return false;
      }

      const { error } = await client.from('media_assets').delete().eq('id', id);
      if (error) {
        console.error('Supabase media delete error:', error);
        return false;
      }
      return true;
    }
  }

  return false;
}
