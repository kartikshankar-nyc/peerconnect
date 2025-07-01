import React, { useState } from 'react';
import {
    UserIcon,
    HeartIcon,
    ChatBubbleLeftRightIcon,
    SparklesIcon,
    CalendarIcon,
    TrophyIcon,
    FireIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <UserIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-heading-lg text-slate-600 mb-2">Please sign in</h2>
                    <p className="text-body-md text-slate-500">You need to be signed in to view your profile.</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: SparklesIcon },
        { id: 'activity', label: 'Activity', icon: ChatBubbleLeftRightIcon },
        { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
    ];

    const achievements = [
        {
            id: 1,
            title: 'First Connection',
            description: 'Made your first meaningful connection',
            icon: HeartIcon,
            earned: true,
            color: 'from-pink-500 to-rose-500'
        },
        {
            id: 2,
            title: 'Empathy Leader',
            description: 'Reached 80% empathy score',
            icon: StarIcon,
            earned: user.empathyScore >= 80,
            color: 'from-yellow-500 to-orange-500'
        },
        {
            id: 3,
            title: 'Community Builder',
            description: 'Helped 10+ community members',
            icon: UserIcon,
            earned: false,
            color: 'from-blue-500 to-indigo-500'
        },
        {
            id: 4,
            title: 'Hope Bringer',
            description: 'Created 5 Hope Threads',
            icon: FireIcon,
            earned: false,
            color: 'from-emerald-500 to-teal-500'
        },
    ];

    const stats = [
        { label: 'Empathy Score', value: `${user.empathyScore}%`, icon: HeartIcon, color: 'text-pink-600' },
        { label: 'Posts Shared', value: '8', icon: ChatBubbleLeftRightIcon, color: 'text-blue-600' },
        { label: 'Connections Made', value: '12', icon: UserIcon, color: 'text-emerald-600' },
        { label: 'Days Active', value: '15', icon: CalendarIcon, color: 'text-purple-600' },
    ];

    const joinedDate = new Date(user.joinedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Compact Header Card */}
                <div className="card-premium p-6 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                                <UserIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                <SparklesIcon className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-heading-lg text-slate-900 mb-1">
                                        {user.username}
                                    </h1>
                                    <p className="text-body-sm text-slate-600 mb-2">
                                        Anonymous Community Member since {joinedDate}
                                    </p>
                                    <div className="flex items-center space-x-4 text-body-sm">
                                        <div className="flex items-center space-x-2">
                                            <HeartIcon className="w-4 h-4 text-pink-500" />
                                            <span className="text-slate-700 font-medium">
                                                {user.empathyScore}% Empathy Score
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <TrophyIcon className="w-4 h-4 text-yellow-500" />
                                            <span className="text-slate-700 font-medium">
                                                {achievements.filter(a => a.earned).length} Achievements
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4 mt-4 sm:mt-0">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-slate-900">8</div>
                                        <div className="text-xs text-slate-500">Posts</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-slate-900">12</div>
                                        <div className="text-xs text-slate-500">Connections</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-slate-200/60">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-body-sm transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'overview' && (
                        <>
                            {/* Empathy Journey */}
                            <div className="card-premium p-6">
                                <h3 className="text-heading-lg text-slate-900 mb-6 flex items-center">
                                    <HeartIcon className="w-6 h-6 text-pink-500 mr-3" />
                                    Your Empathy Journey
                                </h3>

                                <div className="space-y-6">
                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-body-sm font-medium text-slate-700">
                                                Empathy Score Progress
                                            </span>
                                            <span className="text-body-sm font-bold text-slate-900">
                                                {user.empathyScore}%
                                            </span>
                                        </div>
                                        <div className="progress-container">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill bg-gradient-to-r from-pink-400 to-pink-600"
                                                    style={{ width: `${user.empathyScore}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                                            <span>Beginner</span>
                                            <span>Expert</span>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {stats.map((stat, index) => {
                                            const Icon = stat.icon;
                                            return (
                                                <div key={index} className="bg-slate-50/80 rounded-xl p-4 text-center">
                                                    <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                                                    <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                                                    <div className="text-xs text-slate-600">{stat.label}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'activity' && (
                        <div className="card-premium p-6">
                            <h3 className="text-heading-lg text-slate-900 mb-6 flex items-center">
                                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500 mr-3" />
                                Recent Activity
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { action: 'Shared a post', community: 'Solo Entrepreneurs', time: '2 hours ago', type: 'post' },
                                    { action: 'Supported a member', community: 'ADHD Support Circle', time: '1 day ago', type: 'support' },
                                    { action: 'Joined community', community: 'Career Transition Warriors', time: '3 days ago', type: 'join' },
                                    { action: 'Created Hope Thread', community: 'New City New Me', time: '1 week ago', type: 'hope' },
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50/80 rounded-xl">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === 'post' ? 'bg-blue-100 text-blue-600' :
                                            activity.type === 'support' ? 'bg-emerald-100 text-emerald-600' :
                                                activity.type === 'join' ? 'bg-purple-100 text-purple-600' :
                                                    'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {activity.type === 'post' && <ChatBubbleLeftRightIcon className="w-5 h-5" />}
                                            {activity.type === 'support' && <HeartIcon className="w-5 h-5" />}
                                            {activity.type === 'join' && <UserIcon className="w-5 h-5" />}
                                            {activity.type === 'hope' && <SparklesIcon className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-body-sm font-medium text-slate-900">
                                                {activity.action} in <span className="text-blue-600">{activity.community}</span>
                                            </p>
                                            <p className="text-caption text-slate-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'achievements' && (
                        <div className="card-premium p-6">
                            <h3 className="text-heading-lg text-slate-900 mb-6 flex items-center">
                                <TrophyIcon className="w-6 h-6 text-yellow-500 mr-3" />
                                Achievements
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {achievements.map((achievement) => {
                                    const Icon = achievement.icon;
                                    return (
                                        <div
                                            key={achievement.id}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${achievement.earned
                                                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-sm'
                                                : 'bg-slate-50/50 border-slate-200 opacity-60'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${achievement.earned
                                                    ? `bg-gradient-to-br ${achievement.color} shadow-md`
                                                    : 'bg-slate-200'
                                                    }`}>
                                                    <Icon className={`w-6 h-6 ${achievement.earned ? 'text-white' : 'text-slate-400'}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`font-semibold mb-1 ${achievement.earned ? 'text-slate-900' : 'text-slate-500'
                                                        }`}>
                                                        {achievement.title}
                                                        {achievement.earned && (
                                                            <span className="ml-2 text-yellow-500">✨</span>
                                                        )}
                                                    </h4>
                                                    <p className={`text-sm ${achievement.earned ? 'text-slate-600' : 'text-slate-400'
                                                        }`}>
                                                        {achievement.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 