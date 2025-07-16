import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    XMarkIcon,
    EyeIcon,
    EyeSlashIcon,
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    SparklesIcon,
    UserPlusIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState<'login' | 'signup' | 'anonymous'>('anonymous');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { login, signup, loginAnonymously, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
            } else if (mode === 'signup') {
                await signup(formData.username, formData.email, formData.password);
            } else if (mode === 'anonymous') {
                await loginAnonymously();
            }
            onClose();
        } catch (error) {
            setErrors({ general: 'Authentication failed. Please try again.' });
        }
    };

    const handleAnonymousLogin = async () => {
        try {
            await loginAnonymously();
            onClose();
        } catch (error) {
            setErrors({ general: 'Failed to start anonymous session. Please try again.' });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Header */}
                    <div className="relative p-8 pb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-white/80 hover:bg-white transition-all duration-200 shadow-sm"
                        >
                            <XMarkIcon className="w-5 h-5 text-slate-600" />
                        </button>

                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <SparklesIcon className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
                                {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join PeerNexus' : 'Start Anonymous Session'}
                            </h2>

                            <p className="text-center text-slate-600 text-sm">
                                {mode === 'login'
                                    ? 'Continue your journey of connection and support'
                                    : mode === 'signup'
                                        ? 'Start your anonymous journey to healing and hope'
                                        : 'Begin your anonymous journey to explore PeerNexus without revealing your identity.'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 pb-8">
                        <div className="space-y-5">
                            {mode !== 'anonymous' && (
                                <>
                                    {mode === 'signup' && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">
                                                Username
                                            </label>
                                            <div className="relative">
                                                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={formData.username}
                                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
                                                    placeholder="Choose a username"
                                                    required={mode === 'signup'}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
                                                placeholder="Enter your password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="w-5 h-5 text-slate-400" />
                                                ) : (
                                                    <EyeIcon className="w-5 h-5 text-slate-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {mode === 'anonymous' && (
                                <div className="space-y-4">
                                    <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                        <ShieldCheckIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Anonymous Session</h3>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Start exploring PeerConnect without sharing any personal information.
                                            Your privacy is completely protected.
                                        </p>
                                        <div className="flex items-center justify-center space-x-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                                            <ShieldCheckIcon className="w-4 h-4" />
                                            <span>No email, no tracking, completely anonymous</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {errors.general && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-600">{errors.general}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-8 py-4 bg-gradient-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>{mode === 'login' ? 'Signing In...' : mode === 'signup' ? 'Creating Account...' : 'Starting Session...'}</span>
                                </div>
                            ) : (
                                mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Start Anonymous Session'
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <div className="flex justify-center space-x-4 mb-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('anonymous');
                                        setErrors({});
                                        setFormData({ username: '', email: '', password: '' });
                                    }}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'anonymous'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                >
                                    <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
                                    Anonymous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('login');
                                        setErrors({});
                                        setFormData({ username: '', email: '', password: '' });
                                    }}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'login'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('signup');
                                        setErrors({});
                                        setFormData({ username: '', email: '', password: '' });
                                    }}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'signup'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {mode === 'anonymous' && (
                                <p className="text-xs text-slate-500 mt-2">
                                    No personal information required. Your identity remains completely private.
                                </p>
                            )}
                        </div>

                        {/* Demo Note */}
                        <div className="mt-6 p-4 bg-blue-50/80 rounded-xl border border-blue-200/50">
                            <p className="text-xs text-center text-blue-700">
                                <SparklesIcon className="w-4 h-4 inline mr-1" />
                                Demo Mode: Any email/password combination will work
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthModal; 