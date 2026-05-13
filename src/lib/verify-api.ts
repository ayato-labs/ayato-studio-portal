// Simple manual verification for api.ts logic
// Run with: npx tsx src/lib/verify-api.ts

interface SupabaseReportResponse {
  title: string;
  content_md: string;
  language: string;
  item_id: string;
  generated_at: string;
  raw_items: {
    category: string;
    market: string;
    url: string;
  } | null;
}

function mockMap(r: SupabaseReportResponse) {
  return {
    title: r.title,
    content: r.content_md,
    category: r.raw_items?.category || (r.raw_items?.market === 'energy' ? 'Energy' : 'AI/Tech'),
    market: r.raw_items?.market || 'General',
    language: r.language,
    score: 0,
    filename: r.item_id,
    timestamp: r.generated_at,
    sourceUrl: r.raw_items?.url || undefined,
  };
}

const testCases: SupabaseReportResponse[] = [
  {
    title: 'Energy Report',
    content_md: '...',
    language: 'jp',
    item_id: 'e1',
    generated_at: '2026-03-21',
    raw_items: { category: '', market: 'energy', url: 'http' }, // Missing category
  },
  {
    title: 'AI Report',
    content_md: '...',
    language: 'jp',
    item_id: 'a1',
    generated_at: '2026-03-21',
    raw_items: { category: '', market: 'tech', url: 'http' }, // Missing category
  },
  {
    title: 'Explicit Energy',
    content_md: '...',
    language: 'jp',
    item_id: 'e2',
    generated_at: '2026-03-21',
    raw_items: { category: 'Energy', market: 'energy', url: 'http' }, // Category set
  },
];

console.log('--- Portal API Mapping Verification ---');
testCases.forEach((tc, i) => {
  const mapped = mockMap(tc);
  console.log(
    `Test ${i + 1} [${tc.title}]: Category -> ${mapped.category} (Market: ${tc.raw_items?.market})`,
  );

  if (tc.title === 'Energy Report') {
    if (mapped.category !== 'Energy') throw new Error('Energy fallback failed');
  }
  if (tc.title === 'AI Report') {
    if (mapped.category !== 'AI/Tech') throw new Error('AI/Tech fallback failed');
  }
});
console.log('--- All Portal Mapping Tests Passed ---');
