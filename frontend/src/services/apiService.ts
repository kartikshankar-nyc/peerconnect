import { demoApi } from './demoApi';

export interface User {
    id: string;
    username: string;
    empathyScore: number;
    joinedAt: string;
    communities?: string[];
}

export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    communityId: string;
    createdAt: string;
    emotions: { [emotion: string]: number };
    primaryEmotion: string;
    empathyPotentialScore: number;
    reactions: number;
}

export interface Community {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    category: string;
    color: string;
    icon: string;
}

class IntegratedApiService {
    private isDemoMode(): boolean {
        return demoApi.isRunningDemo();
    }

    async getCommunities(): Promise<Community[]> {
        if (this.isDemoMode()) {
            return demoApi.getCommunities();
        }

        // Real API call
        const response = await fetch('/api/communities');
        if (!response.ok) {
            // Fallback to demo if API is unavailable
            console.warn('API unavailable, falling back to demo mode');
            return demoApi.getCommunities();
        }
        return response.json();
    }

    async getPosts(communityId?: string): Promise<Post[]> {
        if (this.isDemoMode()) {
            return demoApi.getPosts(communityId);
        }

        try {
            const url = communityId ? `/api/posts?community=${communityId}` : '/api/posts';
            const response = await fetch(url);
            if (!response.ok) throw new Error('API unavailable');
            return response.json();
        } catch (error) {
            console.warn('API unavailable, falling back to demo mode');
            return demoApi.getPosts(communityId);
        }
    }

    async createPost(postData: { content: string; communityId: string }): Promise<Post> {
        if (this.isDemoMode()) {
            return demoApi.createPost(postData);
        }

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            if (!response.ok) throw new Error('API unavailable');
            return response.json();
        } catch (error) {
            console.warn('API unavailable, falling back to demo mode');
            return demoApi.createPost(postData);
        }
    }

    async getCurrentUser(): Promise<User> {
        if (this.isDemoMode()) {
            return demoApi.getCurrentUser();
        }

        try {
            const response = await fetch('/api/user/me');
            if (!response.ok) throw new Error('API unavailable');
            return response.json();
        } catch (error) {
            console.warn('API unavailable, falling back to demo mode');
            return demoApi.getCurrentUser();
        }
    }

    async authenticateUser(username: string): Promise<User> {
        if (this.isDemoMode()) {
            return demoApi.authenticateUser(username);
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            if (!response.ok) throw new Error('API unavailable');
            return response.json();
        } catch (error) {
            console.warn('API unavailable, falling back to demo mode');
            return demoApi.authenticateUser(username);
        }
    }

    getDemoStatus(): string {
        return demoApi.getDemoStatus();
    }

    isRunningDemo(): boolean {
        return this.isDemoMode();
    }
}

// Export singleton instance
export const apiService = new IntegratedApiService(); 