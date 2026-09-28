import { create } from 'zustand';
import { CulturalEntry, FilterOptions, User, UserRole, StateEntity, ReviewLog } from '../types';
import { INITIAL_CULTURAL_ENTRIES, INDIAN_STATES } from '../data/seedData';
import { STORAGE_KEYS } from '../lib/supabase';

export type AppView = 'home' | 'map' | 'discover' | 'contribute' | 'moderation' | 'bookmarks' | 'profile';

interface CultureState {
  // Navigation & UI
  currentView: AppView;
  selectedEntry: CulturalEntry | null;
  selectedState: StateEntity | null;
  selectedDistrict: string | null;
  isSupabaseModalOpen: boolean;
  isProfileModalOpen: boolean;
  isDarkMode: boolean;

  // Authentication & Current User
  currentUser: User;
  
  // Data Repositories
  entries: CulturalEntry[];
  bookmarks: string[]; // array of entry IDs
  collections: { [collectionName: string]: string[] };
  reviewLogs: ReviewLog[];

  // Global Audio Player
  audioPlayer: {
    isPlaying: boolean;
    url: string | null;
    title: string;
    contributor: string;
    cover: string;
    entryId?: string;
  };

  // Search & Filter State
  filters: FilterOptions;

  // Actions
  setView: (view: AppView) => void;
  setSelectedEntry: (entry: CulturalEntry | null) => void;
  setSelectedState: (state: StateEntity | null) => void;
  setSelectedDistrict: (district: string | null) => void;
  setSupabaseModalOpen: (open: boolean) => void;
  setProfileModalOpen: (open: boolean) => void;
  toggleDarkMode: () => void;

  // User Actions
  setUserRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<User>) => void;

  // Entry Actions
  addEntry: (newEntry: Partial<CulturalEntry>) => CulturalEntry;
  updateEntry: (id: string, updates: Partial<CulturalEntry>) => void;
  approveEntry: (id: string, comments?: string) => void;
  rejectEntry: (id: string, reason: string) => void;
  incrementViewCount: (id: string) => void;

  // Bookmarks
  toggleBookmark: (entryId: string) => void;
  isBookmarked: (entryId: string) => boolean;

  // Audio Actions
  playAudio: (data: { url: string; title: string; contributor: string; cover: string; entryId?: string }) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;

  // Filter Actions
  setFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  resetFilters: () => void;
}

// Initial Mock User
const DEFAULT_USER: User = {
  id: 'usr-heritage-custodian',
  name: 'Devi Prasad Sharma',
  email: 'varunbalajiv@gmail.com',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  role: 'contributor', // default to contributor so users can easily contribute or switch to moderator
  bio: 'Folklore researcher & oral tradition chronicler working with tribal elder councils in Central and Western India.',
  location: 'Jaipur, Rajasthan',
  recognition_badges: ['Master Chronicler', 'Dialect Custodian', 'Folk Melody Guardian'],
  created_at: new Date().toISOString(),
};

// Safe load from LocalStorage
function loadStoredEntries(): CulturalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not parse stored entries:', e);
  }
  return INITIAL_CULTURAL_ENTRIES;
}

function loadStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not parse stored bookmarks:', e);
  }
  return ['entry-theyyam-kannur', 'entry-langa-manganiyar-jaisalmer'];
}

function loadInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem('hindustan_theme');
    if (saved) {
      const isDark = saved === 'dark';
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return isDark;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
    return prefersDark;
  } catch {
    return false;
  }
}

