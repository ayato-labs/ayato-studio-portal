import Parser from 'rss-parser';
import { NoteArticle } from './types';
export type { NoteArticle };

const NOTE_RSS_URL = 'https://note.com/ayato_studio/rss';

interface NoteRSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  thumbnail?: string;
  mediaContent?: {
    $: { url: string };
  };
}

/**
 * Fetches the latest articles from note.com/ayato_studio via RSS
 */
export async function fetchNoteArticles(limit = 3): Promise<NoteArticle[]> {
  const parser = new Parser({
    customFields: {
      item: [
        ['media:thumbnail', 'thumbnail'],
        ['media:content', 'mediaContent'],
      ],
    },
  });

  try {
    const feed = await parser.parseURL(NOTE_RSS_URL);

    return feed.items.slice(0, limit).map((item: Parser.Item & NoteRSSItem) => {
      // Note often puts image in media:content or media:thumbnail
      let thumbnail = item.thumbnail || '';
      if (!thumbnail && item.mediaContent && item.mediaContent.$) {
        thumbnail = item.mediaContent.$.url;
      }

      const title = item.title || '';
      const isPremium =
        title.includes('エンジン') || title.includes('極意') || title.includes('マガジン');

      return {
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || '',
        contentSnippet: item.contentSnippet || '',
        thumbnail: thumbnail,
        isPremium: isPremium,
      };
    });
  } catch (error) {
    console.error('[NoteAPI] Failed to fetch note articles:', error);
    return [];
  }
}
