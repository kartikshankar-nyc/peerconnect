import React, { useState } from 'react';
import {
    HeartIcon,
    ChatBubbleOvalLeftIcon,
    ShareIcon,
    SparklesIcon,
    FireIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import {
    HeartIcon as HeartIconSolid,
    StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';
import { Post } from '../services/apiService'

interface PostCardProps {
    post: Post
    onCommunityFilter?: (communityId: string) => void;
    communityName?: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onCommunityFilter, communityName }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const getEmpathyLevel = (score: number) => {
        if (score >= 0.9) return { level: 'very-high', label: 'Hope Thread', color: 'text-amber-700 bg-amber-100 border-amber-200' };
        if (score >= 0.8) return { level: 'high', label: 'High Empathy', color: 'text-blue-700 bg-blue-100 border-blue-200' };
        if (score >= 0.7) return { level: 'moderate', label: 'Supportive', color: 'text-emerald-700 bg-emerald-100 border-emerald-200' };
        return { level: 'low', label: 'Sharing', color: 'text-slate-700 bg-slate-100 border-slate-200' };
    };

    const getEmotionColor = (emotion: string) => {
        const emotionMap: { [key: string]: string } = {
            'overwhelmed': 'text-red-700 bg-red-100 border-red-200',
            'lonely': 'text-indigo-700 bg-indigo-100 border-indigo-200',
            'loneliness': 'text-indigo-700 bg-indigo-100 border-indigo-200',
            'hopeful': 'text-blue-700 bg-blue-100 border-blue-200',
            'hope': 'text-blue-700 bg-blue-100 border-blue-200',
            'anxious': 'text-orange-700 bg-orange-100 border-orange-200',
            'anxiety': 'text-orange-700 bg-orange-100 border-orange-200',
            'proud': 'text-purple-700 bg-purple-100 border-purple-200',
            'grateful': 'text-emerald-700 bg-emerald-100 border-emerald-200',
            'gratitude': 'text-emerald-700 bg-emerald-100 border-emerald-200',
            'grief': 'text-slate-700 bg-slate-100 border-slate-200',
            'sadness': 'text-slate-700 bg-slate-100 border-slate-200',
            'liberated': 'text-teal-700 bg-teal-100 border-teal-200',
            'vulnerable': 'text-pink-700 bg-pink-100 border-pink-200',
            'accomplished': 'text-green-700 bg-green-100 border-green-200',
            'relieved': 'text-violet-700 bg-violet-100 border-violet-200',
            'joy': 'text-yellow-700 bg-yellow-100 border-yellow-200',
            'determination': 'text-green-700 bg-green-100 border-green-200'
        };
        return emotionMap[emotion.toLowerCase()] || 'text-slate-700 bg-slate-100 border-slate-200';
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    const empathyInfo = getEmpathyLevel(post.empathyPotentialScore);

    const shouldTruncate = post.content.length > 280;
    const displayContent = shouldTruncate && !isExpanded
        ? post.content.substring(0, 280) + '...'
        : post.content;

    return (
        <article className="card-floating">
            {/* Hope Thread Indicator */}
            {empathyInfo?.level === 'very-high' && (
                <div className="absolute -top-2 -right-2 w-8pt-4 h-8pt-4 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <FireIcon className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Header */}
            <header className="flex items-start justify-between mb-8pt-3">
                <div className="flex items-center gap-8pt-2">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-8pt-5 h-8pt-5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-body-sm">
                                {post.authorName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8pt-2 h-8pt-2 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-8pt-1 h-8pt-1 bg-green-400 rounded-full"></div>
                        </div>
                    </div>

                    {/* Author Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-8pt-1">
                            <h3 className="text-body-md font-semibold text-neutral-900 truncate">
                                {post.authorName}
                            </h3>
                            <span className="text-neutral-400">•</span>
                            <time className="text-body-sm text-neutral-500 flex-shrink-0">
                                {formatTimeAgo(post.createdAt)}
                            </time>
                        </div>

                        {/* Community Badge */}
                        {communityName && (
                            <button
                                onClick={() => onCommunityFilter?.(post.communityId)}
                                className="inline-flex items-center mt-8pt-1 px-8pt-1 py-0.5 rounded-full text-caption font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors duration-200"
                            >
                                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-1.5"></span>
                                {communityName}
                            </button>
                        )}
                    </div>
                </div>

                {/* Bookmark Button */}
                <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="p-8pt-1 rounded-xl hover:bg-neutral-100 transition-all duration-200"
                >
                    {isBookmarked ? (
                        <StarIconSolid className="w-5 h-5 text-amber-500" />
                    ) : (
                        <StarIcon className="w-5 h-5 text-neutral-400 hover:text-amber-500" />
                    )}
                </button>
            </header>

            {/* Content */}
            <div className="mb-8pt-4">
                <p className="text-body-md text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {displayContent}
                </p>

                {shouldTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-8pt-2 text-primary-600 hover:text-primary-700 font-medium text-body-sm transition-colors duration-200"
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>

            {/* Emotion Analysis */}
            {post.emotions && Object.keys(post.emotions).length > 0 && (
                <div className="mb-8pt-4 p-8pt-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div className="flex items-center justify-between mb-8pt-3">
                        <h4 className="text-body-sm font-semibold text-neutral-900 flex items-center">
                            <SparklesIcon className="w-4 h-4 mr-8pt-1 text-primary-500" />
                            AI Emotion Analysis
                        </h4>
                        <div className="flex items-center gap-8pt-1">
                            <div className="w-8pt-1 h-8pt-1 bg-primary-400 rounded-full animate-pulse"></div>
                            <span className="text-caption text-neutral-500 font-medium">Live Analysis</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8pt-3">
                        {/* Primary Emotion */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Primary Emotion</label>
                            <div className={`inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium ${getEmotionColor(post.primaryEmotion)}`}>
                                <div className="w-2 h-2 bg-current rounded-full mr-2 opacity-60"></div>
                                <span className="capitalize">{post.primaryEmotion}</span>
                            </div>
                        </div>

                        {/* Secondary Emotions */}
                        {Object.keys(post.emotions).filter(e => e !== post.primaryEmotion).length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Secondary</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(post.emotions).filter(e => e !== post.primaryEmotion).map((emotion, index) => (
                                        <div key={index} className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-medium ${getEmotionColor(emotion)}`}>
                                            <div className="w-1.5 h-1.5 bg-current rounded-full mr-1.5 opacity-40"></div>
                                            <span className="capitalize">{emotion}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Intensity */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Intensity</label>
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.round(post.emotions[post.primaryEmotion] * 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 min-w-[2.5rem]">
                                    {Math.round(post.emotions[post.primaryEmotion] * 100)}%
                                </span>
                            </div>
                        </div>

                        {/* Empathy Potential */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Empathy Potential</label>
                            <div className="flex items-center space-x-3">
                                <div className={`flex items-center px-3 py-2 rounded-lg border text-sm font-medium ${empathyInfo?.color}`}>
                                    <FireIcon className="w-4 h-4 mr-2" />
                                    <span>{empathyInfo?.label}</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-700">
                                    {Math.round(post.empathyPotentialScore * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <footer className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-4">
                    {/* Like Button */}
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${isLiked
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-red-600'
                            }`}
                    >
                        {isLiked ? (
                            <HeartIconSolid className="w-5 h-5" />
                        ) : (
                            <HeartIcon className="w-5 h-5" />
                        )}
                        <span>Support</span>
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                            {post.reactions || 0}
                        </span>
                    </button>

                    {/* Comment Button */}
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200">
                        <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                        <span>Connect</span>
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                            {Math.floor((post.reactions || 0) * 0.3)}
                        </span>
                    </button>
                </div>

                {/* Share Button */}
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all duration-200">
                    <ShareIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Share</span>
                </button>
            </footer>
        </article>
    );
};

export default PostCard; 