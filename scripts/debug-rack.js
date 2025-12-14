import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://keaidiqswrrfljnnddzb.supabase.co';
const supabaseKey = 'sb_publishable_NDRyIcYoF2cgsZQ5OG_YOw_sEPjl1Dn';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAddRack() {
    console.log('Debugging Add Rack...');

    // 1. Check if table exists
    console.log('Checking if "racks" table exists...');
    const { data: tableData, error: tableError } = await supabase
        .from('racks')
        .select('count', { count: 'exact', head: true });

    if (tableError) {
        console.error('Error accessing "racks" table:', tableError);
        return;
    }
    console.log('"racks" table exists.');

    // 2. Try to insert a test rack
    const testRackId = `test-rack-${Date.now()}`;
    console.log(`Attempting to insert rack: ${testRackId}`);

    const { data, error } = await supabase
        .from('racks')
        .insert([{ rack_id: testRackId }])
        .select();

    if (error) {
        console.error('Insert failed:', error);
    } else {
        console.log('Insert successful:', data);

        // Cleanup
        await supabase.from('racks').delete().eq('rack_id', testRackId);
    }
}

debugAddRack();
