import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testConnection() {
    console.log(`Connecting to: ${supabaseUrl}`);
    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing environment variables!');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test fetch
    const { data, error } = await supabase
        .from('generated_reports')
        .select('item_id, title')
        .limit(5);

    if (error) {
        console.error('Supabase Error:', error);
    } else {
        console.log(`Successfully fetched ${data?.length} reports.`);
        console.log('Sample Data:', data);
    }
}

testConnection();
