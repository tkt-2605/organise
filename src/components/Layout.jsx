import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, Box, PlusCircle, Menu, X } from 'lucide-react';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/search-name', icon: Search, label: 'Search Product' },
        { path: '/search-rack', icon: Box, label: 'Search Rack' },
        { path: '/add-rack', icon: PlusCircle, label: 'Add Rack' },
        { path: '/add-product', icon: PlusCircle, label: 'Add Product' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 shadow-sm">
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                    Organise
                </Link>

                <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary-500 ${location.pathname === item.path ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </header>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={toggleMenu}>
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 pt-20 shadow-2xl animate-slide-in-right" onClick={e => e.stopPropagation()}>
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={toggleMenu}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname === item.path
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] animate-fade-in">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
