import React, { useState, useEffect } from 'react';
import { X, Save, Scan } from 'lucide-react';
import { api } from '../services/api';
import Scanner from './Scanner';

const EditProductModal = ({ isOpen, onClose, product, onUpdate }) => {
    const [formData, setFormData] = useState({
        product_name: '',
        rack_id: '',
        qty: 0,
        barcode: ''
    });
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanTarget, setScanTarget] = useState(null); // 'rack' or 'product'

    useEffect(() => {
        if (product) {
            setFormData({
                product_name: product.product_name || '',
                rack_id: product.rack_id || '',
                qty: product.qty || 0,
                barcode: product.barcode || ''
            });
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'qty' ? parseInt(value) || 0 : value
        }));
    };

    const handleScan = (decodedText) => {
        if (scanTarget === 'rack') {
            setFormData(prev => ({ ...prev, rack_id: decodedText }));
        } else if (scanTarget === 'product') {
            setFormData(prev => ({ ...prev, barcode: decodedText }));
        }
        setIsScanning(false);
        setScanTarget(null);
    };

    const startScan = (target) => {
        setScanTarget(target);
        setIsScanning(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedProduct = await api.updateProduct(product.id, {
                ...formData,
                barcode: formData.barcode.trim() || null
            });
            onUpdate(updatedProduct);
            onClose();
        } catch (error) {
            console.error('Failed to update product:', error);
            // Optionally show error state
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Edit Product</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Product Name</label>
                        <input
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Rack ID</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="rack_id"
                                    value={formData.rack_id}
                                    onChange={handleChange}
                                    className="input flex-1"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => startScan('rack')}
                                    className="btn btn-secondary px-2"
                                    title="Scan Rack"
                                >
                                    <Scan size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
                            <input
                                type="number"
                                name="qty"
                                value={formData.qty}
                                onChange={handleChange}
                                className="input"
                                min="0"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={(e) => handleChange({ target: { name: 'price', value: parseFloat(e.target.value) || 0 } })}
                                    className="input pl-8"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Barcode</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleChange}
                                className="input flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => startScan('product')}
                                className="btn btn-secondary px-2"
                                title="Scan Barcode"
                            >
                                <Scan size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {isScanning && (
                <div style={{ zIndex: 60 }}>
                    <Scanner
                        onScan={handleScan}
                        onClose={() => setIsScanning(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default EditProductModal;
