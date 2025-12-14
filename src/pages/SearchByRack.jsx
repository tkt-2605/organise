import React, { useState, useEffect } from 'react';
import { Search, Loader2, Scan, Box } from 'lucide-react';
import { api } from '../services/api';
import Scanner from '../components/Scanner';

const SearchByRack = () => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (rackId) => {
        if (!rackId) return;
        setLoading(true);
        setHasSearched(true);
        try {
            const data = await api.getProductsByRack(rackId);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = (decodedText) => {
        setQuery(decodedText);
        setIsScanning(false);
        handleSearch(decodedText);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(query);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Search by Rack</h2>
            </div>

            {/* Search Controls */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Rack ID..."
                        className="input pl-12 py-3 text-lg shadow-sm"
                    />
                </div>
                <button
                    onClick={() => setIsScanning(true)}
                    className="btn btn-primary flex items-center gap-2"
                    title="Scan Barcode"
                >
                    <Scan size={20} />
                    <span className="hidden sm:inline">Scan</span>
                </button>
            </div>

            {/* Scanner Modal */}
            {isScanning && (
                <Scanner
                    onScan={handleScan}
                    onClose={() => setIsScanning(false)}
                />
            )}

            {/* Results Table */}
            {hasSearched && (
                <div className="card overflow-hidden animate-fade-in">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                            Products in Rack: <span className="text-primary-600 dark:text-primary-400">{query}</span>
                        </h3>
                        <span className="text-sm text-slate-500">{products.length} items found</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Product Name</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Qty</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 hidden sm:table-cell">Barcode</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{product.product_name}</td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400">{product.qty}</td>
                                            <td className="p-4 text-slate-500 dark:text-slate-500 font-mono text-sm hidden sm:table-cell">{product.barcode}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-slate-500 dark:text-slate-400">
                                            {loading ? (
                                                <div className="flex justify-center items-center gap-2">
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Loading...
                                                </div>
                                            ) : (
                                                'No products found in this rack'
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchByRack;
