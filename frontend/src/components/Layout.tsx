import React, { useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    HomeIcon,
    PlusIcon,
    UserIcon,
    ChatBubbleLeftRightIcon,
    SparklesIcon,
    ArrowRightOnRectangleIcon,
    RectangleStackIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    PlusIcon as PlusIconSolid,
    UserIcon as UserIconSolid,
    ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    const navigation = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Feed', href: '/feed', icon: RectangleStackIcon, requiresAuth: true },
        { name: 'Create Post', href: '/create-post', icon: PlusIcon, requiresAuth: true },
        { name: 'Profile', href: '/profile', icon: UserIcon, requiresAuth: true },
    ];

    const handleAuthRequiredClick = (e: React.MouseEvent, requiresAuth: boolean) => {
        if (requiresAuth && !isAuthenticated) {
            e.preventDefault();
            setShowAuthModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header - 64px height (8pt grid) */}
            <header className="layout-header bg-white border-b border-neutral-200 sticky top-0 z-50">
                <div className="layout-container flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-8pt-2">
                        <div className="w-8pt-4 h-8pt-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="text-heading-md text-neutral-900 font-bold">PeerNexus</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8pt-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={(e) => handleAuthRequiredClick(e, item.requiresAuth || false)}
                                    className={`flex items-center gap-8pt-1 px-8pt-2 py-8pt-1 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-primary-100 text-primary-700 font-medium'
                                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-body-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Menu / Auth Button */}
                    <div className="hidden md:flex items-center gap-8pt-2">
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-8pt-2">
                                <div className="text-right">
                                    <p className="text-body-sm font-medium text-neutral-900">{user.username}</p>
                                    <p className="text-caption text-neutral-500">Empathy: {user.empathyScore}%</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="btn-ghost px-8pt-2 py-8pt-1 text-body-sm"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="btn-primary px-8pt-3 py-8pt-2"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-8pt-1 rounded-lg hover:bg-neutral-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <XMarkIcon className="w-6 h-6 text-neutral-600" />
                        ) : (
                            <Bars3Icon className="w-6 h-6 text-neutral-600" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-neutral-200 bg-white">
                        <div className="layout-container py-8pt-2">
                            <nav className="space-8pt-1">
                                {navigation.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            onClick={(e) => {
                                                handleAuthRequiredClick(e, item.requiresAuth || false);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`flex items-center gap-8pt-2 px-8pt-2 py-8pt-2 rounded-lg transition-all duration-200 ${isActive
                                                ? 'bg-primary-100 text-primary-700 font-medium'
                                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="text-body-md">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Mobile Auth Section */}
                            <div className="mt-8pt-3 pt-8pt-3 border-t border-neutral-200">
                                {isAuthenticated && user ? (
                                    <div className="space-8pt-2">
                                        <div className="px-8pt-2">
                                            <p className="text-body-md font-medium text-neutral-900">{user.username}</p>
                                            <p className="text-body-sm text-neutral-500">Empathy Score: {user.empathyScore}%</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full btn-ghost justify-start px-8pt-2 py-8pt-2"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setShowAuthModal(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full btn-primary py-8pt-2"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="layout-content">
                {children}
            </main>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            )}
        </div>
    )
}

export default Layout 