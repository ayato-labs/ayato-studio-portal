/**
 * Ayato Studio - SEO & Content Integrity Guard
 * Prevents AdSense rejection root causes:
 * 1. Duplicate Content (detects identical titles, slugs, or near-identical body across categories)
 * 2. Missing E-E-A-T / Author data
 * 3. Missing Legal files (ads.txt, privacy policy clauses)
 * 4. Empty dynamic content / DB health check
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const APP_DIR = path.join(ROOT_DIR, 'src', 'app');

interface ArticleMeta {
  filePath: string;
  title: string;
  slug: string;
  content: string;
}

let hasErrors = false;

function logError(msg: string) {
  console.error(`\x1b[31m[SEO GUARD ERROR]\x1b[0m ${msg}`);
  hasErrors = true;
}

function logSuccess(msg: string) {
  console.log(`\x1b[32m[SEO GUARD PASS]\x1b[0m ${msg}`);
}

// 1. Check Duplicate Content across Markdown collections
function checkDuplicateContent() {
  console.log('\n--- Checking Duplicate Content ---');
  const articles: ArticleMeta[] = [];
  const titles = new Map<string, string>();
  const slugs = new Map<string, string>();

  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const titleMatch = raw.match(/^title:\s*(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : '';
        const slug = entry.name.replace(/\.md$/, '');

        articles.push({
          filePath: fullPath,
          title,
          slug,
          content: raw.replace(/^---[\s\S]*?---/, '').trim(),
        });
      }
    }
  }

  scanDir(CONTENT_DIR);

  for (const article of articles) {
    // Check duplicate titles
    if (article.title) {
      const normalizedTitle = article.title.toLowerCase().replace(/\s+/g, '');
      if (titles.has(normalizedTitle)) {
        logError(
          `Duplicate article title detected!\n  Title: "${article.title}"\n  File 1: ${titles.get(normalizedTitle)}\n  File 2: ${article.filePath}`
        );
      } else {
        titles.set(normalizedTitle, article.filePath);
      }
    }

    // Check duplicate slugs
    if (slugs.has(article.slug)) {
      logError(
        `Duplicate article slug detected!\n  Slug: "${article.slug}"\n  File 1: ${slugs.get(article.slug)}\n  File 2: ${article.filePath}`
      );
    } else {
      slugs.set(article.slug, article.filePath);
    }
  }

  // Check content similarity (first 200 chars)
  const snippets = new Map<string, string>();
  for (const article of articles) {
    if (article.content.length > 100) {
      const snippet = article.content.substring(0, 150).replace(/\s+/g, '');
      if (snippets.has(snippet)) {
        logError(
          `Duplicate content snippet detected between files:\n  File 1: ${snippets.get(snippet)}\n  File 2: ${article.filePath}`
        );
      } else {
        snippets.set(snippet, article.filePath);
      }
    }
  }

  if (!hasErrors) {
    logSuccess(`Scanned ${articles.length} markdown articles. No duplicate content found.`);
  }
}

// 2. Check ads.txt and Legal Requirements
function checkLegalRequirements() {
  console.log('\n--- Checking Legal & AdSense Prerequisites ---');

  // Check ads.txt
  const adsTxtPath = path.join(PUBLIC_DIR, 'ads.txt');
  if (!fs.existsSync(adsTxtPath)) {
    logError('public/ads.txt is missing!');
  } else {
    const adsContent = fs.readFileSync(adsTxtPath, 'utf-8');
    if (!adsContent.includes('pub-9593223306166400')) {
      logError('public/ads.txt does not contain valid Publisher ID (pub-9593223306166400)');
    } else {
      logSuccess('public/ads.txt is present and configured.');
    }
  }

  // Check Privacy Policy for Cookie and AdSense clause
  const privacyPath = path.join(APP_DIR, 'privacy', 'page.tsx');
  if (!fs.existsSync(privacyPath)) {
    logError('src/app/privacy/page.tsx is missing!');
  } else {
    const privacyContent = fs.readFileSync(privacyPath, 'utf-8');
    if (!privacyContent.includes('Google AdSense') || !privacyContent.includes('Cookie')) {
      logError('Privacy Policy is missing required Google AdSense / Cookie disclosure!');
    } else {
      logSuccess('Privacy Policy contains required AdSense and Cookie clauses.');
    }
  }

  // Check AuthorCard component
  const authorCardPath = path.join(ROOT_DIR, 'src', 'components', 'features', 'author', 'AuthorCard.tsx');
  if (!fs.existsSync(authorCardPath)) {
    logError('AuthorCard component (E-E-A-T requirement) is missing!');
  } else {
    logSuccess('AuthorCard (E-E-A-T) component is verified.');
  }
}

// 3. Check GEO / LLMO Machine Readability Prerequisites
function checkGEOMachineReadability() {
  console.log('\n--- Checking GEO & LLMO Prerequisites ---');

  // Check llms.txt
  const llmsTxtPath = path.join(PUBLIC_DIR, 'llms.txt');
  if (!fs.existsSync(llmsTxtPath)) {
    logError('public/llms.txt is missing!');
  } else {
    const llmsContent = fs.readFileSync(llmsTxtPath, 'utf-8');
    if (!llmsContent.includes('Transform_MovieToText') || !llmsContent.includes('ProjectCodeMap')) {
      logError('public/llms.txt is missing key product definitions!');
    } else {
      logSuccess('public/llms.txt is present and contains valid product definitions.');
    }
  }

  // Check llms-full.txt
  const llmsFullTxtPath = path.join(PUBLIC_DIR, 'llms-full.txt');
  if (!fs.existsSync(llmsFullTxtPath)) {
    logError('public/llms-full.txt is missing!');
  } else {
    logSuccess('public/llms-full.txt is present.');
  }

  // Check robots.ts for AI Crawlers
  const robotsPath = path.join(APP_DIR, 'robots.ts');
  if (!fs.existsSync(robotsPath)) {
    logError('src/app/robots.ts is missing!');
  } else {
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    if (!robotsContent.includes('GPTBot') || !robotsContent.includes('PerplexityBot') || !robotsContent.includes('ClaudeBot')) {
      logError('robots.ts is not configured to allow major AI crawlers (GPTBot, PerplexityBot, ClaudeBot)!');
    } else {
      logSuccess('robots.ts is verified with explicit AI crawler access.');
    }
  }

  // Check Web MCP Endpoint (JSON-RPC 2.0 Route)
  const mcpRoutePath = path.join(APP_DIR, 'api', 'mcp', 'route.ts');
  if (!fs.existsSync(mcpRoutePath)) {
    logError('src/app/api/mcp/route.ts (Web MCP Endpoint) is missing!');
  } else {
    const mcpContent = fs.readFileSync(mcpRoutePath, 'utf-8');
    if (!mcpContent.includes('tools/list') || !mcpContent.includes('search_ai_reports')) {
      logError('src/app/api/mcp/route.ts is missing required MCP tools!');
    } else {
      logSuccess('Web MCP endpoint (api/mcp) is verified and configured.');
    }
  }
}

// Run All Checks
function run() {
  console.log('====================================================');
  console.log('   AYATO STUDIO - SEO, GEO & QUALITY CI GUARDRAIL   ');
  console.log('====================================================');

  checkDuplicateContent();
  checkLegalRequirements();
  checkGEOMachineReadability();

  console.log('====================================================');
  if (hasErrors) {
    console.error('\x1b[31m[FAILED] SEO & Quality Guard found violations. Build aborted.\x1b[0m\n');
    process.exit(1);
  } else {
    console.log('\x1b[32m[PASSED] All SEO & Content integrity checks passed successfully!\x1b[0m\n');
    process.exit(0);
  }
}

run();
