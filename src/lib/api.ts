/**
 * Ayato Studio Portal
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

import { createClient } from '@supabase/supabase-js';
import { Report, Organization } from './types';
import { logger } from './logger';

// Single Unified Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  logger.warn({ url: !!supabaseUrl, key: !!supabaseKey }, 'Supabase configuration missing');
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: 'ayato-auth-token',
        },
      })
    : null;

// Helper to create a safe slug from filename/URL
export function getSlug(filename: string): string {
  if (!filename) return 'report';
  try {
    const url = new URL(filename);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || 'article';
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = (hash << 5) - hash + filename.charCodeAt(i);
      hash |= 0;
    }
    return `${lastPart.substring(0, 30)}-${Math.abs(hash).toString(36)}`;
  } catch {
    // Not a URL, just sanitize
    return filename
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .substring(0, 50);
  }
}

interface DBReport {
  id: string | number;
  item_id: string;
  title: string;
  category: string;
  generated_at: string;
  market: string;
  language: string;
  content_md: string;
}

/**
 * Fetches reports from Supabase.
 */
export async function fetchReports(): Promise<Report[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized. Cannot fetch reports.');
    return [];
  }

  logger.debug('Fetching reports from Supabase (generated_reports)...');

  try {
    const { data, error } = await supabase
      .from('generated_reports')
      .select('id, item_id, title, category, generated_at, market, language, content_md')
      .order('generated_at', { ascending: false })
      .limit(100);

    if (error) {
      logger.warn({ error: error.message }, 'Main fetch failed, attempting fallback');

      const { data: fallbackData, error: fallbackError } = await supabase
        .from('generated_reports')
        .select('id, item_id, title, category, generated_at, market, language, content_md')
        .order('generated_at', { ascending: false })
        .limit(100);

      if (fallbackError) {
        logger.error({ error: fallbackError.message }, 'Fallback fetch also failed');
        return [];
      }

      return (fallbackData || []).map((r: DBReport) => ({
        id: String(r.id),
        filename: r.item_id,
        slug: getSlug(r.item_id),
        title: r.title || 'Untitled Report',
        category: r.category || 'General',
        language: r.language || 'jp',
        timestamp: r.generated_at || new Date().toISOString(),
        market: r.market || 'Global',
        author: 'Ayato Reporter',
        content: r.content_md || '',
        sourceUrl: undefined,
      }));
    }

    return (data || [])
      .map((r: DBReport) => ({
        id: String(r.id),
        filename: r.item_id,
        slug: getSlug(r.item_id),
        title: r.title || 'Untitled Report',
        category: r.category || 'AI/Tech',
        language: r.language || 'jp',
        timestamp: r.generated_at || new Date().toISOString(),
        market: r.market || 'Global',
        author: 'Ayato Reporter',
        content: r.content_md || '',
        sourceUrl: undefined,
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    logger.error({ error: msg }, 'Critical failure in fetchReports');
    return [];
  }
}

export async function fetchReportByFilename(slugOrFilename: string): Promise<Report | null> {
  if (!supabase) return null;
  logger.debug({ slugOrFilename }, 'Fetching single report');

  const allReports = await fetchReports();
  const report = allReports.find((r) => r.slug === slugOrFilename || r.filename === slugOrFilename);

  return report || null;
}

export async function fetchCurrentOrganization(): Promise<{
  org: Organization | null;
  error?: string;
}> {
  if (!supabase) return { org: null, error: 'Supabase client not initialized' };
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { org: null, error: 'No active session found' };

  try {
    const { data: org, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) throw error;
    return { org: org as Organization };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    logger.error({ error: msg }, 'Fetch Org error');
    return { org: null, error: msg || 'Failed to fetch organization' };
  }
}

export async function fetchOrganizationMetrics(): Promise<{
  usage: number;
  limit: number;
  plan: string;
  error?: string;
}> {
  const { org, error } = await fetchCurrentOrganization();
  if (error) return { usage: 0, limit: 100, plan: 'free', error };
  if (!org) return { usage: 0, limit: 100, plan: 'free', error: 'No organization found' };

  return {
    usage: org.current_usage_count || 0,
    limit: org.request_limit || 100,
    plan: org.plan_type || 'free',
  };
}
