import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export interface User {
    id: string
    anonymousId: string
    preferences: Record<string, any>
    interactionScore: number
    empathyScore: number
    lastActiveAt: string
    createdAt: string
}

interface AuthState {
    user: User | null
    isLoading: boolean
    error: string | null
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
}

// Async thunks
export const createAnonymousUser = createAsyncThunk(
    'auth/createAnonymousUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/users/anonymous')
            const user = response.data.data
            // Store user ID in localStorage for persistence
            localStorage.setItem('peerconnect_user_id', user.id)
            return user
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create user')
        }
    }
)

export const checkUser = createAsyncThunk(
    'auth/checkUser',
    async (_, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('peerconnect_user_id')
            if (!userId) return null

            const response = await api.get(`/users/${userId}`)
            return response.data.data
        } catch (error: any) {
            // If user not found, clear localStorage
            localStorage.removeItem('peerconnect_user_id')
            return null
        }
    }
)

export const updateUserPreferences = createAsyncThunk(
    'auth/updateUserPreferences',
    async ({ userId, preferences }: { userId: string; preferences: Record<string, any> }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/users/${userId}/preferences`, { preferences })
            return response.data.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update preferences')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        logout: (state) => {
            state.user = null
            localStorage.removeItem('peerconnect_user_id')
        },
    },
    extraReducers: (builder) => {
        builder
            // Create anonymous user
            .addCase(createAnonymousUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createAnonymousUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(createAnonymousUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Check user
            .addCase(checkUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(checkUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(checkUser.rejected, (state) => {
                state.isLoading = false
            })
            // Update preferences
            .addCase(updateUserPreferences.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.preferences = action.payload.preferences
                }
            })
    },
})

export const { clearError, logout } = authSlice.actions
export default authSlice.reducer 