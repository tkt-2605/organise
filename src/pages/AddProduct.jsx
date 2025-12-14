import React, { useState } from 'react';
import { Scan, PlusCircle, CheckCircle, Home, Package, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Scanner from '../components/Scanner';

const AddProduct = () => {
    const [step, setStep] = useState(1); // 1: Select Rack, 2: Product Details, 3: Success
    const [rackId, setRackId] = useState('');
    const [productData, setProductData] = useState({
        product_name: '',
        barcode: '',
        qty: 1
    });
    const [isScanning, setIsScanning] = useState(false);
    const [scanTarget, setScanTarget] = useState(null); // 'rack' or 'product'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = (decodedText) => {
        if (scanTarget === 'rack') {
            setRackId(decodedText);
            // Optional: Auto advance if valid format?
        } else if (scanTarget === 'product') {
            setProductData(prev => ({ ...prev, barcode: decodedText }));
        }
        setIsScanning(false);
        setScanTarget(null);
    };

    const startScan = (target) => {
        setScanTarget(target);
        setIsScanning(true);
    };

    const handleRackSubmit = (e) => {
        e.preventDefault();
        if (rackId.trim()) {
            setStep(2);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.addProduct({
                ...productData,
                rack_id: rackId,
                created_at: new Date().toISOString()
            });
            setStep(3);
        } catch (err) {
            console.error(err);
            setError('Failed to add product.');
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = () => {
        setProductData({
            product_name: '',
            barcode: '',
            qty: 1
        });
        setStep(2); // Go back to product form, keeping rack_id
    };

    const fullReset = () => {
        setRackId('');
        setProductData({
            product_name: '',
            barcode: '',
            qty: 1
        });
        setStep(1);
    };

    // Step 1: Select Rack
    if (step === 1) {
        return (
            <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Select Rack</h2>
                </div>

                <div className="card p-6 space-y-6">
                    <form onSubmit={handleRackSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Rack ID
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={rackId}
                                    onChange={(e) => setRackId(e.target.value)}
                                    placeholder="Enter or scan Rack ID"
                                    className="input flex-1"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => startScan('rack')}
                                    className="btn btn-secondary px-3"
                                    title="Scan Rack Barcode"
                                >
                                    <Scan size={20} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!rackId}
                            className="w-full btn btn-primary flex items-center justify-center gap-2"
                        >
                            Next <ArrowRight size={20} />
                        </button>
                    </form>
                </div>

                {isScanning && (
                    <Scanner
                        onScan={handleScan}
                        onClose={() => setIsScanning(false)}
                    />
                )}
            </div>
        );
    }

    // Step 2: Product Details
    if (step === 2) {
        return (
            <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Add Product</h2>
                </div>

                <div className="card p-6 space-y-6">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center">
                        <span className="text-sm text-slate-500">Target Rack:</span>
                        <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{rackId}</span>
                    </div>

                    <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={productData.product_name}
                                onChange={(e) => setProductData({ ...productData, product_name: e.target.value })}
                                className="input"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Barcode
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={productData.barcode}
                                    onChange={(e) => setProductData({ ...productData, barcode: e.target.value })}
                                    className="input flex-1"
                                    placeholder="Optional"
                                />
                                <button
                                    type="button"
                                    onClick={() => startScan('product')}
                                    className="btn btn-secondary px-3"
                                    title="Scan Product Barcode"
                                >
                                    <Scan size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Quantity
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={productData.qty}
                                onChange={(e) => setProductData({ ...productData, qty: parseInt(e.target.value) || 0 })}
                                className="input"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !productData.product_name}
                            className="w-full btn btn-primary flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Saving...' : 'Confirm Product'}
                        </button>
                    </form>
                </div>

                {isScanning && (
                    <Scanner
                        onScan={handleScan}
                        onClose={() => setIsScanning(false)}
                    />
                )}
            </div>
        );
    }

    // Step 3: Success
    return (
        <div className="max-w-md mx-auto text-center space-y-8 pt-12 animate-fade-in">
            <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Product Added!</h2>
                <div className="text-slate-600 dark:text-slate-400 space-y-1">
                    <p>Added <span className="font-bold text-slate-800 dark:text-slate-200">{productData.product_name}</span></p>
                    <p>to Rack <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{rackId}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Link to="/" className="btn btn-secondary flex items-center justify-center gap-2">
                    <Home size={20} />
                    Return to Home
                </Link>
                <button onClick={resetFlow} className="btn btn-primary flex items-center justify-center gap-2">
                    <PlusCircle size={20} />
                    Add More to {rackId}
                </button>
                <button onClick={fullReset} className="btn btn-secondary flex items-center justify-center gap-2 border-primary-200 text-primary-700 hover:bg-primary-50">
                    <Package size={20} />
                    Change Rack
                </button>
            </div>
        </div>
    );
};

export default AddProduct;
