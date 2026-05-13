export interface Report {
  id: string;
  filename: string; // The original URL or unique identifier (item_id in DB)
  slug: string; // Used for safe FS paths and routing
  title: string;
  category: string;
  language: string;
  timestamp: string;
  market: string;
  author: string;
  content: string;
  sourceUrl?: string;
}

export interface LocalArticle {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  image?: string;
  content: string;
}

export interface Organization {
  id: string;
  name: string;
  api_key_hash: string;
  user_id: string;
  plan_type: string;
  request_limit: number;
  current_usage_count: number;
  status: string;
}

export interface NoteArticle {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  thumbnail?: string;
  isPremium?: boolean;
}
