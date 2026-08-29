/**
 * Global AI News Fetcher
 * Ayato Studio Portal
 */

import { supabase } from './api';
import { AiNewsItem } from './types';
import { logger } from './logger';

// Sample fallback data in case DB is offline during build or first setup
const FALLBACK_AI_NEWS: AiNewsItem[] = [
  {
    id: 'fb-1',
    title: 'Study finds most AI creativity metrics diverge from human ratings',
    url: 'https://developinglight.com/studies/the-limits-of-automatic-evaluation-of-creativity',
    source_name: 'Planet AI',
    category: 'Research',
    published_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'fb-2',
    title: 'Z.ai releases GLM-5.3 open-weights under frontier security model license',
    url: 'https://www.techmeme.com/260828/p25#a260828p25',
    source_name: 'Techmeme',
    category: 'Models',
    published_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'fb-3',
    title: 'Deep dive into Grok Bot architecture and online payment automation workflows',
    url: 'https://www.techmeme.com/260828/p22#a260828p22',
    source_name: 'Techmeme',
    category: 'Tools',
    published_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'fb-4',
    title: 'vLLM Sessions announced for PyTorch Conference North America 2026',
    url: 'https://pytorch.org/blog/vllm-sessions-at-pytorch-conference-north-america-2026/',
    source_name: 'PyTorch Blog',
    category: 'Open Source',
    published_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'fb-5',
    title: 'Autonomous mathematical discovery in an open-world multi-agent environment',
    url: 'https://developinglight.com/studies/autonomous-mathematical-discovery',
    source_name: 'arXiv cs.AI',
    category: 'Research',
    published_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    created_at: new Date().toISOString(),
  },
];

export async function getGlobalAiNews(limit: number = 100): Promise<AiNewsItem[]> {
  if (!supabase) {
    logger.warn('Supabase not initialized. Returning fallback AI news.');
    return FALLBACK_AI_NEWS;
  }

  try {
    const { data, error } = await supabase
      .from('ai_news')
      .select('id, title, url, source_name, category, published_at, created_at')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.warn({ error: error.message }, 'Failed to fetch ai_news from Supabase, using fallback');
      return FALLBACK_AI_NEWS;
    }

    if (!data || data.length === 0) {
      return FALLBACK_AI_NEWS;
    }

    return data as AiNewsItem[];
  } catch (err) {
    logger.error({ err }, 'Unexpected error fetching ai_news');
    return FALLBACK_AI_NEWS;
  }
}
