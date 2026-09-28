// Core Data Types for Bharat Culture Atlas

export type UserRole = 'contributor' | 'moderator' | 'explorer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  location?: string;
  recognition_badges: string[];
  created_at: string;
}

export interface StateEntity {
  id: string;
  name: string;
  code: string;
  region: 'Northern' | 'Southern' | 'Eastern' | 'Western' | 'Central' | 'North-Eastern';
  lat: number;
  lng: number;
  zoom: number;
  entryCount?: number;
}

export interface DistrictEntity {
  id: string;
  state_id: string;
  name: string;
  latitude: number;
  longitude: number;
  entryCount?: number;
}

export interface CategoryEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color?: string;
}

export type EntryStatus = 'Pending' | 'Approved' | 'Rejected';

export interface MediaAsset {
  id: string;
  entry_id: string;
  url: string;
  type: 'image' | 'audio' | 'video' | 'document';
  caption?: string;
}

export interface AIContent {
  id: string;
  entry_id: string;
  transcript: string;
  translation: string;
  summary: string;
  tags: string[];
  narrative_story?: string;
  narrativeStory?: string;
  cultural_context?: string;
  culturalContext?: string;
  // Refined Cultural Historian Sections
  culturalSummary?: string;
  historicalContext?: string;
  traditionalImportance?: string;
  localSignificance?: string;
  preservationNotes?: string;
  relatedTraditions?: string[];
  linguisticNotes?: string;
  generated_at: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface NavigationHistoryItem {
  view: string;
  stateId?: string | null;
  districtId?: string | null;
  entryId?: string | null;
  title?: string;
}

export interface ReviewLog {
  id: string;
  entry_id: string;
  reviewer_name: string;
  status: 'Approved' | 'Rejected';
  comments: string;
  reviewed_at: string;
}

export interface CulturalEntry {
  id: string;
  title: string;
  description: string;
  language: string;
  state: string;
  district: string;
  category: string;
  created_by_name: string;
  created_by_id: string;
  contributor_role?: string;
  status: EntryStatus;
  cover_image: string;
  audio_url?: string;
  video_url?: string;
  source_details: string;
  featured?: boolean;
  view_count: number;
  created_at: string;
  ai_content?: AIContent;
  media?: MediaAsset[];
  reviews?: ReviewLog[];
  latitude?: number;
  longitude?: number;
}

export interface Bookmark {
  id: string;
  entry_id: string;
  user_id: string;
  collection_name: string;
  created_at: string;
}

export interface FilterOptions {
  searchQuery: string;
  state: string;
  district: string;
  category: string;
  language: string;
  status: EntryStatus | 'All';
  viewMode: 'grid' | 'list';
  sortBy: 'latest' | 'views' | 'title';
}
