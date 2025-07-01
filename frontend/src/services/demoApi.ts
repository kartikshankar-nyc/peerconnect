// Demo API Service - Works without backend for GitHub Pages deployment
interface User {
    id: string;
    username: string;
    empathyScore: number;
    joinedAt: string;
    communities: string[];
}

interface Post {
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

interface Community {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    category: string;
    color: string;
    icon: string;
}

export class DemoApiService {
    private isDemo = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');

    private demoUser: User = {
        id: 'demo-user-1',
        username: 'DemoExplorer',
        empathyScore: 78,
        joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        communities: ['solo-entrepreneurs', 'adhd-support', 'career-transition']
    };

    private demoCommunities: Community[] = [
        {
            id: 'solo-entrepreneurs',
            name: 'Solo Entrepreneurs',
            description: 'Building businesses alone, together',
            memberCount: 1247,
            category: 'Professional',
            color: 'blue',
            icon: '💼'
        },
        {
            id: 'adhd-support',
            name: 'ADHD Support Circle',
            description: 'Understanding minds, supporting growth',
            memberCount: 892,
            category: 'Mental Health',
            color: 'purple',
            icon: '🧠'
        },
        {
            id: 'career-transition',
            name: 'Career Transition Warriors',
            description: 'Navigating professional changes with courage',
            memberCount: 654,
            category: 'Professional',
            color: 'emerald',
            icon: '🚀'
        },
        {
            id: 'new-city-new-me',
            name: 'New City New Me',
            description: 'Building connections in unfamiliar places',
            memberCount: 423,
            category: 'Lifestyle',
            color: 'orange',
            icon: '🏙️'
        },
        {
            id: 'creative-isolation',
            name: 'Creative Isolation',
            description: 'Artists, writers, and creators finding community',
            memberCount: 789,
            category: 'Creative',
            color: 'pink',
            icon: '🎨'
        }
    ];

    private demoPosts: Post[] = [
        {
            id: 'post-1',
            authorId: 'user-2',
            authorName: 'StartupStruggles',
            content: "Anyone else feel like they're building in complete darkness? Been working on my SaaS for 8 months now, and some days I question everything. The isolation is real when you're a solo founder. How do you keep pushing when doubt creeps in?",
            communityId: 'solo-entrepreneurs',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            emotions: { anxiety: 0.7, loneliness: 0.6, determination: 0.4 },
            primaryEmotion: 'anxiety',
            empathyPotentialScore: 0.85,
            reactions: 12
        },
        {
            id: 'post-2',
            authorId: 'user-3',
            authorName: 'FocusSeeker',
            content: "Small win today! Finally finished a task I've been procrastinating on for weeks. The trick was breaking it into 5-minute chunks. ADHD brain can be frustrating but also surprising sometimes. What strategies work for you all?",
            communityId: 'adhd-support',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
            emotions: { joy: 0.6, hope: 0.5, gratitude: 0.4 },
            primaryEmotion: 'joy',
            empathyPotentialScore: 0.6,
            reactions: 18
        },
        {
            id: 'post-3',
            authorId: 'user-4',
            authorName: 'CareerPivot33',
            content: "Left my corporate job last month to pursue UX design. Scared but excited. The financial uncertainty is keeping me up at night, but I know I needed this change. Anyone else made a major career pivot later in life?",
            communityId: 'career-transition',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            emotions: { anxiety: 0.5, hope: 0.7, determination: 0.6 },
            primaryEmotion: 'hope',
            empathyPotentialScore: 0.75,
            reactions: 8
        },
        {
            id: 'post-4',
            authorId: 'user-5',
            authorName: 'UrbanNomad',
            content: "Been in this new city for 3 months and still feel like an outsider. Work from home doesn't help with meeting people. Found a coffee shop that feels like 'home' though. Small steps, right? Missing my old support network so much.",
            communityId: 'new-city-new-me',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            emotions: { loneliness: 0.8, hope: 0.3, sadness: 0.6 },
            primaryEmotion: 'loneliness',
            empathyPotentialScore: 0.9,
            reactions: 15
        }
    ];

    async getCommunities(): Promise<Community[]> {
        if (this.isDemo) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return this.demoCommunities;
        }

        // In production with backend, use real API
        const response = await fetch('/api/communities');
        return response.json();
    }

    async getPosts(communityId?: string): Promise<Post[]> {
        if (this.isDemo) {
            await new Promise(resolve => setTimeout(resolve, 300));

            if (communityId) {
                return this.demoPosts.filter(post => post.communityId === communityId);
            }
            return this.demoPosts;
        }

        const url = communityId ? `/api/posts?community=${communityId}` : '/api/posts';
        const response = await fetch(url);
        return response.json();
    }

    async createPost(postData: { content: string; communityId: string }): Promise<Post> {
        if (this.isDemo) {
            await new Promise(resolve => setTimeout(resolve, 400));

            // Simple emotion analysis for demo
            const content = postData.content.toLowerCase();
            let primaryEmotion = 'neutral';
            let empathyScore = 0.5;

            if (content.includes('anxious') || content.includes('worried') || content.includes('scared')) {
                primaryEmotion = 'anxiety';
                empathyScore = 0.8;
            } else if (content.includes('happy') || content.includes('excited') || content.includes('great')) {
                primaryEmotion = 'joy';
                empathyScore = 0.4;
            } else if (content.includes('lonely') || content.includes('alone') || content.includes('isolated')) {
                primaryEmotion = 'loneliness';
                empathyScore = 0.9;
            }

            const newPost: Post = {
                id: `post-${Date.now()}`,
                authorId: this.demoUser.id,
                authorName: this.demoUser.username,
                content: postData.content,
                communityId: postData.communityId,
                createdAt: new Date().toISOString(),
                emotions: { [primaryEmotion]: 0.7 },
                primaryEmotion,
                empathyPotentialScore: empathyScore,
                reactions: 0
            };

            // Add to demo posts
            this.demoPosts.unshift(newPost);

            return newPost;
        }

        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        return response.json();
    }

    async getCurrentUser(): Promise<User> {
        if (this.isDemo) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return this.demoUser;
        }

        const response = await fetch('/api/user/me');
        return response.json();
    }

    async authenticateUser(username: string): Promise<User> {
        if (this.isDemo) {
            await new Promise(resolve => setTimeout(resolve, 600));

            // Update demo user with provided username
            this.demoUser.username = username || 'DemoExplorer';
            this.demoUser.id = `demo-${username?.toLowerCase() || 'user'}`;

            return this.demoUser;
        }

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        return response.json();
    }

    isRunningDemo(): boolean {
        return this.isDemo;
    }

    getDemoStatus(): string {
        return this.isDemo
            ? "🎭 Demo Mode: Showcasing frontend features with simulated data"
            : "🔗 Connected: Using real backend API";
    }
}

// Export singleton instance
export const demoApi = new DemoApiService(); 