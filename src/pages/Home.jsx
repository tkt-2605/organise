import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Box, PlusCircle, Package } from 'lucide-react';

const Home = () => {
    const actions = [
        { to: '/search-name', icon: Search, label: 'Search by Name', color: 'bg-blue-500' },
        { to: '/search-rack', icon: Box, label: 'Search by Rack', color: 'bg-purple-500' },
        { to: '/add-rack', icon: PlusCircle, label: 'Add Rack', color: 'bg-emerald-500' },
        { to: '/add-product', icon: Package, label: 'Add Product', color: 'bg-orange-500' },
    ];

    return (
        <div className="flex flex-col gap-8 max-w-md mx-auto mt-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-slate-500 dark:text-slate-400">What would you like to do today?</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {actions.map((action) => (
                    <Link
                        key={action.to}
                        to={action.to}
                        className="group relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${action.color}`} />
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg`}>
                                <action.icon size={24} />
                            </div>
                            <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                                {action.label}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
