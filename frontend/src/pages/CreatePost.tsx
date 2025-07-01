import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    PaperAirplaneIcon,
    SparklesIcon,
    HeartIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import { Community, apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

const CreatePost: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [content, setContent] = useState('');
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [communities, setCommunities] = useState<Community[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const communitiesData = await apiService.getCommunities();
                setCommunities(communitiesData);
                if (communitiesData.length > 0) {
                    setSelectedCommunity(communitiesData[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch communities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Always fetch communities in demo mode, only require auth for real API
        if (isAuthenticated || apiService.isRunningDemo()) {
            fetchCommunities();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        setWordCount(content.trim().split(/\s+/).filter(word => word.length > 0).length);
    }, [content]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim() || !selectedCommunity) return;

        setIsSubmitting(true);

        try {
            await apiService.createPost({ content: content.trim(), communityId: selectedCommunity });
            navigate('/feed');
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSelectedCommunity = () => {
        return communities.find(c => c.id === selectedCommunity);
    };

    const characterLimit = 2000;
    const minWords = 10;
    const isValidPost = content.trim().length > 0 && wordCount >= minWords && selectedCommunity;

    // Show authentication prompt for unauthenticated users (but not in demo mode)
    if (!isAuthenticated && !apiService.isRunningDemo()) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12">
                <div className="max-w-md mx-auto px-4">
                    <div className="card-premium p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <PaperAirplaneIcon className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-heading-lg text-slate-900 mb-4">
                            Share Your Story
                        </h2>

                        <p className="text-body-md text-slate-600 mb-8 leading-relaxed">
                            Sign in to share your experiences and connect with a supportive community who understands your journey.
                        </p>

                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="btn-primary w-full py-4 text-lg font-bold mb-4"
                        >
                            Sign In to Share
                        </button>

                        <Link
                            to="/"
                            className="text-body-sm text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50/20 to-emerald-50/20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <header className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary text-white text-sm font-semibold mb-6 shadow-lg">
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Share Your Story Anonymously
                    </div>

                    <h1 className="text-display-lg text-neutral-900 mb-4">
                        Your Voice <span className="text-gradient-primary">Matters</span>
                    </h1>

                    <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
                        Share your experiences, struggles, or victories with a supportive community.
                        Every story has the power to help someone else feel less alone.
                    </p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Community Selection */}
                            <div className="card-premium p-6 animate-slide-up">
                                <label className="text-heading-sm text-neutral-900 mb-4 block flex items-center">
                                    <HeartIcon className="w-5 h-5 mr-2 text-primary-500" />
                                    Choose Your Community
                                </label>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {communities.map((community) => (
                                        <button
                                            key={community.id}
                                            type="button"
                                            onClick={() => setSelectedCommunity(community.id)}
                                            className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${selectedCommunity === community.id
                                                ? 'border-primary-300 bg-primary-50 shadow-md'
                                                : 'border-neutral-200 bg-white hover:border-primary-200'
                                                }`}
                                        >
                                            <h3 className="text-heading-sm text-neutral-900 mb-2">{community.name}</h3>
                                            <p className="text-body-sm text-neutral-600 mb-3">{community.description}</p>
                                            <div className="flex items-center space-x-4 text-caption text-neutral-500">
                                                <span>{community.memberCount} members</span>
                                                <span>💬 {community.category}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content Input */}
                            <div className="card-premium p-6 animate-slide-up">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-heading-sm text-neutral-900 flex items-center">
                                        <SparklesIcon className="w-5 h-5 mr-2 text-violet-500" />
                                        Share Your Story
                                    </label>

                                    <div className="flex items-center space-x-4 text-body-sm">
                                        <span className={`${wordCount < minWords ? 'text-amber-600' : 'text-emerald-600'} font-medium`}>
                                            {wordCount} words
                                        </span>
                                        <span className="text-neutral-400">•</span>
                                        <span className={`${content.length > characterLimit * 0.9 ? 'text-amber-600' : 'text-neutral-500'}`}>
                                            {content.length}/{characterLimit}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="What's on your mind? Share your thoughts, feelings, or experiences. Remember, this is a safe space where your voice matters..."
                                        className="input-premium min-h-[200px] resize-none"
                                        maxLength={characterLimit}
                                        required
                                    />

                                    {/* Character Limit Indicator */}
                                    <div className="absolute bottom-3 right-3">
                                        <div
                                            className={`h-1 rounded-full transition-all duration-300 ${content.length > characterLimit * 0.9 ? 'bg-amber-400' :
                                                content.length > characterLimit * 0.7 ? 'bg-blue-400' : 'bg-emerald-400'
                                                }`}
                                            style={{ width: `${Math.min(32, (content.length / characterLimit) * 32)}px` }}
                                        />
                                    </div>
                                </div>

                                {/* Validation Messages */}
                                <div className="mt-4 space-y-2">
                                    {wordCount < minWords && content.length > 0 && (
                                        <div className="flex items-center space-x-2 text-amber-600 text-body-sm">
                                            <ExclamationTriangleIcon className="w-4 h-4" />
                                            <span>Please write at least {minWords} words to share your story effectively.</span>
                                        </div>
                                    )}

                                    {wordCount >= minWords && (
                                        <div className="flex items-center space-x-2 text-emerald-600 text-body-sm">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            <span>Great! Your story is ready to be shared.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Privacy & Submit */}
                            <div className="card-premium p-6 animate-slide-up">
                                <div className="flex items-center space-x-3 mb-6">
                                    <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />
                                    <div>
                                        <h3 className="text-heading-sm text-neutral-900">Privacy Protected</h3>
                                        <p className="text-body-sm text-neutral-600">Your identity remains completely anonymous</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isValidPost || isSubmitting}
                                    className={`w-full btn-primary py-4 text-lg font-bold flex items-center justify-center space-x-3 ${!isValidPost ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Sharing Your Story...</span>
                                        </>
                                    ) : (
                                        <>
                                            <PaperAirplaneIcon className="w-5 h-5" />
                                            <span>Share Your Story</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Community Info */}
                        {getSelectedCommunity() && (
                            <div className="card-premium p-6 animate-fade-in">
                                <h3 className="text-heading-sm text-neutral-900 mb-4">Community Guidelines</h3>

                                <div className="space-y-3 text-body-sm text-neutral-600">
                                    <div className="flex items-start space-x-2">
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>Be authentic and share from your heart</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>Respect others' experiences and perspectives</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>Focus on support rather than advice</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>Your anonymity is completely protected</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Encouragement */}
                        <div className="card-glass p-6 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <HeartIcon className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-heading-sm text-neutral-900 mb-2">You're Not Alone</h3>
                            <p className="text-body-sm text-neutral-600 leading-relaxed">
                                Every story shared helps build a stronger, more supportive community.
                                Your courage to share makes a difference.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;