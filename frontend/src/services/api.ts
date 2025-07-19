import axios from 'axios'

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-backend-domain.com/api'  // Replace with your backend URL
    : 'http://localhost:3001/api'

export interface User {
    id: string;
    anonymousId: string;
    empathyScore: number;
    interactionScore: number;
    createdAt: string;
}

export interface Post {
    id: string;
    user_id: string;
    content: string;
    emotions: {
        primary: string;
        secondary: string[];
        intensity: number;
        empathy_potential: number;
    };
    community_id: string;
    reaction_count: number;
    support_count: number;
    created_at: string;
    author: {
        anonymous_id: string;
        empathy_score: number;
    };
}

export interface Community {
    id: string;
    name: string;
    description: string;
    member_count: number;
    post_count: number;
    focus_area: string;
}

class ApiService {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data || data;
    }

    // User methods
    async createAnonymousUser(): Promise<User> {
        return this.request<User>('/users/anonymous', {
            method: 'POST',
        });
    }

    async getUser(id: string): Promise<User> {
        return this.request<User>(`/users/${id}`);
    }

    // Post methods
    async getPosts(communityId?: string): Promise<Post[]> {
        const query = communityId ? `?communityId=${communityId}` : '';
        return this.request<Post[]>(`/posts${query}`);
    }

    async createPost(content: string, communityId: string, userId?: string): Promise<Post> {
        return this.request<Post>('/posts', {
            method: 'POST',
            body: JSON.stringify({
                content,
                communityId,
                userId: userId || 'demo-user'
            }),
        });
    }

    // Community methods
    async getCommunities(): Promise<Community[]> {
        return this.request<Community[]>('/communities');
    }

    async getCommunity(id: string): Promise<Community> {
        return this.request<Community>(`/communities/${id}`);
    }

    // Health check
    async healthCheck(): Promise<{ status: string; mode: string }> {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
        return response.json();
    }
}

export const apiService = new ApiService();

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add any auth headers here if needed
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('peerconnect_user_id')
            window.location.href = '/'
        }

        return Promise.reject(error)
    }
)

export default api 