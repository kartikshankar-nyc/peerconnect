import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    XMarkIcon,
    EyeIcon,
    EyeSlashIcon,
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { login, signup, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.username, formData.email, formData.password);
            }
            onClose();
        } catch (error) {
            setErrors({ general: 'Authentication failed. Please try again.' });
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
                                {isLogin ? 'Welcome Back' : 'Join PeerNexus'}
                            </h2>

                            <p className="text-center text-slate-600 text-sm">
                                {isLogin
                                    ? 'Continue your journey of connection and support'
                                    : 'Start your anonymous journey to healing and hope'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 pb-8">
                        <div className="space-y-5">
                            {!isLogin && (
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
                                            required={!isLogin}
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
                                    <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                                </div>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setErrors({});
                                    setFormData({ username: '', email: '', password: '' });
                                }}
                                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                {isLogin ? (
                                    <>Don't have an account? <span className="font-semibold text-blue-600">Sign up</span></>
                                ) : (
                                    <>Already have an account? <span className="font-semibold text-blue-600">Sign in</span></>
                                )}
                            </button>
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