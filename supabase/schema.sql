-- ==============================================================================
-- HINDUSTAN CULTURE ATLAS: PRODUCTION DATABASE SCHEMA & RLS POLICIES (SUPABASE / POSTGRESQL)
-- Copyright (c) 2026 The First Iteration. All rights reserved.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('contributor', 'moderator', 'explorer', 'admin')) DEFAULT 'explorer',
    bio TEXT,
    location TEXT,
    recognition_badges JSONB DEFAULT '["Heritage Observer"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. STATES TABLE
CREATE TABLE IF NOT EXISTS public.states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    region TEXT NOT NULL CHECK (region IN ('Northern', 'Southern', 'Eastern', 'Western', 'Central', 'North-Eastern')),
    geojson_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. DISTRICTS TABLE
CREATE TABLE IF NOT EXISTS public.districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_district_per_state UNIQUE(state_id, name)
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CULTURAL ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.cultural_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    language TEXT NOT NULL,
    state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
    district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    cover_image TEXT,
    audio_url TEXT,
    video_url TEXT,
    source_details TEXT,
    featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID REFERENCES public.cultural_entries(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'audio', 'video', 'document')),
    caption TEXT,
    storage_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. AI PROCESSED CONTENT TABLE (GEMINI MULTIMODAL HERITAGE ENGINE)
CREATE TABLE IF NOT EXISTS public.ai_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID UNIQUE REFERENCES public.cultural_entries(id) ON DELETE CASCADE,
    transcript TEXT,
    translation TEXT,
    summary TEXT,
    cultural_summary TEXT,
    historical_context TEXT,
    traditional_importance TEXT,
    local_significance TEXT,
    preservation_notes TEXT,
    related_traditions JSONB DEFAULT '[]'::jsonb,
    linguistic_notes TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    narrative_story TEXT,
    cultural_context TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. REVIEWS & AUDIT TABLE (MODERATION WORKFLOW)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID REFERENCES public.cultural_entries(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('Approved', 'Rejected')),
    comments TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. BOOKMARKS & COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    entry_id UUID REFERENCES public.cultural_entries(id) ON DELETE CASCADE,
    collection_name TEXT DEFAULT 'Favorites',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_entry_bookmark UNIQUE(user_id, entry_id)
);

-- 10. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- States & Districts & Categories: Read-only for all public users
CREATE POLICY "Public read states" ON public.states FOR SELECT USING (true);
CREATE POLICY "Public read districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

-- Cultural Entries:
-- 1. Anyone can view Approved entries
CREATE POLICY "Public view approved entries" ON public.cultural_entries
    FOR SELECT USING (status = 'Approved');

-- 2. Authors can view their own entries (even if Pending or Rejected)
CREATE POLICY "Authors view own entries" ON public.cultural_entries
    FOR SELECT USING (auth.uid() = created_by);

-- 3. Moderators & Admins can view all entries
CREATE POLICY "Moderators view all entries" ON public.cultural_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role IN ('moderator', 'admin')
        )
    );

-- 4. Authenticated users can insert entries (defaults to 'Pending')
CREATE POLICY "Contributors insert entries" ON public.cultural_entries
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- 5. Moderators can update entries (Approve / Reject / Edit metadata)
CREATE POLICY "Moderators update entries" ON public.cultural_entries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role IN ('moderator', 'admin')
        )
    );

-- Media & AI Content:
CREATE POLICY "Public view approved entry media" ON public.media
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cultural_entries
            WHERE cultural_entries.id = media.entry_id AND (cultural_entries.status = 'Approved' OR cultural_entries.created_by = auth.uid())
        )
    );

CREATE POLICY "Public view approved entry ai_content" ON public.ai_content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cultural_entries
            WHERE cultural_entries.id = ai_content.entry_id AND (cultural_entries.status = 'Approved' OR cultural_entries.created_by = auth.uid())
        )
    );

-- Bookmarks:
CREATE POLICY "Users read own bookmarks" ON public.bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users manage own bookmarks" ON public.bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- INDEXES FOR SCALE & SPEED
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_entries_status ON public.cultural_entries(status);
CREATE INDEX IF NOT EXISTS idx_entries_district ON public.cultural_entries(district_id);
CREATE INDEX IF NOT EXISTS idx_entries_state ON public.cultural_entries(state_id);
CREATE INDEX IF NOT EXISTS idx_entries_category ON public.cultural_entries(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_content_entry ON public.ai_content(entry_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION (AUDIO, IMAGES, DOCUMENTS)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('audio', 'audio', true, 52428800, ARRAY['audio/webm', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/m4a']),
    ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('documents', 'documents', true, 20971520, ARRAY['application/pdf', 'text/plain'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public read access
CREATE POLICY "Public Read Audio" ON storage.objects FOR SELECT USING (bucket_id = 'audio');
CREATE POLICY "Public Read Images" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Storage RLS: Authenticated upload access
CREATE POLICY "Authenticated Insert Audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio');
CREATE POLICY "Authenticated Insert Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');

