import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = () => !!supabase;

// Mock data for development when Supabase is not connected
export const mockProducts = [
    { id: 1, product_name: 'Wireless Mouse', barcode: '123456789', qty: 15, rack_id: 'R1-A', price: 25 },
    { id: 2, product_name: 'Mechanical Keyboard', barcode: '987654321', qty: 5, rack_id: 'R1-B', price: 120 },
    { id: 3, product_name: 'USB-C Cable', barcode: '456123789', qty: 50, rack_id: 'R2-A', price: 10 },
    { id: 4, product_name: 'Monitor Stand', barcode: '789123456', qty: 10, rack_id: 'R2-B', price: 45 },
];

export const mockRacks = [
    { id: 1, rack_id: 'R1-A' },
    { id: 2, rack_id: 'R1-B' },
    { id: 3, rack_id: 'R2-A' },
    { id: 4, rack_id: 'R2-B' },
];

