import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://keaidiqswrrfljnnddzb.supabase.co';
const supabaseKey = 'sb_publishable_NDRyIcYoF2cgsZQ5OG_YOw_sEPjl1Dn';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    try {
        const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed:', error.message);
            if (error.code) console.error('Error code:', error.code);
        } else {
            console.log('Connection successful!');
            console.log('Products table exists.');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
