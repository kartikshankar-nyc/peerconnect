import { Database } from '../types/database.types';
import { EmotionService } from './emotion.service';
type Post = Database['public']['Tables']['posts']['Row'];
export interface CreatePostData {
    content: string;
    authorId: string;
    communityId?: string;
    isAnonymous?: boolean;
    isDiary?: boolean;
}
export declare class PostService {
    private emotionService;
    constructor(emotionService: EmotionService);
    createPost(data: CreatePostData): Promise<Post>;
    getPostById(id: string): Promise<Post | null>;
    getFeedPosts(communityId?: string, limit?: number, offset?: number): Promise<Post[]>;
    getUserPosts(userId: string, includeDiary?: boolean, limit?: number, offset?: number): Promise<Post[]>;
    getEmotionBasedPosts(targetEmotions: string[], userId?: string, limit?: number): Promise<Post[]>;
    updatePost(id: string, content: string): Promise<Post>;
    deletePost(id: string): Promise<void>;
    addReaction(postId: string, userId: string, type: string): Promise<void>;
    removeReaction(postId: string, userId: string): Promise<void>;
    private updatePostReactionCount;
}
export {};
//# sourceMappingURL=post.service.d.ts.map