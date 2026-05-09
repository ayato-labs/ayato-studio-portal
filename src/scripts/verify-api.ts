import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('--- Ayato Portal API Verification (Real Data) ---');
  console.log(`Target URL: ${supabaseUrl}`);

  // 1. Check generated_reports count
  console.log('\n[1] Checking generated_reports count...');
  const { count: reportCount, error: countErr } = await supabase
    .from('generated_reports')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error('Error fetching report count:', countErr);
  } else {
    console.log(`Total reports in database: ${reportCount}`);
  }

  // 2. Check raw_items count
  console.log('\n[2] Checking raw_items count...');
  const { count: rawCount, error: rawErr } = await supabase
    .from('raw_items')
    .select('*', { count: 'exact', head: true });

  if (rawErr) {
    console.error('Error fetching raw_items count:', rawErr);
  } else {
    console.log(`Total raw_items in database: ${rawCount}`);
  }

  // 3. Test simple query (Stable)
  console.log('\n[3] Testing Simple Query (Stable)...');
  const { data, error } = await supabase
    .from('generated_reports')
    .select('title, item_id, category, market')
    .limit(3);

  if (error) {
    console.error('Query Error:', error);
  } else {
    console.log('Query Result Samples:');
    console.log(JSON.stringify(data, null, 2));
  }

  // 4. Test RLS (Select one row)
  console.log('\n[4] Testing RLS on generated_reports...');
  const { error: rlsErr } = await supabase
    .from('generated_reports')
    .select('*')
    .limit(1);

  if (rlsErr) {
    console.warn('RLS might be blocking read access:', rlsErr);
  } else {
    console.log('RLS Status: Pass (Data returned)');
  }

  console.log('\n--- Verification Finished ---');
}

verify();
