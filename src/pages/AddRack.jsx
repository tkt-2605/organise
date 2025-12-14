import React, { useState, useEffect } from 'react';
import { Scan, PlusCircle, CheckCircle, Home, Package, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Scanner from '../components/Scanner';
import EditRackModal from '../components/EditRackModal';

const AddRack = () => {
    const [rackId, setRackId] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [racks, setRacks] = useState([]);
    const [loadingRacks, setLoadingRacks] = useState(true);
    const [editingRack, setEditingRack] = useState(null);
    const navigate = useNavigate();

    const fetchRacks = async () => {
        setLoadingRacks(true);
        try {
            const data = await api.getRacks();
            setRacks(data || []);
        } catch (err) {
            console.error('Failed to fetch racks:', err);
        } finally {
            setLoadingRacks(false);
        }
    };

    useEffect(() => {
        fetchRacks();
    }, []);

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
            fetchRacks(); // Refresh list
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

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete Rack "${id}"? This might delete associated products.`)) return;
        try {
            await api.deleteRack(id);
            setRacks(prev => prev.filter(r => r.rack_id !== id));
        } catch (err) {
            console.error('Failed to delete rack', err);
            alert('Failed to delete rack.');
        }
    };

    const handleEditUpdate = (newRackId) => {
        setRacks(prev => prev.map(r => r.rack_id === editingRack ? { ...r, rack_id: newRackId } : r));
        setEditingRack(null);
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
                    <button
                        onClick={() => navigate('/add-product', { state: { rackId } })}
                        className="btn btn-secondary flex items-center justify-center gap-2 border-primary-200 text-primary-700 hover:bg-primary-50"
                    >
                        <Package size={20} />
                        Add Products to {rackId}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manage Racks</h2>
            </div>

            <div className="card p-6 space-y-6">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Add New Rack</h3>
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

            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    Existing Racks
                    <span className="text-sm font-normal text-slate-500">({racks.length})</span>
                </h3>

                {loadingRacks ? (
                    <div className="text-center py-8 text-slate-500">Loading racks...</div>
                ) : racks.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        No racks found. Add one above.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {racks.map(rack => (
                            <div key={rack.id || rack.rack_id} className="card p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <Package size={20} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <span className="font-mono font-bold text-lg text-slate-800 dark:text-slate-200">
                                        {rack.rack_id}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate('/add-product', { state: { rackId: rack.rack_id } })}
                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title="Add Products"
                                    >
                                        <PlusCircle size={20} />
                                    </button>
                                    <button
                                        onClick={() => setEditingRack(rack.rack_id)}
                                        className="p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        title="Edit Rack ID"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rack.rack_id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Rack"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isScanning && (
                <Scanner
                    onScan={handleScan}
                    onClose={() => setIsScanning(false)}
                />
            )}

            <EditRackModal
                isOpen={!!editingRack}
                currentRackId={editingRack}
                onClose={() => setEditingRack(null)}
                onUpdate={handleEditUpdate}
            />
        </div>
    );
};

export default AddRack;
