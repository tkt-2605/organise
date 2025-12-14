import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '../services/api';

const EditRackModal = ({ isOpen, onClose, currentRackId, onUpdate }) => {
    const [newRackId, setNewRackId] = useState(currentRackId);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newRackId === currentRackId) {
            onClose();
            return;
        }

        setLoading(true);
        setError('');
        try {
            const updatedRack = await api.updateRack(currentRackId, newRackId);
            onUpdate(updatedRack.rack_id);
            onClose();
        } catch (err) {
            console.error('Failed to update rack:', err);
            setError('Failed to update rack. ID might already exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Edit Rack ID</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Rack ID</label>
                        <input
                            type="text"
                            value={newRackId}
                            onChange={(e) => setNewRackId(e.target.value)}
                            className="input"
                            required
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !newRackId.trim()}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRackModal;
