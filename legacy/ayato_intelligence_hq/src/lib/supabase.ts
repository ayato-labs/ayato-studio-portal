import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface SNSPostLog {
  id: number;
  platform: 'x' | 'bluesky';
  content: string;
  source_item_id: string;
  ai_model: string;
  status: 'success' | 'failed';
  created_at: string;
}
