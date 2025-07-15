import React, { useState, useEffect } from 'react';
import {
    PencilIcon,
    EyeIcon,
    EyeSlashIcon,
    CalendarIcon,
    ChartBarIcon,
    ShareIcon,
    SparklesIcon,
    HeartIcon,
    ArrowTrendingUpIcon,
    MoonIcon,
    SunIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';

interface DiaryEntry {
    id: string;
    content: string;
    emotions: {
        primary: string;
        secondary: string[];
        intensity: number;
        support_type: string;
        context: string;
        progress_indicators: string[];
        crisis_indicators: string[];
    };
    isPrivate: boolean;
    timestamp: string;
    mood_score: number;
}

interface EmotionalTrend {
    date: string;
    primary_emotion: string;
    intensity: number;
    mood_score: number;
}

const Diary: React.FC = () => {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [newEntry, setNewEntry] = useState('');
    const [isPrivateEntry, setIsPrivateEntry] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
    const [emotionalTrends, setEmotionalTrends] = useState<EmotionalTrend[]>([]);
    const [viewMode, setViewMode] = useState<'entries' | 'trends' | 'insights'>('entries');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDiaryEntries();
        loadEmotionalTrends();
    }, []);

    const loadDiaryEntries = async () => {
        try {
            // In a real implementation, this would fetch from the API
            // For now, we'll use demo data
            const demoEntries: DiaryEntry[] = [
                {
                    id: '1',
                    content: 'Today was challenging. I felt overwhelmed with work deadlines and struggled to focus. But I managed to complete two important tasks and took a walk during lunch which helped clear my mind.',
                    emotions: {
                        primary: 'overwhelmed',
                        secondary: ['anxious', 'accomplished'],
                        intensity: 0.7,
                        support_type: 'comfort',
                        context: 'reflecting',
                        progress_indicators: ['self-care', 'task completion'],
                        crisis_indicators: []
                    },
                    isPrivate: true,
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    mood_score: 6
                },
                {
                    id: '2',
                    content: 'Had a breakthrough today! Finally understood the concept that was confusing me for weeks. Feeling proud and motivated to keep learning.',
                    emotions: {
                        primary: 'accomplished',
                        secondary: ['proud', 'motivated'],
                        intensity: 0.8,
                        support_type: 'energy',
                        context: 'celebrating',
                        progress_indicators: ['breakthrough', 'learning'],
                        crisis_indicators: []
                    },
                    isPrivate: true,
                    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                    mood_score: 8
                }
            ];
            setEntries(demoEntries);
        } catch (error) {
            console.error('Error loading diary entries:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadEmotionalTrends = async () => {
        try {
            // Generate demo trend data for the past 7 days
            const trends: EmotionalTrend[] = [];
            const emotions = ['calm', 'anxious', 'accomplished', 'overwhelmed', 'hopeful', 'sad', 'grateful'];

            for (let i = 6; i >= 0; i--) {
                const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
                trends.push({
                    date: date.toISOString().split('T')[0],
                    primary_emotion: emotions[Math.floor(Math.random() * emotions.length)],
                    intensity: Math.random() * 0.6 + 0.4, // 0.4 to 1.0
                    mood_score: Math.floor(Math.random() * 4) + 5 // 5 to 8
                });
            }
            setEmotionalTrends(trends);
        } catch (error) {
            console.error('Error loading emotional trends:', error);
        }
    };

    const handleCreateEntry = async () => {
        if (!newEntry.trim()) return;

        setIsCreating(true);
        try {
            // Simulate API call for emotion analysis
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Demo emotion analysis
            const emotions = {
                primary: 'reflective',
                secondary: ['thoughtful'],
                intensity: 0.6,
                support_type: 'clarity',
                context: 'reflecting',
                progress_indicators: [],
                crisis_indicators: []
            };

            const entry: DiaryEntry = {
                id: Date.now().toString(),
                content: newEntry,
                emotions,
                isPrivate: isPrivateEntry,
                timestamp: new Date().toISOString(),
                mood_score: Math.floor(Math.random() * 4) + 5
            };

            setEntries(prev => [entry, ...prev]);
            setNewEntry('');
            setIsCreating(false);
        } catch (error) {
            console.error('Error creating diary entry:', error);
            setIsCreating(false);
        }
    };

    const shareEntry = async (entry: DiaryEntry) => {
        try {
            // Convert private entry to public post
            const sharedEntry = { ...entry, isPrivate: false };
            setEntries(prev => prev.map(e => e.id === entry.id ? sharedEntry : e));
            // In real implementation, this would create a public post
            console.log('Entry shared to community:', sharedEntry);
        } catch (error) {
            console.error('Error sharing entry:', error);
        }
    };

    const getEmotionColor = (emotion: string) => {
        const emotionMap: { [key: string]: string } = {
            joy: 'text-yellow-700 bg-yellow-100 border-yellow-200',
            hope: 'text-blue-700 bg-blue-100 border-blue-200',
            gratitude: 'text-green-700 bg-green-100 border-green-200',
            relief: 'text-teal-700 bg-teal-100 border-teal-200',
            sadness: 'text-blue-700 bg-blue-100 border-blue-200',
            anxiety: 'text-orange-700 bg-orange-100 border-orange-200',
            loneliness: 'text-purple-700 bg-purple-100 border-purple-200',
            frustration: 'text-red-700 bg-red-100 border-red-200',
            overwhelmed: 'text-red-700 bg-red-100 border-red-200',
            confusion: 'text-indigo-700 bg-indigo-100 border-indigo-200',
            accomplished: 'text-emerald-700 bg-emerald-100 border-emerald-200',
            reflective: 'text-slate-700 bg-slate-100 border-slate-200'
        };
        return emotionMap[emotion.toLowerCase()] || 'text-slate-700 bg-slate-100 border-slate-200';
    };

    const getMoodIcon = (score: number) => {
        if (score >= 8) return <SunIcon className="w-5 h-5 text-yellow-500" />;
        if (score >= 6) return <HeartIcon className="w-5 h-5 text-green-500" />;
        return <MoonIcon className="w-5 h-5 text-blue-500" />;
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Diary</h1>
                    <p className="text-slate-600">Your private space for reflection, growth, and emotional awareness</p>
                </div>

                {/* View Mode Tabs */}
                <div className="mb-8">
                    <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                        <button
                            onClick={() => setViewMode('entries')}
                            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${viewMode === 'entries'
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Entries
                        </button>
                        <button
                            onClick={() => setViewMode('trends')}
                            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${viewMode === 'trends'
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <ChartBarIcon className="w-4 h-4 mr-2" />
                            Trends
                        </button>
                        <button
                            onClick={() => setViewMode('insights')}
                            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${viewMode === 'insights'
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            Insights
                        </button>
                    </div>
                </div>

                {/* Entries View */}
                {viewMode === 'entries' && (
                    <div className="space-y-6">
                        {/* Create New Entry */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">New Entry</h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setIsPrivateEntry(!isPrivateEntry)}
                                        className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${isPrivateEntry
                                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                                            }`}
                                    >
                                        {isPrivateEntry ? (
                                            <EyeSlashIcon className="w-4 h-4 mr-1" />
                                        ) : (
                                            <EyeIcon className="w-4 h-4 mr-1" />
                                        )}
                                        {isPrivateEntry ? 'Private' : 'Shareable'}
                                    </button>
                                </div>
                            </div>

                            <textarea
                                value={newEntry}
                                onChange={(e) => setNewEntry(e.target.value)}
                                placeholder="How are you feeling today? What's on your mind?"
                                className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                disabled={isCreating}
                            />

                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleCreateEntry}
                                    disabled={!newEntry.trim() || isCreating}
                                    className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {isCreating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <PencilIcon className="w-4 h-4 mr-2" />
                                            Create Entry
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Entries List */}
                        <div className="space-y-4">
                            {entries.map((entry) => (
                                <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    {/* Entry Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-2">
                                                <CalendarIcon className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-600">
                                                    {new Date(entry.timestamp).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                {getMoodIcon(entry.mood_score)}
                                                <span className="text-sm text-slate-600">{entry.mood_score}/10</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {entry.isPrivate ? (
                                                <EyeSlashIcon className="w-4 h-4 text-slate-400" />
                                            ) : (
                                                <EyeIcon className="w-4 h-4 text-primary-500" />
                                            )}
                                            {entry.isPrivate && (
                                                <button
                                                    onClick={() => shareEntry(entry)}
                                                    className="p-1 text-slate-400 hover:text-primary-600 transition-colors duration-200"
                                                    title="Share to community"
                                                >
                                                    <ShareIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Entry Content */}
                                    <p className="text-slate-700 mb-4 leading-relaxed">{entry.content}</p>

                                    {/* Emotion Analysis */}
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                        <div className="flex items-center mb-3">
                                            <SparklesIcon className="w-4 h-4 text-primary-500 mr-2" />
                                            <span className="text-sm font-medium text-slate-700">Emotion Analysis</span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getEmotionColor(entry.emotions.primary)}`}>
                                                <div className="w-1.5 h-1.5 bg-current rounded-full mr-1.5 opacity-60"></div>
                                                {entry.emotions.primary}
                                            </div>
                                            <div className="text-xs text-slate-600 flex items-center">
                                                <span className="capitalize">{entry.emotions.support_type}</span>
                                            </div>
                                            <div className="text-xs text-slate-600 flex items-center">
                                                <span className="capitalize">{entry.emotions.context}</span>
                                            </div>
                                            <div className="text-xs text-slate-600 flex items-center">
                                                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                                                {Math.round(entry.emotions.intensity * 100)}%
                                            </div>
                                        </div>

                                        {entry.emotions.progress_indicators.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1">
                                                {entry.emotions.progress_indicators.map((indicator, index) => (
                                                    <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                                        {indicator}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trends View */}
                {viewMode === 'trends' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6">Emotional Trends (Past 7 Days)</h2>

                        <div className="space-y-4">
                            {emotionalTrends.map((trend, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm font-medium text-slate-600 min-w-[80px]">
                                            {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(trend.primary_emotion)}`}>
                                            <div className="w-2 h-2 bg-current rounded-full mr-2 opacity-60"></div>
                                            {trend.primary_emotion}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-slate-600">Intensity:</span>
                                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary-500 rounded-full"
                                                    style={{ width: `${trend.intensity * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {getMoodIcon(trend.mood_score)}
                                            <span className="text-sm text-slate-600">{trend.mood_score}/10</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Insights View */}
                {viewMode === 'insights' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Personal Insights</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="font-medium text-blue-900 mb-2">Most Common Emotion</h3>
                                    <p className="text-blue-700">Overwhelmed</p>
                                    <p className="text-sm text-blue-600 mt-1">Consider stress management techniques</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h3 className="font-medium text-green-900 mb-2">Progress Patterns</h3>
                                    <p className="text-green-700">Self-care activities</p>
                                    <p className="text-sm text-green-600 mt-1">Keep up the great work!</p>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <h3 className="font-medium text-amber-900 mb-2">Average Mood Score</h3>
                                    <p className="text-amber-700">6.8/10</p>
                                    <p className="text-sm text-amber-600 mt-1">Trending upward this week</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <h3 className="font-medium text-purple-900 mb-2">Growth Areas</h3>
                                    <p className="text-purple-700">Time management</p>
                                    <p className="text-sm text-purple-600 mt-1">Focus on breaking tasks into smaller steps</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Diary; 