import React, { useState, useRef } from 'react';
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
import { ExclamationTriangleIcon, TrophyIcon } from '@heroicons/react/24/outline';
import HugAnimation from './HugAnimation';

interface PostCardProps {
    post: Post
    onCommunityFilter?: (communityId: string) => void;
    communityName?: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onCommunityFilter, communityName }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showShareConfirmation, setShowShareConfirmation] = useState(false);
    const [showHugAnimation, setShowHugAnimation] = useState(false);
    const [hugTriggerPosition, setHugTriggerPosition] = useState({ x: 0, y: 0 });
    const [reactionCount, setReactionCount] = useState(post.reactions || 0);
    const heartButtonRef = useRef<HTMLButtonElement>(null);

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

    const getSupportTypeColor = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'comfort': 'text-blue-700 bg-blue-100 border-blue-200',
            'energy': 'text-orange-700 bg-orange-100 border-orange-200',
            'clarity': 'text-purple-700 bg-purple-100 border-purple-200',
            'solidarity': 'text-emerald-700 bg-emerald-100 border-emerald-200'
        };
        return typeMap[type.toLowerCase()] || 'text-slate-700 bg-slate-100 border-slate-200';
    };

    const getSupportTypeIcon = (type: string) => {
        const iconMap: { [key: string]: string } = {
            'comfort': 'bg-blue-400',
            'energy': 'bg-orange-400',
            'clarity': 'bg-purple-400',
            'solidarity': 'bg-emerald-400'
        };
        return iconMap[type.toLowerCase()] || 'bg-slate-400';
    };

    const getContextColor = (context: string) => {
        const contextMap: { [key: string]: string } = {
            'sharing': 'text-blue-700 bg-blue-100 border-blue-200',
            'seeking': 'text-amber-700 bg-amber-100 border-amber-200',
            'reflecting': 'text-indigo-700 bg-indigo-100 border-indigo-200',
            'celebrating': 'text-green-700 bg-green-100 border-green-200'
        };
        return contextMap[context.toLowerCase()] || 'text-slate-700 bg-slate-100 border-slate-200';
    };

    const getContextIcon = (context: string) => {
        const iconMap: { [key: string]: string } = {
            'sharing': 'bg-blue-400',
            'seeking': 'bg-amber-400',
            'reflecting': 'bg-indigo-400',
            'celebrating': 'bg-green-400'
        };
        return iconMap[context.toLowerCase()] || 'bg-slate-400';
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    const handleShare = async () => {
        const shareText = `"${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}" - Shared from PeerConnect Community\n\nJoin the conversation at ${window.location.origin}`;

        try {
            if (navigator.share) {
                // Use native share API if available (mobile devices)
                await navigator.share({
                    title: `Post by ${post.authorName}`,
                    text: shareText,
                    url: window.location.href
                });
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareText);
                setShowShareConfirmation(true);
                setTimeout(() => setShowShareConfirmation(false), 2000);
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setShowShareConfirmation(true);
            setTimeout(() => setShowShareConfirmation(false), 2000);
        }
    };

    const handleHeartClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isLiked && heartButtonRef.current) {
            // Get button position for animation trigger
            const rect = heartButtonRef.current.getBoundingClientRect();
            setHugTriggerPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
            setShowHugAnimation(true);
        } else {
            // If already liked, just toggle immediately
            setIsLiked(!isLiked);
            setReactionCount(prev => isLiked ? prev - 1 : prev + 1);
        }
    };

    const handleHugAnimationComplete = () => {
        if (!showHugAnimation) return; // Prevent multiple calls

        setIsLiked(true);
        setShowHugAnimation(false);
        setReactionCount(prev => prev + 1);

        // Add subtle haptic feedback if supported
        if ('vibrate' in navigator) {
            navigator.vibrate(50); // Gentle 50ms vibration
        }
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
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <FireIcon className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Header */}
            <header className="flex items-start justify-between mb-8pt-3">
                <div className="flex items-center gap-8pt-2">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                                {post.authorName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
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
                            <div className="inline-flex items-center mt-1 px-3 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2"></span>
                                {communityName}
                            </div>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Primary Emotion */}
                        <div>
                            <label className="text-sm font-medium text-slate-600 block mb-3">Primary Emotion</label>
                            <div className={`inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium ${getEmotionColor(post.primaryEmotion)}`}>
                                <div className="w-2 h-2 bg-current rounded-full mr-2 opacity-60"></div>
                                <span className="capitalize">{post.primaryEmotion}</span>
                            </div>
                        </div>

                        {/* Secondary Emotions */}
                        {Object.keys(post.emotions).filter(e => e !== post.primaryEmotion).length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-slate-600 block mb-3">Secondary</label>
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

                        {/* Support Type Needed */}
                        <div>
                            <label className="text-sm font-medium text-slate-600 block mb-3">Support Type</label>
                            <div className={`inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium ${getSupportTypeColor((post.emotions as any).support_type || 'comfort')}`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${getSupportTypeIcon((post.emotions as any).support_type || 'comfort')}`}></div>
                                <span className="capitalize">{(post.emotions as any).support_type || 'comfort'}</span>
                            </div>
                        </div>

                        {/* Context */}
                        <div>
                            <label className="text-sm font-medium text-slate-600 block mb-3">Context</label>
                            <div className={`inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium ${getContextColor((post.emotions as any).context || 'sharing')}`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${getContextIcon((post.emotions as any).context || 'sharing')}`}></div>
                                <span className="capitalize">{(post.emotions as any).context || 'sharing'}</span>
                            </div>
                        </div>

                        {/* Intensity */}
                        <div>
                            <label className="text-sm font-medium text-slate-600 block mb-3">Intensity</label>
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.round(post.emotions[post.primaryEmotion] * 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-medium text-slate-600 min-w-[3rem]">
                                    {Math.round(post.emotions[post.primaryEmotion] * 100)}%
                                </span>
                            </div>
                        </div>

                        {/* Empathy Potential */}
                        <div>
                            <label className="text-sm font-medium text-slate-600 block mb-3">Empathy Potential</label>
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.round(post.empathyPotentialScore * 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-medium text-slate-600 min-w-[3rem]">
                                    {Math.round(post.empathyPotentialScore * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Crisis Indicators */}
                    {(post.emotions as any).crisis_indicators && Array.isArray((post.emotions as any).crisis_indicators) && (post.emotions as any).crisis_indicators.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center mb-2">
                                <ExclamationTriangleIcon className="w-4 h-4 text-red-600 mr-2" />
                                <span className="text-sm font-medium text-red-800">Crisis Support Available</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {(post.emotions as any).crisis_indicators.map((indicator: string, index: number) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                                        {indicator}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progress Indicators */}
                    {(post.emotions as any).progress_indicators && Array.isArray((post.emotions as any).progress_indicators) && (post.emotions as any).progress_indicators.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center mb-2">
                                <TrophyIcon className="w-4 h-4 text-green-600 mr-2" />
                                <span className="text-sm font-medium text-green-800">Progress Recognized</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {(post.emotions as any).progress_indicators.map((indicator: string, index: number) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                        {indicator}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <footer className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-4">
                    {/* Like Button */}
                    <button
                        type="button"
                        ref={heartButtonRef}
                        onClick={handleHeartClick}
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
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-md">
                            {reactionCount}
                        </span>
                    </button>

                    {/* Comment Button */}
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200">
                        <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                        <span>Connect</span>
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-md">
                            {Math.floor((post.reactions || 0) * 0.3)}
                        </span>
                    </button>
                </div>

                {/* Share Button */}
                <div className="relative">
                    <button
                        onClick={handleShare}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all duration-200"
                    >
                        <ShareIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Share</span>
                    </button>

                    {/* Share Confirmation */}
                    {showShareConfirmation && (
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-emerald-600 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
                            Copied to clipboard!
                            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-600"></div>
                        </div>
                    )}
                </div>
            </footer>

            {/* Hug Animation */}
            <HugAnimation
                key={`hug-${post.id}`}
                isActive={showHugAnimation}
                onComplete={handleHugAnimationComplete}
                triggerPosition={hugTriggerPosition}
            />
        </article>
    );
};

export default PostCard; 