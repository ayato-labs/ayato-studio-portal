-- Migration: 002_create_subscriptions_table.sql
-- Description: Creates user_subscriptions table for Stripe subscriptions and one-off purchases

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT,
    product_id TEXT NOT NULL, -- e.g. 'movie-to-text', 'project-code-map', 'supporter', etc.
    plan_tier TEXT NOT NULL,  -- e.g. 'pro', 'enterprise', 'supporter'
    status TEXT NOT NULL,     -- 'active', 'trialing', 'past_due', 'canceled', 'unpaid', 'one_time'
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_customer_id ON public.user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_product_id ON public.user_subscriptions(product_id);

-- Enable Row Level Security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies:
-- 1. Users can only view their own subscriptions
CREATE POLICY "Users can read own subscriptions"
ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Service role has full access (for Webhook handler)
CREATE POLICY "Service role has full access to user_subscriptions"
ON public.user_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
