import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    HeartIcon,
    SparklesIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
    PlayIcon,
    CheckIcon,
    PlusIcon,
    ChartBarIcon,
    ClockIcon,
    FireIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

const Home: React.FC = () => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Static community data for landing page (no API calls needed)
    const featuredCommunities = [
        {
            id: '1',
            name: 'Solo Entrepreneurs',
            description: 'Connect with fellow entrepreneurs navigating the challenges of building alone.',
            member_count: 2847,
            post_count: 1203
        },
        {
            id: '2',
            name: 'ADHD Support Circle',
            description: 'Understanding, strategies, and support for those with ADHD.',
            member_count: 1923,
            post_count: 892
        },
        {
            id: '3',
            name: 'New City New Me',
            description: 'Finding community and belonging when starting fresh in a new place.',
            member_count: 1456,
            post_count: 634
        }
    ];

    // Dashboard data for authenticated users
    const dashboardStats = [
        { label: 'Your Empathy Score', value: user?.empathyScore || 0, icon: HeartIcon, color: 'text-red-600' },
        { label: 'Posts Shared', value: '3', icon: ChatBubbleLeftRightIcon, color: 'text-blue-600' },
        { label: 'Support Given', value: '12', icon: SparklesIcon, color: 'text-purple-600' },
        { label: 'Communities Joined', value: '2', icon: UserGroupIcon, color: 'text-emerald-600' }
    ];

    const recentActivity = [
        { action: 'Shared a post in Solo Entrepreneurs', time: '2 hours ago', type: 'post' },
        { action: 'Received support on "Feeling overwhelmed"', time: '4 hours ago', type: 'support' },
        { action: 'Joined ADHD Support Circle', time: '1 day ago', type: 'join' },
        { action: 'Helped someone in Career Transition', time: '2 days ago', type: 'help' }
    ];

    const suggestedCommunities = [
        { name: 'Relationship Rebuilders', members: 3298, reason: 'Based on your interests' },
        { name: 'Career Transition Warriors', members: 2634, reason: 'Popular in your area' }
    ];

    const features = [
        {
            icon: ShieldCheckIcon,
            title: 'Anonymous & Safe',
            description: 'Share your story without revealing your identity. Complete privacy guaranteed.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: SparklesIcon,
            title: 'AI-Powered Empathy',
            description: 'Advanced emotion analysis connects you with the most supportive community members.',
            color: 'from-violet-500 to-purple-500'
        },
        {
            icon: HeartIcon,
            title: 'Hope Threads',
            description: 'Our unique algorithm identifies posts with highest potential for meaningful support.',
            color: 'from-red-500 to-pink-500'
        },
        {
            icon: UserGroupIcon,
            title: 'Curated Communities',
            description: 'Join specialized support groups tailored to your specific challenges and experiences.',
            color: 'from-emerald-500 to-teal-500'
        }
    ];

    const stats = [
        { value: '10K+', label: 'Anonymous Members', icon: UserGroupIcon },
        { value: '85%', label: 'Find Support', icon: HeartIcon },
        { value: '24/7', label: 'Community Active', icon: ChatBubbleLeftRightIcon },
        { value: '100%', label: 'Privacy Protected', icon: ShieldCheckIcon }
    ];

    // Feature rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [features.length]);

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Authenticated User Dashboard
    if (isAuthenticated && user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-emerald-50/20 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/3 to-pink-400/3 rounded-full blur-3xl animate-pulse"></div>

                {/* Welcome Section */}
                <section className="pt-8 pb-12 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Hero Welcome Card */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 p-1 mb-8 shadow-2xl">
                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                <HeartIcon className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h1 className="text-display-lg text-neutral-900 mb-1">
                                                    Welcome back, <span className="text-gradient-primary font-bold">{user.username}</span>
                                                </h1>
                                                <p className="text-body-lg text-neutral-600">
                                                    Your journey to healing continues. Here's what's happening in your communities.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quick Stats Bar */}
                                        <div className="flex items-center space-x-6 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-neutral-600">Active now</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <SparklesIcon className="w-4 h-4 text-purple-600" />
                                                <span className="text-neutral-600">Empathy Score: <span className="font-semibold text-purple-700">{user.empathyScore}</span></span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <ClockIcon className="w-4 h-4 text-blue-600" />
                                                <span className="text-neutral-600">Member since {new Date(user.joinedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex items-center space-x-4">
                                        <Link to="/create" className="btn-primary px-6 py-3 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                            <PlusIcon className="w-5 h-5" />
                                            <span>Share Your Story</span>
                                        </Link>
                                        <Link to="/feed" className="btn-secondary px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                            Browse Feed
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {dashboardStats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="group">
                                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-neutral-50/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 border border-neutral-200/50">
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <div className="relative z-10 text-center">
                                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-md group-hover:shadow-lg transition-all duration-300 ${stat.color}`}>
                                                    <Icon className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                                                </div>
                                                <div className="text-display-sm text-neutral-900 font-bold mb-1 group-hover:text-blue-700 transition-colors duration-300">{stat.value}</div>
                                                <div className="text-body-sm text-neutral-600 font-medium">{stat.label}</div>
                                            </div>

                                            {/* Animated border */}
                                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-500"></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Enhanced Recent Activity */}
                            <div className="lg:col-span-2">
                                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-neutral-50/30 p-8 shadow-xl border border-neutral-200/50">
                                    {/* Header with gradient */}
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-heading-lg text-neutral-900 flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                                <ClockIcon className="w-5 h-5 text-white" />
                                            </div>
                                            Recent Activity
                                        </h2>
                                        <Link to="/feed" className="text-primary-600 hover:text-primary-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-300">
                                            View All →
                                        </Link>
                                    </div>

                                    <div className="space-y-4">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="group">
                                                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-gradient-to-r from-neutral-50 to-white hover:from-blue-50 hover:to-emerald-50 transition-all duration-300 border border-neutral-100 hover:border-blue-200 hover:shadow-md">
                                                    <div className={`w-3 h-3 rounded-full mt-3 shadow-sm ${activity.type === 'post' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                                            activity.type === 'support' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                                                activity.type === 'join' ? 'bg-gradient-to-r from-purple-500 to-violet-600' : 'bg-gradient-to-r from-orange-500 to-red-500'
                                                        }`}></div>
                                                    <div className="flex-1">
                                                        <p className="text-body-md text-neutral-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">{activity.action}</p>
                                                        <p className="text-body-sm text-neutral-500">{activity.time}</p>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <ArrowRightIcon className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Sidebar */}
                            <div className="space-y-8">
                                {/* Quick Actions with better styling */}
                                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-red-50/30 p-6 shadow-xl border border-orange-200/50">
                                    <h3 className="text-heading-md text-neutral-900 mb-6 flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                                            <FireIcon className="w-4 h-4 text-white" />
                                        </div>
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-4">
                                        <Link to="/create" className="w-full btn-primary text-sm py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                            <PlusIcon className="w-4 h-4 mr-2" />
                                            Share Your Story
                                        </Link>
                                        <Link to="/feed" className="w-full btn-secondary text-sm py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                                            Browse Community Feed
                                        </Link>
                                        <button className="w-full btn-ghost text-sm py-3 border-2 border-dashed border-neutral-300 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300">
                                            <UserGroupIcon className="w-4 h-4 mr-2" />
                                            Find Support Groups
                                        </button>
                                    </div>
                                </div>

                                {/* Enhanced Suggested Communities */}
                                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/30 p-6 shadow-xl border border-emerald-200/50">
                                    <h3 className="text-heading-md text-neutral-900 mb-6 flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                                            <ChartBarIcon className="w-4 h-4 text-white" />
                                        </div>
                                        Suggested Communities
                                    </h3>
                                    <div className="space-y-4">
                                        {suggestedCommunities.map((community, index) => (
                                            <div key={index} className="group">
                                                <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-white to-emerald-50/50 border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                                    {/* Animated background */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                    <div className="relative z-10">
                                                        <h4 className="text-body-md font-semibold text-neutral-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">{community.name}</h4>
                                                        <p className="text-body-sm text-neutral-600 mb-2">{community.members.toLocaleString()} members</p>
                                                        <p className="text-body-xs text-emerald-600 mb-4 font-medium">{community.reason}</p>
                                                        <button className="w-full btn-secondary text-xs py-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group-hover:bg-emerald-100 group-hover:border-emerald-300">
                                                            Join Community
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* New: Progress Overview Card */}
                                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50/30 p-6 shadow-xl border border-purple-200/50">
                                    <h3 className="text-heading-md text-neutral-900 mb-6 flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                                            <SparklesIcon className="w-4 h-4 text-white" />
                                        </div>
                                        Your Journey
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-neutral-600">Empathy Growth</span>
                                            <span className="text-sm font-semibold text-purple-700">{user.empathyScore}%</span>
                                        </div>
                                        <div className="w-full bg-neutral-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${user.empathyScore}%` }}
                                            ></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <div className="text-center p-3 bg-white rounded-xl border border-purple-100">
                                                <div className="text-lg font-bold text-purple-700">12</div>
                                                <div className="text-xs text-neutral-600">Helped</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-xl border border-pink-100">
                                                <div className="text-lg font-bold text-pink-700">3</div>
                                                <div className="text-xs text-neutral-600">Posts</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // Unauthenticated Landing Page
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/30"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center animate-fade-in">
                        {/* Demo Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary text-white text-sm font-semibold mb-8 shadow-lg">
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            Demo Mode - Experience Anonymous Support
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-display-xl text-neutral-900 mb-6 animate-slide-up">
                            You're Not Alone in Your
                            <span className="text-gradient-primary block mt-2">
                                Journey to Healing
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            Connect with others who understand your struggles through anonymous, AI-powered community support.
                            Share your story, find hope, and discover you're part of something bigger.
                        </p>

                        {/* CTA Buttons - Only show unauthenticated options */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="btn-primary px-8 py-4 text-lg font-bold flex items-center space-x-3 group"
                            >
                                <span>Start Your Journey</span>
                                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </button>

                            <button className="btn-secondary px-8 py-4 text-lg font-semibold flex items-center space-x-3 group">
                                <PlayIcon className="w-5 h-5" />
                                <span>Watch Demo</span>
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap justify-center items-center gap-8 text-neutral-500 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                            <div className="flex items-center space-x-2">
                                <CheckIcon className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-medium">100% Anonymous</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckIcon className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-medium">AI-Powered Matching</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckIcon className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-medium">24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white/60 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 animate-stagger">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center group">
                                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-display-sm text-neutral-900 font-bold mb-2">{stat.value}</div>
                                    <div className="text-body-sm text-neutral-600 font-medium">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white to-neutral-50"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 animate-fade-in">
                        <h2 className="text-display-md text-neutral-900 mb-6">
                            Powered by <span className="text-gradient-primary">Innovation</span>
                        </h2>
                        <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
                            Our cutting-edge technology creates meaningful connections while protecting your privacy.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Feature Cards */}
                        <div className="space-y-6 animate-stagger">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                const isActive = index === activeFeature;

                                return (
                                    <div
                                        key={index}
                                        className={`card-premium p-6 cursor-pointer transition-all duration-500 ${isActive ? 'shadow-glow scale-105 border-primary-200' : 'hover:shadow-lg'
                                            }`}
                                        onClick={() => setActiveFeature(index)}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${feature.color}`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-heading-md text-neutral-900 mb-2">{feature.title}</h3>
                                                <p className="text-body-sm text-neutral-600 leading-relaxed">{feature.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feature Visualization */}
                        <div className="relative">
                            <div className="card-glass p-8 text-center">
                                <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br ${features[activeFeature].color}`}>
                                    {React.createElement(features[activeFeature].icon, { className: "w-12 h-12 text-white" })}
                                </div>
                                <h3 className="text-heading-lg text-neutral-900 mb-4">{features[activeFeature].title}</h3>
                                <p className="text-body-md text-neutral-600 mb-6">{features[activeFeature].description}</p>
                                <div className="flex justify-center space-x-2">
                                    {features.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeFeature ? 'bg-primary-500 w-8' : 'bg-neutral-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Communities Preview - Static data, no loading states */}
            <section className="py-32 bg-gradient-to-br from-neutral-50 to-blue-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-display-md text-neutral-900 mb-6">
                            Featured <span className="text-gradient-accent">Communities</span>
                        </h2>
                        <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
                            Join supportive groups tailored to your unique experiences and challenges.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 animate-stagger">
                        {featuredCommunities.map((community, index) => (
                            <div key={community.id} className="card-floating p-6 text-center group">
                                <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300">
                                    <UserGroupIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-heading-md text-neutral-900 mb-3">{community.name}</h3>
                                <p className="text-body-sm text-neutral-600 mb-6 leading-relaxed">{community.description}</p>
                                <div className="flex justify-center space-x-6 text-xs text-neutral-500 mb-6">
                                    <span className="flex items-center">
                                        <UserGroupIcon className="w-4 h-4 mr-1" />
                                        {community.member_count.toLocaleString()} members
                                    </span>
                                    <span className="flex items-center">
                                        <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                                        {community.post_count} posts
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="btn-secondary w-full group-hover:bg-primary-100 group-hover:border-primary-300"
                                >
                                    Join Community
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12 animate-slide-up">
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="btn-primary px-8 py-3"
                        >
                            Get Started Today
                        </button>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-primary"></div>
                <div className="absolute inset-0 bg-black/10"></div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <div className="animate-fade-in">
                        <h2 className="text-display-md mb-6">
                            Ready to Begin Your Healing Journey?
                        </h2>
                        <p className="text-body-lg mb-12 opacity-90">
                            Join thousands who have found support, hope, and community through PeerNexus.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="btn-secondary text-primary-700 bg-white hover:bg-neutral-50"
                            >
                                Get Started Now
                            </button>
                            <button className="btn-ghost border-white/30 text-white hover:bg-white/10">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
};

export default Home; 