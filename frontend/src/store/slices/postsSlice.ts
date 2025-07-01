import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export interface Post {
    id: string
    content: string
    created_at: string
    updated_at: string
    is_anonymous: boolean
    is_diary: boolean
    detected_emotions: Record<string, number>
    sentiment_score: number
    empathy_potential_score: number
    author_id: string
    community_id: string | null
    reaction_count: number
    support_score: number
}

interface PostsState {
    posts: Post[]
    currentPost: Post | null
    isLoading: boolean
    error: string | null
    hasMore: boolean
}

const initialState: PostsState = {
    posts: [],
    currentPost: null,
    isLoading: false,
    error: null,
    hasMore: true,
}

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (postData: {
        content: string
        authorId: string
        communityId?: string
        isAnonymous?: boolean
        isDiary?: boolean
    }, { rejectWithValue }) => {
        try {
            const response = await api.post('/posts', postData)
            return response.data.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create post')
        }
    }
)

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async ({ communityId, limit = 20, offset = 0 }: {
        communityId?: string
        limit?: number
        offset?: number
    }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams()
            if (communityId) params.append('communityId', communityId)
            params.append('limit', limit.toString())
            params.append('offset', offset.toString())

            const response = await api.get(`/posts?${params}`)
            return {
                posts: response.data.data,
                hasMore: response.data.pagination.hasMore,
                offset,
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch posts')
        }
    }
)

export const addReaction = createAsyncThunk(
    'posts/addReaction',
    async ({ postId, userId, type }: {
        postId: string
        userId: string
        type: string
    }, { rejectWithValue }) => {
        try {
            await api.post(`/posts/${postId}/reactions`, { userId, type })
            return { postId, type }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to add reaction')
        }
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearPosts: (state) => {
            state.posts = []
            state.hasMore = true
        },
    },
    extraReducers: (builder) => {
        builder
            // Create post
            .addCase(createPost.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false
                state.posts.unshift(action.payload) // Add to beginning
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Fetch posts
            .addCase(fetchPosts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.isLoading = false
                const { posts, hasMore, offset } = action.payload

                if (offset === 0) {
                    state.posts = posts
                } else {
                    state.posts.push(...posts)
                }
                state.hasMore = hasMore
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Add reaction
            .addCase(addReaction.fulfilled, (state, action) => {
                const { postId } = action.payload
                const post = state.posts.find(p => p.id === postId)
                if (post) {
                    post.reaction_count += 1
                }
            })
    },
})

export const { clearError, clearPosts } = postsSlice.actions
export default postsSlice.reducer 