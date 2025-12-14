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

    getProductsByBarcode: async (barcode) => {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('barcode', barcode);

            if (error) throw error;
            return data;
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockProducts.filter(p => p.barcode === barcode);
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
    },

    updateProduct: async (id, updates) => {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select();

            if (error) throw error;
            return data[0];
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = mockProducts.findIndex(p => p.id === id);
            if (index !== -1) {
                mockProducts[index] = { ...mockProducts[index], ...updates };
                return mockProducts[index];
            }
            throw new Error('Product not found');
        }
    },

    deleteProduct: async (id) => {
        console.log('API: deleteProduct called with id:', id);
        if (isSupabaseConfigured()) {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = mockProducts.findIndex(p => p.id === id);
            console.log('API: Found product at index:', index);
            if (index !== -1) {
                mockProducts.splice(index, 1);
                console.log('API: Product deleted from mock data');
                return true;
            }
            throw new Error('Product not found');
        }
    },


    updateRack: async (oldRackId, newRackId) => {
        if (isSupabaseConfigured()) {
            // Transaction-like update: Update Rack first, then Products
            // Note: Supabase doesn't support transactions in client-lib easily without RPC.
            // For now, we update products first (to not lose link) or relies on FK cascade update if set (likely not set).
            // Actually, if we update Rack ID in 'racks' table, we might violate FK if we don't update products.
            // But we don't have a 'racks' table in the mock data effectively linked by ID, it's just a string.
            // Let's assume we update both.

            // 1. Update Racks table
            const { error: rackError } = await supabase
                .from('racks')
                .update({ rack_id: newRackId })
                .eq('rack_id', oldRackId);

            if (rackError) throw rackError;

            // 2. Update Products table
            const { error: prodError } = await supabase
                .from('products')
                .update({ rack_id: newRackId })
                .eq('rack_id', oldRackId);

            if (prodError) throw prodError;

            return { rack_id: newRackId };
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Update Rack
            const rack = mockRacks.find(r => r.rack_id === oldRackId);
            if (rack) rack.rack_id = newRackId;

            // Update Products
            mockProducts.forEach(p => {
                if (p.rack_id === oldRackId) {
                    p.rack_id = newRackId;
                }
            });

            return { rack_id: newRackId };
        }
    },

    deleteRack: async (rackId) => {
        if (isSupabaseConfigured()) {
            // Cascade delete: Delete products first, then rack
            const { error: prodError } = await supabase
                .from('products')
                .delete()
                .eq('rack_id', rackId);

            if (prodError) throw prodError;

            const { error: rackError } = await supabase
                .from('racks')
                .delete()
                .eq('rack_id', rackId);

            if (rackError) throw rackError;

            return true;
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Delete Products
            let i = mockProducts.length;
            while (i--) {
                if (mockProducts[i].rack_id === rackId) {
                    mockProducts.splice(i, 1);
                }
            }

            // Delete Rack
            const index = mockRacks.findIndex(r => r.rack_id === rackId);
            if (index !== -1) {
                mockRacks.splice(index, 1);
            }
            return true;
        }
    }
};


