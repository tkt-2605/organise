import { supabase, isSupabaseConfigured, mockProducts, mockRacks } from './supabase';

export const api = {
    getProducts: async (query = '') => {
        if (isSupabaseConfigured()) {
            let queryBuilder = supabase
                .from('products')
                .select('*')
                .order('product_name');

            if (query) {
                queryBuilder = queryBuilder.ilike('product_name', `%${query}%`);
            }

            const { data, error } = await queryBuilder;
            if (error) throw error;
            return data;
        } else {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
            if (!query) return mockProducts;
            return mockProducts.filter(p =>
                p.product_name.toLowerCase().includes(query.toLowerCase())
            );
        }
    },

    getProductsByRack: async (rackId) => {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('rack_id', rackId);

            if (error) throw error;
            return data;
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockProducts.filter(p => p.rack_id === rackId);
        }
    },

    getRacks: async (query = '') => {
        if (isSupabaseConfigured()) {
            let queryBuilder = supabase
                .from('racks')
                .select('*');

            if (query) {
                queryBuilder = queryBuilder.ilike('rack_id', `%${query}%`);
            }

            const { data, error } = await queryBuilder;
            if (error) throw error;
            return data;
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (!query) return mockRacks;
            return mockRacks.filter(r =>
                r.rack_id.toLowerCase().includes(query.toLowerCase())
            );
        }
    },

    addRack: async (rackId) => {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('racks')
                .insert([{ rack_id: rackId }])
                .select();

            if (error) throw error;
            return data[0];
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            const newRack = { id: Date.now(), rack_id: rackId };
            mockRacks.push(newRack);
            return newRack;
        }
    },

    addProduct: async (product) => {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('products')
                .insert([product])
                .select();

            if (error) throw error;
            return data[0];
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            const newProduct = { ...product, id: Date.now() };
            mockProducts.push(newProduct);
            return newProduct;
        }
    }
};