export const useCultureStore = create<CultureState>((set, get) => ({
  currentView: 'home',
  selectedEntry: null,
  selectedState: null,
  selectedDistrict: null,
  isSupabaseModalOpen: false,
  isProfileModalOpen: false,
  isDarkMode: loadInitialTheme(),

  currentUser: DEFAULT_USER,
  entries: loadStoredEntries(),
  bookmarks: loadStoredBookmarks(),
  collections: {
    'Desert Melodies': ['entry-langa-manganiyar-jaisalmer'],
    'Sacred Rites': ['entry-theyyam-kannur', 'entry-jagar-uttarakhand'],
  },
  reviewLogs: [
    {
      id: 'rev-1',
      entry_id: 'entry-theyyam-kannur',
      reviewer_name: 'Dr. Anita Menon (Anthropological Survey)',
      status: 'Approved',
      comments: 'Authentic Koladhari clan invocation verified. High linguistic fidelity in old Malayalam transcription.',
      reviewed_at: '2026-03-12T09:00:00Z',
    },
    {
      id: 'rev-2',
      entry_id: 'entry-langa-manganiyar-jaisalmer',
      reviewer_name: 'Prof. Rameshwar Barmer',
      status: 'Approved',
      comments: 'Rare Kamaicha tuning and ancestral Marwari genealogy verified with Barna elders.',
      reviewed_at: '2026-02-18T11:00:00Z',
    },
  ],

  audioPlayer: {
    isPlaying: false,
    url: null,
    title: '',
    contributor: '',
    cover: '',
  },

  filters: {
    searchQuery: '',
    state: '',
    district: '',
    category: '',
    language: '',
    status: 'All',
    viewMode: 'grid',
    sortBy: 'latest',
  },

  setView: (view: AppView) => {
    set({ currentView: view });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setSelectedEntry: (entry: CulturalEntry | null) => {
    set({ selectedEntry: entry });
    if (entry) {
      get().incrementViewCount(entry.id);
    }
  },

  setSelectedState: (state: StateEntity | null) => {
    set({ selectedState: state, selectedDistrict: null });
  },

  setSelectedDistrict: (district: string | null) => {
    set({ selectedDistrict: district });
  },

  setSupabaseModalOpen: (open: boolean) => set({ isSupabaseModalOpen: open }),
  setProfileModalOpen: (open: boolean) => set({ isProfileModalOpen: open }),

  toggleDarkMode: () => {
    const nextDark = !get().isDarkMode;
    set({ isDarkMode: nextDark });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hindustan_theme', nextDark ? 'dark' : 'light');
      } catch (e) {
        console.warn('Could not save theme preference:', e);
      }
      if (nextDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  setUserRole: (role: UserRole) => {
    set((state) => ({
      currentUser: { ...state.currentUser, role },
    }));
  },

  updateUserProfile: (updates: Partial<User>) => {
    set((state) => ({
      currentUser: { ...state.currentUser, ...updates },
    }));
  },

  addEntry: (newEntry: Partial<CulturalEntry>) => {
    const user = get().currentUser;
    const created: CulturalEntry = {
      id: `entry-${Date.now()}`,
      title: newEntry.title || 'Untitled Living Heritage',
      description: newEntry.description || '',
      language: newEntry.language || 'Regional Dialect',
      state: newEntry.state || 'Rajasthan',
      district: newEntry.district || 'Jodhpur',
      category: newEntry.category || 'Oral Traditions & Legends',
      created_by_name: user.name,
      created_by_id: user.id,
      contributor_role: user.role === 'contributor' ? 'Community Tradition Bearer' : 'Heritage Explorer',
      status: 'Pending', // default to Pending per moderation lifecycle
      cover_image: newEntry.cover_image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      audio_url: newEntry.audio_url || 'https://cdn.freesound.org/previews/512/512948_649468-lq.mp3',
      source_details: newEntry.source_details || 'Recorded by contributor directly from community elders.',
      featured: false,
      view_count: 1,
      created_at: new Date().toISOString(),
      ai_content: newEntry.ai_content,
      latitude: newEntry.latitude || (INDIAN_STATES.find(s => s.name === newEntry.state)?.lat || 22.9734) + (Math.random() * 0.4 - 0.2),
      longitude: newEntry.longitude || (INDIAN_STATES.find(s => s.name === newEntry.state)?.lng || 78.6569) + (Math.random() * 0.4 - 0.2),
    };

    set((state) => {
      const updated = [created, ...state.entries];
      try {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage quota exceeded, storing in memory:', err);
      }
      return { entries: updated };
    });

    return created;
  },

  updateEntry: (id: string, updates: Partial<CulturalEntry>) => {
    set((state) => {
      const updated = state.entries.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry));
      try {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return { entries: updated };
    });
  },

  approveEntry: (id: string, comments?: string) => {
    const reviewer = get().currentUser.name;
    const newLog: ReviewLog = {
      id: `rev-${Date.now()}`,
      entry_id: id,
      reviewer_name: reviewer,
      status: 'Approved',
      comments: comments || 'Verified cultural authenticity and language fidelity.',
      reviewed_at: new Date().toISOString(),
    };

    set((state) => {
      const updatedEntries = state.entries.map((e) =>
        e.id === id ? { ...e, status: 'Approved' as const } : e
      );
      try {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updatedEntries));
      } catch (e) {
        console.warn(e);
      }
      return {
        entries: updatedEntries,
        reviewLogs: [newLog, ...state.reviewLogs],
      };
    });
  },

  rejectEntry: (id: string, reason: string) => {
    const reviewer = get().currentUser.name;
    const newLog: ReviewLog = {
      id: `rev-${Date.now()}`,
      entry_id: id,
      reviewer_name: reviewer,
      status: 'Rejected',
      comments: reason,
      reviewed_at: new Date().toISOString(),
    };

    set((state) => {
      const updatedEntries = state.entries.map((e) =>
        e.id === id ? { ...e, status: 'Rejected' as const } : e
      );
      try {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updatedEntries));
      } catch (e) {
        console.warn(e);
      }
      return {
        entries: updatedEntries,
        reviewLogs: [newLog, ...state.reviewLogs],
      };
    });
  },

  incrementViewCount: (id: string) => {
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, view_count: e.view_count + 1 } : e)),
    }));
  },

  toggleBookmark: (entryId: string) => {
    set((state) => {
      const exists = state.bookmarks.includes(entryId);
      const updated = exists
        ? state.bookmarks.filter((id) => id !== entryId)
        : [...state.bookmarks, entryId];
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return { bookmarks: updated };
    });
  },

  isBookmarked: (entryId: string) => {
    return get().bookmarks.includes(entryId);
  },

  playAudio: (data) => {
    set({
      audioPlayer: {
        isPlaying: true,
        url: data.url,
        title: data.title,
        contributor: data.contributor,
        cover: data.cover,
        entryId: data.entryId,
      },
    });
  },

  pauseAudio: () => {
    set((state) => ({
      audioPlayer: { ...state.audioPlayer, isPlaying: false },
    }));
  },

  resumeAudio: () => {
    set((state) => ({
      audioPlayer: { ...state.audioPlayer, isPlaying: true },
    }));
  },

  stopAudio: () => {
    set({
      audioPlayer: {
        isPlaying: false,
        url: null,
        title: '',
        contributor: '',
        cover: '',
      },
    });
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        searchQuery: '',
        state: '',
        district: '',
        category: '',
        language: '',
        status: 'All',
        viewMode: 'grid',
        sortBy: 'latest',
      },
    });
  },
}));
