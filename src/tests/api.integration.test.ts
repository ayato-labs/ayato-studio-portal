import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { expect, test, describe } from 'vitest';
import { fetchReports } from '../lib/api';

describe('API Integration Test (No Mock)', () => {
  test('fetchReports should return real data from Supabase', async () => {
    const reports = await fetchReports();

    console.log('Fetched reports count:', reports.length);
    if (reports.length > 0) {
      console.log('First report title:', reports[0].title);
    }

    expect(reports.length).toBeGreaterThan(0);
    // Ensure properties exist based on Report interface
    expect(reports[0]).toHaveProperty('filename');
    expect(reports[0]).toHaveProperty('title');
    expect(reports[0]).toHaveProperty('content');
    expect(reports[0]).toHaveProperty('timestamp');
  });
});
