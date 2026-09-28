import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase (if provided)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co') {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('[Bharat Culture Atlas] Supabase client init error, falling back to local hybrid storage:', err);
  }
}

export const supabase = supabaseInstance;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseInstance);
}

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    configured: isSupabaseConfigured(),
    projectRef: supabaseUrl ? supabaseUrl.replace('https://', '').split('.')[0] : 'local-mode',
  };
}

// Local Storage Keys for Hybrid Mode
export const STORAGE_KEYS = {
  ENTRIES: 'bharat_culture_entries_v1',
  BOOKMARKS: 'bharat_culture_bookmarks_v1',
  USER_PROFILE: 'bharat_culture_user_v1',
  REVIEWS: 'bharat_culture_reviews_v1',
  COLLECTIONS: 'bharat_culture_collections_v1',
};

/**
 * Generate automatic storage path: audio/${userId}/${timestamp}_${cleanTitle}.webm
 */
export function generateAudioStoragePath(userId: string, titleHint = 'recording'): string {
  const cleanUser = (userId || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '');
  const cleanTitle = (titleHint || 'field_recording')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 32);
  const timestamp = Date.now();
  return `audio/${cleanUser}/${timestamp}_${cleanTitle}.webm`;
}

/**
 * Upload Audio directly to Supabase Storage Bucket ('audio')
 * Gracefully creates object URL / Base64 fallback if Supabase bucket isn't provisioned.
 */
export async function uploadAudioToStorage(
  blob: Blob,
  customPath?: string,
  userId = 'anonymous'
): Promise<{ publicUrl: string; storagePath: string; isRemote: boolean; error?: string }> {
  const path = customPath || generateAudioStoragePath(userId);

  if (supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance.storage
        .from('audio')
        .upload(path, blob, {
          contentType: blob.type || 'audio/webm',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabaseInstance.storage
          .from('audio')
          .getPublicUrl(data.path);

        return {
          publicUrl: publicUrlData.publicUrl,
          storagePath: data.path,
          isRemote: true,
        };
      }
      console.warn('Supabase storage upload error, falling back to local object URL:', error?.message);
    } catch (err: any) {
      console.warn('Supabase storage exception, falling back to local object URL:', err?.message);
    }
  }

  // Resilient fallback: create object URL and save in memory/indexed cache
  const localUrl = URL.createObjectURL(blob);
  return {
    publicUrl: localUrl,
    storagePath: path,
    isRemote: false,
  };
}

/**
 * DATABASE ACTION INTERACTION MATRIX
 * Complete audit mapping of every UI button to its database action, table, storage, route, and permissions.
 */
export interface ActionMatrixItem {
  buttonName: string;
  uiLocation: string;
  action: string;
  databaseTable: string;
  storageBucket?: string;
  route: string;
  permission: 'public' | 'contributor' | 'moderator' | 'admin';
}

export const DATABASE_ACTION_MATRIX: ActionMatrixItem[] = [
  {
    buttonName: 'Bookmark / Save Entry',
    uiLocation: 'Story Card, Modal Dossier, Map Pin Drawer',
    action: 'Toggle bookmark row (INSERT / DELETE)',
    databaseTable: 'public.bookmarks',
    route: '/bookmarks',
    permission: 'public',
  },
  {
    buttonName: 'Record Audio / Stop & Save',
    uiLocation: 'Contribute Portal (Step 2: Acoustic Intake)',
    action: 'Store binary audio file & record media row',
    databaseTable: 'public.media',
    storageBucket: 'audio',
    route: '/contribute',
    permission: 'contributor',
  },
  {
    buttonName: 'Analyze with Gemini Anthropologist',
    uiLocation: 'Contribute Portal (Step 3: AI Pipeline)',
    action: 'Generate cultural analysis & persist ai_content row',
    databaseTable: 'public.ai_content',
    route: '/api/ai/process-heritage',
    permission: 'contributor',
  },
  {
    buttonName: 'Publish to National Commons',
    uiLocation: 'Contribute Portal (Final Submission)',
    action: 'Insert new cultural entry with Pending status',
    databaseTable: 'public.cultural_entries',
    route: '/contribute',
    permission: 'contributor',
  },
  {
    buttonName: 'Approve Entry',
    uiLocation: 'Moderator Dashboard (Review Panel)',
    action: 'Update cultural_entries.status = Approved & insert review log',
    databaseTable: 'public.cultural_entries, public.reviews',
    route: '/moderation',
    permission: 'moderator',
  },
  {
    buttonName: 'Reject Entry',
    uiLocation: 'Moderator Dashboard (Review Panel)',
    action: 'Update cultural_entries.status = Rejected with review comments',
    databaseTable: 'public.cultural_entries, public.reviews',
    route: '/moderation',
    permission: 'moderator',
  },
  {
    buttonName: 'Launch Interactive Atlas',
    uiLocation: 'Hero Banner, Call To Action, Nav Header',
    action: 'Switch route to Atlas and query states & districts',
    databaseTable: 'public.states, public.districts, public.cultural_entries',
    route: '/map',
    permission: 'public',
  },
  {
    buttonName: 'Ask Gemini Anthropologist',
    uiLocation: 'Cultural Entry Modal Dossier (Q&A Tab)',
    action: 'Context-grounded query over repository entries & lore',
    databaseTable: 'public.cultural_entries, public.ai_content',
    route: '/api/ai/ask-heritage',
    permission: 'public',
  },
];

