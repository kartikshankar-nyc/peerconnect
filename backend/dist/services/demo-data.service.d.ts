export interface DemoUser {
    id: string;
    anonymous_id: string;
    empathy_score: number;
    interaction_score: number;
    created_at: string;
}
export interface DemoEmotion {
    primary: string;
    secondary: string[];
    intensity: number;
    empathy_potential: number;
    support_type: 'comfort' | 'energy' | 'clarity' | 'solidarity';
    crisis_indicators: string[];
    progress_indicators: string[];
    context: 'sharing' | 'seeking' | 'reflecting' | 'celebrating';
    emotional_complexity: number;
    all_emotions: {
        [emotion: string]: number;
    };
}
export interface DemoPost {
    id: string;
    user_id: string;
    content: string;
    emotions: DemoEmotion;
    community_id: string;
    reaction_count: number;
    support_count: number;
    created_at: string;
    author: {
        anonymous_id: string;
        empathy_score: number;
    };
}
export interface DemoCommunity {
    id: string;
    name: string;
    description: string;
    member_count: number;
    post_count: number;
    focus_area: string;
}
declare class DemoDataService {
    private communities;
    private posts;
    private users;
    getCommunities(): DemoCommunity[];
    getCommunity(id: string): DemoCommunity | undefined;
    getPosts(communityId?: string): DemoPost[];
    getPost(id: string): DemoPost | undefined;
    createPost(content: string, communityId: string, userId?: string): DemoPost;
    getUsers(): DemoUser[];
    createUser(): DemoUser;
    private generateRandomEmotion;
}
export declare const demoDataService: DemoDataService;
export {};
//# sourceMappingURL=demo-data.service.d.ts.map