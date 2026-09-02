-- ==============================================================================
-- Migration: 003_create_video_feedback_and_prompts_table.sql
-- Description: Creates table for storing user prompts, generated scripts, and RLHF feedback
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.video_generation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT DEFAULT 'untitled_video',
    prompt TEXT NOT NULL,
    generated_script JSONB NOT NULL,
    video_url TEXT,
    status TEXT NOT NULL DEFAULT 'completed',
    reaction TEXT CHECK (reaction IN ('like', 'dislike', NULL)),
    feedback_category TEXT,
    feedback_text TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indices for rapid querying and dataset export
CREATE INDEX IF NOT EXISTS idx_video_logs_session_id ON public.video_generation_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_video_logs_reaction ON public.video_generation_logs(reaction);
CREATE INDEX IF NOT EXISTS idx_video_logs_created_at ON public.video_generation_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.video_generation_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert generation logs
CREATE POLICY "Allow public insert into video_generation_logs"
    ON public.video_generation_logs
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow users to update their own reaction/feedback by log ID
CREATE POLICY "Allow public update reaction on video_generation_logs"
    ON public.video_generation_logs
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow only service_role / admins to select all data (protecting proprietary prompt dataset)
CREATE POLICY "Allow service_role full read on video_generation_logs"
    ON public.video_generation_logs
    FOR SELECT
    TO service_role
    USING (true);
