import React, { useState } from 'react';
import { Search, Loader2, Scan, Barcode, Edit, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import Scanner from '../components/Scanner';
import EditProductModal from '../components/EditProductModal';
import ConfirmationModal from '../components/ConfirmationModal';

const SearchByBarcode = () => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);

    const handleSearch = async (barcode) => {
        if (!barcode) return;
        setLoading(true);
        setHasSearched(true);
        try {
            const data = await api.getProductsByBarcode(barcode);
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

    const handleDeleteClick = (product) => {
        setDeletingProduct(product);
    };

    const handleConfirmDelete = async () => {
        if (!deletingProduct) return;
        try {
            await api.deleteProduct(deletingProduct.id);
            setProducts(products.filter(p => p.id !== deletingProduct.id));
            setDeletingProduct(null);
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleUpdate = (updatedProduct) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Search by Barcode</h2>
            </div>

            {/* Search Controls */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter or Scan Barcode..."
                        className="input pl-12 py-3 text-lg shadow-sm"
                        autoFocus
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
                            Results for Barcode: <span className="text-primary-600 dark:text-primary-400 font-mono">{query}</span>
                        </h3>
                        <span className="text-sm text-slate-500">{products.length} items found</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Product Name</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Rack ID</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Price</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Qty</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 hidden sm:table-cell">Barcode</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{product.product_name}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                                    {product.rack_id}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400">
                                                ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400">{product.qty}</td>
                                            <td className="p-4 text-slate-500 dark:text-slate-500 font-mono text-sm hidden sm:table-cell">{product.barcode}</td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => setEditingProduct(product)}
                                                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(product)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-400">
                                            {loading ? (
                                                <div className="flex justify-center items-center gap-2">
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Loading...
                                                </div>
                                            ) : (
                                                'No products matches this barcode'
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <EditProductModal
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                product={editingProduct}
                onUpdate={handleUpdate}
            />

            <ConfirmationModal
                isOpen={!!deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                message={deletingProduct ? `Are you sure you want to delete "${deletingProduct.product_name}"?` : ''}
                isDangerous={true}
            />
        </div>
    );
};

export default SearchByBarcode;
