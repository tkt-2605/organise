import React, { useState } from 'react';
import { Scan, PlusCircle, CheckCircle, Home, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Scanner from '../components/Scanner';

const AddRack = () => {
    const [rackId, setRackId] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = (decodedText) => {
        setRackId(decodedText);
        setIsScanning(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rackId.trim()) return;

        setLoading(true);
        setError(null);
        try {
            await api.addRack(rackId);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Failed to add rack. It might already exist.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setRackId('');
        setSuccess(false);
        setError(null);
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto text-center space-y-8 pt-12 animate-fade-in">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Rack Added Successfully!</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Rack ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{rackId}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Link to="/" className="btn btn-secondary flex items-center justify-center gap-2">
                        <Home size={20} />
                        Return to Home
                    </Link>
                    <button onClick={resetForm} className="btn btn-primary flex items-center justify-center gap-2">
                        <PlusCircle size={20} />
                        Add Another Rack
                    </button>
                    <Link to="/add-product" className="btn btn-secondary flex items-center justify-center gap-2 border-primary-200 text-primary-700 hover:bg-primary-50">
                        <Package size={20} />
                        Add Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Add New Rack</h2>
            </div>

            <div className="card p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            />
                            <button
                                type="button"
                                onClick={() => setIsScanning(true)}
                                className="btn btn-secondary px-3"
                                title="Scan Barcode"
                            >
                                <Scan size={20} />
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !rackId}
                        className="w-full btn btn-primary flex items-center justify-center gap-2"
                    >
                        {loading ? 'Adding...' : 'Confirm Entry'}
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
};

export default AddRack;
