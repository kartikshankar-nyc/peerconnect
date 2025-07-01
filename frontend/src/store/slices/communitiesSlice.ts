import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export interface Community {
    id: string
    name: string
    description: string | null
    created_at: string
    updated_at: string
    is_private: boolean
    tags: string[]
    member_count: number
    activity_score: number
    support_quality_score: number
}

interface CommunitiesState {
    communities: Community[]
    currentCommunity: Community | null
    isLoading: boolean
    error: string | null
}

const initialState: CommunitiesState = {
    communities: [],
    currentCommunity: null,
    isLoading: false,
    error: null,
}

export const fetchCommunities = createAsyncThunk(
    'communities/fetchCommunities',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/communities')
            return response.data.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch communities')
        }
    }
)

export const fetchCommunity = createAsyncThunk(
    'communities/fetchCommunity',
    async (communityId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/communities/${communityId}`)
            return response.data.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch community')
        }
    }
)

export const joinCommunity = createAsyncThunk(
    'communities/joinCommunity',
    async ({ communityId, userId }: { communityId: string; userId: string }, { rejectWithValue }) => {
        try {
            await api.post(`/communities/${communityId}/join`, { userId })
            return communityId
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to join community')
        }
    }
)

const communitiesSlice = createSlice({
    name: 'communities',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setCurrentCommunity: (state, action) => {
            state.currentCommunity = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch communities
            .addCase(fetchCommunities.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchCommunities.fulfilled, (state, action) => {
                state.isLoading = false
                state.communities = action.payload
            })
            .addCase(fetchCommunities.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Fetch community
            .addCase(fetchCommunity.fulfilled, (state, action) => {
                state.currentCommunity = action.payload
            })
            // Join community
            .addCase(joinCommunity.fulfilled, (state, action) => {
                const communityId = action.payload
                const community = state.communities.find(c => c.id === communityId)
                if (community) {
                    community.member_count += 1
                }
            })
    },
})

export const { clearError, setCurrentCommunity } = communitiesSlice.actions
export default communitiesSlice.reducer 