import { MediaAsset } from '../types';
import { INITIAL_MEDIA_ASSETS } from './seedData';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client';
import { slugify } from '../utils/slugify';

const LOCAL_STORAGE_MEDIA_KEY = 'madhankr_cms_media_v2';

/**
 * Generates a clean, collision-safe filename preserving the original extension.
 * Target format: madhankr/filename.ext
 * Example: madhankr/ai-bg-abstract.webp
 */
export function generateSafeFileName(originalName: string, suffix?: string): { fileName: string; filePath: string } {
  const lastDot = originalName.lastIndexOf('.');
  const rawExt = lastDot !== -1 ? originalName.substring(lastDot) : '';
  const ext = rawExt.toLowerCase();
  const rawBase = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
  const cleanBase = slugify(rawBase.replace(/\./g, '-')) || 'asset';

  const fileName = suffix ? `${cleanBase}-${suffix}${ext}` : `${cleanBase}${ext}`;
  const filePath = `madhankr/${fileName}`;
  return { fileName, filePath };
}

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

      // Generate object path: madhankr/filename.ext
      let { fileName, filePath } = generateSafeFileName(file.name);

      // Attempt upload without overwrite to detect potential collisions
      let { error: uploadError } = await client.storage
        .from('cms-media')
        .upload(filePath, file, { upsert: false });

      // If collision occurs (resource already exists), append a short collision-safe suffix
      if (
        uploadError &&
        (uploadError.message?.toLowerCase().includes('already exists') ||
          (uploadError as any).statusCode === '409' ||
          uploadError.message?.includes('Duplicate'))
      ) {
        const collisionSuffix = Date.now().toString(36);
        const resolved = generateSafeFileName(file.name, collisionSuffix);
        fileName = resolved.fileName;
        filePath = resolved.filePath;

        const retry = await client.storage
          .from('cms-media')
          .upload(filePath, file, { upsert: false });
        uploadError = retry.error;
      }

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

  // Fallback for local preview / offline demo
  const { fileName, filePath } = generateSafeFileName(file.name);
  const localAsset: MediaAsset = {
    id: `local-${Date.now()}`,
    name: file.name,
    category,
    file_path: filePath,
    public_url: typeof window !== 'undefined' ? URL.createObjectURL(file) : `/assets/${fileName}`,
    file_size: file.size,
    mime_type: file.type,
    created_at: new Date().toISOString()
  };
  const current = getLocalMedia();
  saveLocalMedia([localAsset, ...current]);
  return { success: true, asset: localAsset };
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
