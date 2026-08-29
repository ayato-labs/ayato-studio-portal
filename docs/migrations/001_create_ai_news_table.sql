-- 001_create_ai_news_table.sql
-- 全世界AIニュース・キュレーションフィード用テーブル

CREATE TABLE IF NOT EXISTS public.ai_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    source_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成 (時系列取得・カテゴリ絞り込みの高速化)
CREATE INDEX IF NOT EXISTS idx_ai_news_published_at ON public.ai_news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_news_category ON public.ai_news (category);
CREATE INDEX IF NOT EXISTS idx_ai_news_url ON public.ai_news (url);

-- Row Level Security (RLS) の設定
ALTER TABLE public.ai_news ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザー (anon) および認証ユーザーへの読み取り専用ポリシー
CREATE POLICY "Allow public read access to ai_news"
    ON public.ai_news
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- サービスロール (service_role: バッチ用) へのフルアクセス権限
CREATE POLICY "Allow service_role full access to ai_news"
    ON public.ai_news
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
