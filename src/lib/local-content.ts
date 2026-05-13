/**
 * Ayato Studio Portal
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import fs from 'fs';
import path from 'path';
import { LocalArticle, Report } from './types';
import { getSlug } from './api';
import { logger } from './logger';

/**
 * Parses simple YAML-like frontmatter from Markdown content.
 * Avoids extra dependencies for basic use cases.
 */
function parseFrontmatter(fileContents: string) {
  // Remove BOM and leading/trailing whitespace
  const sanitized = fileContents.replace(/^\uFEFF/, '').trim();
  const match = sanitized.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  
  if (!match) {
    return { data: {}, content: sanitized };
  }
  
  const yaml = match[1];
  const content = sanitized.replace(match[0], '').trim();
  const data: Record<string, string> = {};
  
  yaml.split(/\r?\n/).forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      if (key) {
        // Remove quotes if present
        data[key] = value.replace(/^["'](.*)["']$/, '$1');
      }
    }
  });
  
  return { data, content };
}

export function getLocalArticles(directory: string): LocalArticle[] {
  const contentPath = path.join(process.cwd(), 'src', 'content', directory);
  
  if (!fs.existsSync(contentPath)) {
    return [];
  }

  const files = fs.readdirSync(contentPath);
  
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace('.md', '');
      const fullPath = path.join(contentPath, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = parseFrontmatter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        description: data.description || '',
        category: data.category || directory,
        image: data.image || '',
        content,
      };
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function getLocalArticleBySlug(directory: string, slug: string): LocalArticle | null {
  const fullPath = path.join(process.cwd(), 'src', 'content', directory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = parseFrontmatter(fileContents);

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    description: data.description || '',
    category: data.category || directory,
    image: data.image || '',
    content,
  };
}

/**
 * Fetches reports stored locally in the filesystem.
 * Moved from api.ts to keep Node.js specific code in server-only utilities.
 */
export function getLocalReports(): Report[] {
  const localReports: Report[] = [];
  const reportsDir = path.join(process.cwd(), 'src', 'content', 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    logger.debug({ path: reportsDir }, 'Local reports directory not found');
    return [];
  }

  try {
    const sectors = ['tech', 'finance', 'energy', 'weekly'];
    sectors.forEach(sector => {
      const sectorDir = path.join(reportsDir, sector);
      if (fs.existsSync(sectorDir)) {
        const files = fs.readdirSync(sectorDir).filter(f => f.endsWith('.md'));
        files.forEach(file => {
          const fullPath = path.join(sectorDir, file);
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const { data, content: textContent } = parseFrontmatter(content);

            localReports.push({
              id: `local-${file}`,
              filename: file,
              slug: getSlug(file.replace('.md', '')),
              title: data.title || file,
              category: data.category || sector.toUpperCase(),
              language: data.language || 'jp',
              timestamp: data.date || new Date().toISOString(),
              market: sector === 'tech' ? 'tech' : (sector === 'finance' ? 'finance' : 'energy'),
              author: 'Local Engine',
              content: textContent,
            });
          } catch (fileErr: any) {
            logger.error({ file: fullPath, error: fileErr.message }, 'Failed to read/parse local report file');
          }
        });
      }
    });
  } catch (e: any) {
    logger.error({ error: e.message }, 'Failed to fetch local reports');
  }

  return localReports;
}

/**
 * Lists all application directories in src/content/apps.
 */
export function getAppsList(): string[] {
  const appsPath = path.join(process.cwd(), 'src', 'content', 'apps');
  
  if (!fs.existsSync(appsPath)) {
    return [];
  }

  return fs.readdirSync(appsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}
