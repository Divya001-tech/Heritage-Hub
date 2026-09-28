import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check, Database, ShieldCheck, Server, Globe, ExternalLink } from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';
import { getSupabaseConfig } from '../../lib/supabase';

export const SupabaseDeploymentGuide: React.FC = () => {
  const { isSupabaseModalOpen, setSupabaseModalOpen } = useCultureStore();
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedVercel, setCopiedVercel] = useState(false);

  if (!isSupabaseModalOpen) return null;

  const config = getSupabaseConfig();

  const envSample = `# Environment Variables (.env)
# 1. Supabase credentials (optional for external backend, app uses hybrid store by default)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"

# 2. Server-side Gemini API (injected automatically in AI Studio)
GEMINI_API_KEY="your-gemini-key"
`;

  const schemaSnippet = `-- HINDUSTAN CULTURE ATLAS: PRODUCTION POSTGRESQL SCHEMA WITH RLS
-- Copyright (c) ${new Date().getFullYear()} The First Iteration. All rights reserved.
-- Run this in Supabase SQL Editor:

CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'explorer',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.cultural_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  language TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  audio_url TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cultural_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read approved" ON public.cultural_entries FOR SELECT USING (status = 'Approved');
CREATE POLICY "Contributors insert" ON public.cultural_entries FOR INSERT WITH CHECK (auth.uid() = created_by);
`;

  const vercelGuide = `# Vercel Deployment Instructions
1. Push this repository to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. In Project Settings > Environment Variables, add:
   - GEMINI_API_KEY = your_gemini_key
   - VITE_SUPABASE_URL = your_supabase_url (optional)
   - VITE_SUPABASE_ANON_KEY = your_supabase_anon_key (optional)
4. Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
5. Click "Deploy".
`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-white dark:bg-[#1E1B17] rounded-3xl p-6 sm:p-8 border border-[#E5E0D4] dark:border-[#38332B] shadow-2xl space-y-6 relative text-left max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={() => setSupabaseModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-[#9CA3AF] hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 border-b border-[#F0EBE0] dark:border-[#2A2723] pb-4">
          <div className="text-xs font-semibold text-[#E07A1F] uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-4 h-4 text-[#E07A1F]" />
            <span>Architecture &amp; Cloud Deployment Guide</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-[#111827] dark:text-[#F3F4F6]">
            Supabase, PostgreSQL &amp; Vercel Guide
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF]">
            Current mode: <span className="font-semibold text-[#2E7D32]">Reactive Hybrid Store</span> (100% interactive, persists in localStorage). Ready to connect to external Supabase with one click.
          </p>
        </div>

        {/* 1. Supabase Status & Setup */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <span>1. Supabase PostgreSQL Schema &amp; RLS</span>
          </h3>
          <p className="text-xs text-[#6B7280]">
            The complete schema with UUID primary keys, categories, reviews, audit logs, and Row Level Security is saved in <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">/supabase/schema.sql</code>.
          </p>

          <div className="relative rounded-xl overflow-hidden bg-stone-900 text-stone-200 p-4 text-xs font-mono">
            <button
              onClick={() => copyToClipboard(schemaSnippet, setCopiedSchema)}
              className="absolute top-3 right-3 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] flex items-center gap-1"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'Copied' : 'Copy SQL'}</span>
            </button>
            <pre className="overflow-x-auto whitespace-pre">{schemaSnippet}</pre>
          </div>
        </div>

        {/* 2. Environment Variables */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
            <Server className="w-4 h-4 text-[#E07A1F]" />
            <span>2. Environment Variables (.env)</span>
          </h3>
          <div className="relative rounded-xl overflow-hidden bg-stone-900 text-stone-200 p-4 text-xs font-mono">
            <button
              onClick={() => copyToClipboard(envSample, setCopiedEnv)}
              className="absolute top-3 right-3 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] flex items-center gap-1"
            >
              {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEnv ? 'Copied' : 'Copy .env'}</span>
            </button>
            <pre className="overflow-x-auto whitespace-pre">{envSample}</pre>
          </div>
        </div>

        {/* 3. Vercel Hosting Guide */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#2E7D32]" />
            <span>3. Vercel Production Deployment</span>
          </h3>
          <div className="relative rounded-xl overflow-hidden bg-stone-900 text-stone-200 p-4 text-xs font-mono">
            <button
              onClick={() => copyToClipboard(vercelGuide, setCopiedVercel)}
              className="absolute top-3 right-3 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] flex items-center gap-1"
            >
              {copiedVercel ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedVercel ? 'Copied' : 'Copy Guide'}</span>
            </button>
            <pre className="overflow-x-auto whitespace-pre">{vercelGuide}</pre>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setSupabaseModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-xs font-semibold"
          >
            Close Guide
          </button>
        </div>
      </motion.div>
    </div>
  );
};
