import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
    FunnelIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    FireIcon,
    UserGroupIcon,
    AdjustmentsHorizontalIcon,
    XMarkIcon,
    PlusIcon,
    HeartIcon,
    UserIcon
} from '@heroicons/react/24/outline'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { apiService, Post, Community } from '../services/apiService'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'

const Feed: React.FC = () => {
    const { isAuthenticated } = useAuth()
    const [posts, setPosts] = useState<Post[]>([])
    const [communities, setCommunities] = useState<Community[]>([])
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
    const [selectedCommunity, setSelectedCommunity] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'recent' | 'empathy' | 'hope'>('recent')
    const [showFilters, setShowFilters] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showAuthModal, setShowAuthModal] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true)
            console.log('Fetching data from API...', { isDemoMode: apiService.isRunningDemo() })
            const [postsData, communitiesData] = await Promise.all([
                apiService.getPosts(),
                apiService.getCommunities()
            ])
            console.log('Received data:', { posts: postsData, communities: communitiesData })
            console.log('Posts is array?', Array.isArray(postsData))
            setPosts(postsData)
            setCommunities(communitiesData)
        } catch (error) {
            console.error('Failed to fetch data:', error)
            // Set empty arrays as fallback
            setPosts([])
            setCommunities([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        // Always fetch data in demo mode, only require auth for real API
        if (isAuthenticated || apiService.isRunningDemo()) {
            fetchData()
        } else {
            setIsLoading(false)
        }
    }, [isAuthenticated, fetchData])

    useEffect(() => {
        let filtered = Array.isArray(posts) ? posts : []

        // Filter by community
        if (selectedCommunity !== 'all') {
            filtered = filtered.filter(post => post.communityId === selectedCommunity)
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(post =>
                post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Sort posts
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'empathy':
                    return b.empathyPotentialScore - a.empathyPotentialScore
                case 'hope':
                    return (b.empathyPotentialScore >= 0.85 ? 1 : 0) - (a.empathyPotentialScore >= 0.85 ? 1 : 0)
                case 'recent':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
        })

        setFilteredPosts(filtered)
    }, [posts, selectedCommunity, searchQuery, sortBy])

    const handleCommunityFilter = (communityId: string) => {
        setSelectedCommunity(communityId)
        setShowFilters(false)
    }

    const getCommunityName = (communityId: string) => {
        return communities.find(c => c.id === communityId)?.name || ''
    }

    const getHopeThreadsCount = () => {
        return Array.isArray(posts) ? posts.filter(post => post.empathyPotentialScore >= 0.85).length : 0
    }

    const getSortLabel = (sort: string) => {
        switch (sort) {
            case 'empathy': return 'Highest Empathy'
            case 'hope': return 'Hope Threads'
            case 'recent': return 'Most Recent'
            default: return 'Most Recent'
        }
    }

    // Show authentication prompt for unauthenticated users (but not in demo mode)
    if (!isAuthenticated && !apiService.isRunningDemo()) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12">
                <div className="max-w-md mx-auto px-4">
                    <div className="card-premium p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <UserGroupIcon className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-heading-lg text-slate-900 mb-4">
                            Join the Community
                        </h2>

                        <p className="text-body-md text-slate-600 mb-8 leading-relaxed">
                            Sign in to access the community feed, share your story, and connect with others on their healing journey.
                        </p>

                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="btn-primary w-full py-4 text-lg font-bold mb-4"
                        >
                            Sign In to Continue
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
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Fixed Header */}
            <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col gap-6">
                        {/* Title & Stats */}
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 mb-3">
                                <h1 className="text-heading-xl text-slate-900">Community Feed</h1>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-body-sm text-slate-600 font-medium">Live</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center space-x-8 text-body-sm text-slate-600">
                                <span className="flex items-center space-x-2">
                                    <UserGroupIcon className="w-4 h-4" />
                                    <span className="font-medium">{Array.isArray(posts) ? posts.length : 0} posts</span>
                                </span>
                                <span className="flex items-center space-x-2">
                                    <FireIcon className="w-4 h-4 text-amber-500" />
                                    <span className="font-medium">{getHopeThreadsCount()} Hope Threads</span>
                                </span>
                                <span className="flex items-center space-x-2">
                                    <SparklesIcon className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">AI-Powered Matching</span>
                                </span>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-body-sm"
                                />
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-3 rounded-xl border transition-all duration-200 flex items-center space-x-2 ${showFilters
                                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                                <span className="text-body-sm font-medium">Filters</span>
                            </button>
                        </div>

                        {/* Filters Panel */}
                        {showFilters && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-heading-md text-slate-900">Filters & Sorting</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Community Filter */}
                                    <div>
                                        <label className="text-body-sm font-medium text-slate-700 mb-3 block">Filter by Community</label>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleCommunityFilter('all')}
                                                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 text-body-sm ${selectedCommunity === 'all'
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                                                    }`}
                                            >
                                                All Communities ({Array.isArray(posts) ? posts.length : 0})
                                            </button>
                                            {communities.map((community) => (
                                                <button
                                                    key={community.id}
                                                    onClick={() => handleCommunityFilter(community.id)}
                                                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 text-body-sm ${selectedCommunity === community.id
                                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                                                        }`}
                                                >
                                                    {community.name} ({Array.isArray(posts) ? posts.filter(p => p.communityId === community.id).length : 0})
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sort Options */}
                                    <div>
                                        <label className="text-body-sm font-medium text-slate-700 mb-3 block">Sort Posts</label>
                                        <div className="space-y-2">
                                            {(['recent', 'empathy', 'hope'] as const).map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => setSortBy(option as 'recent' | 'empathy' | 'hope')}
                                                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 text-body-sm ${sortBy === option
                                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                                                        }`}
                                                >
                                                    {getSortLabel(option)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Active Filters */}
                {(selectedCommunity !== 'all' || searchQuery) && (
                    <div className="mb-8 flex flex-wrap items-center gap-3">
                        <span className="text-sm text-slate-600 font-medium">Active filters:</span>

                        {selectedCommunity !== 'all' && (
                            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-xl text-sm font-medium">
                                <span>{getCommunityName(selectedCommunity)}</span>
                                <button
                                    onClick={() => setSelectedCommunity('all')}
                                    className="hover:bg-blue-200 rounded-full p-1 transition-colors duration-200"
                                >
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {searchQuery && (
                            <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl text-sm font-medium">
                                <span>"{searchQuery}"</span>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="hover:bg-emerald-200 rounded-full p-1 transition-colors duration-200"
                                >
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Results Summary */}
                <div className="mb-8 flex items-center justify-between text-sm text-slate-600">
                    <div>
                        Showing <span className="font-semibold text-slate-900">{filteredPosts.length}</span> posts
                        {selectedCommunity !== 'all' && (
                            <span> in <span className="font-semibold text-blue-700">{getCommunityName(selectedCommunity)}</span></span>
                        )}
                    </div>

                    <div>
                        Sorted by {getSortLabel(sortBy)}
                    </div>
                </div>

                {/* Posts Grid */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <UserIcon className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">No posts found</h3>
                        <p className="text-slate-600 max-w-md mx-auto mb-6">
                            {searchQuery || selectedCommunity !== 'all'
                                ? 'Try adjusting your filters or search terms to find more posts.'
                                : 'Be the first to share your story and connect with the community.'}
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedCommunity('all')
                                setShowFilters(false)
                            }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredPosts.map((post) => (
                            <div key={post.id}>
                                <PostCard
                                    post={post}
                                    onCommunityFilter={handleCommunityFilter}
                                    communityName={getCommunityName(post.communityId)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More */}
                {filteredPosts.length > 0 && (
                    <div className="text-center mt-12">
                        <div className="inline-flex items-center space-x-2 text-slate-500 text-sm">
                            <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                            <span>You've seen all posts</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Feed 