import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { EmotionService } from './emotion.service';

type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];

export interface CreatePostData {
    content: string;
    authorId: string;
    communityId?: string;
    isAnonymous?: boolean;
    isDiary?: boolean;
}

export class PostService {
    constructor(private emotionService: EmotionService) { }

    async createPost(data: CreatePostData): Promise<Post> {
        // Analyze content for emotions and sentiment
        const emotionAnalysis = await this.emotionService.analyzeContent(data.content);

        const postData: PostInsert = {
            content: data.content,
            author_id: data.authorId,
            community_id: data.isDiary ? null : data.communityId || null,
            is_anonymous: data.isAnonymous ?? true,
            is_diary: data.isDiary ?? false,
            detected_emotions: emotionAnalysis.emotions,
            sentiment_score: emotionAnalysis.sentiment,
            empathy_potential_score: emotionAnalysis.empathyPotential,
        };

        const { data: createdPost, error } = await supabase
            .from('posts')
            .insert(postData)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return createdPost;
    }

    async getPostById(id: string): Promise<Post | null> {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(error.message);
        }

        return data;
    }

    async getFeedPosts(
        communityId?: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<Post[]> {
        let query = supabase
            .from('posts')
            .select('*')
            .eq('is_diary', false) // Exclude diary posts from feed
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (communityId) {
            query = query.eq('community_id', communityId);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data || [];
    }

    async getUserPosts(
        userId: string,
        includeDiary: boolean = false,
        limit: number = 20,
        offset: number = 0
    ): Promise<Post[]> {
        let query = supabase
            .from('posts')
            .select('*')
            .eq('author_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (!includeDiary) {
            query = query.eq('is_diary', false);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data || [];
    }

    async getEmotionBasedPosts(
        targetEmotions: string[],
        userId?: string,
        limit: number = 10
    ): Promise<Post[]> {
        // This is a simplified version - in production, you'd want more sophisticated matching
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('is_diary', false)
            .not('author_id', 'eq', userId || '') // Exclude user's own posts
            .order('empathy_potential_score', { ascending: false })
            .limit(limit);

        if (error) {
            throw new Error(error.message);
        }

        // Filter posts that have overlapping emotions
        const filteredPosts = (data || []).filter(post => {
            const postEmotions = Object.keys(post.detected_emotions || {});
            return targetEmotions.some(emotion => postEmotions.includes(emotion));
        });

        return filteredPosts;
    }

    async updatePost(id: string, content: string): Promise<Post> {
        // Re-analyze content when updated
        const emotionAnalysis = await this.emotionService.analyzeContent(content);

        const { data, error } = await supabase
            .from('posts')
            .update({
                content,
                detected_emotions: emotionAnalysis.emotions,
                sentiment_score: emotionAnalysis.sentiment,
                empathy_potential_score: emotionAnalysis.empathyPotential,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async deletePost(id: string): Promise<void> {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }

    async addReaction(postId: string, userId: string, type: string): Promise<void> {
        // First, try to insert the reaction
        const { error: insertError } = await supabase
            .from('post_reactions')
            .insert({
                post_id: postId,
                user_id: userId,
                type,
            });

        if (insertError) {
            // If it's a duplicate, update the existing reaction
            if (insertError.code === '23505') { // Unique constraint violation
                const { error: updateError } = await supabase
                    .from('post_reactions')
                    .update({ type })
                    .eq('post_id', postId)
                    .eq('user_id', userId);

                if (updateError) {
                    throw new Error(updateError.message);
                }
            } else {
                throw new Error(insertError.message);
            }
        }

        // Update reaction count on the post
        await this.updatePostReactionCount(postId);
    }

    async removeReaction(postId: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('post_reactions')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId);

        if (error) {
            throw new Error(error.message);
        }

        // Update reaction count on the post
        await this.updatePostReactionCount(postId);
    }

    private async updatePostReactionCount(postId: string): Promise<void> {
        // Get current reaction count
        const { data: reactions, error: countError } = await supabase
            .from('post_reactions')
            .select('id')
            .eq('post_id', postId);

        if (countError) {
            throw new Error(countError.message);
        }

        const reactionCount = reactions?.length || 0;

        // Update the post
        const { error: updateError } = await supabase
            .from('posts')
            .update({ reaction_count: reactionCount })
            .eq('id', postId);

        if (updateError) {
            throw new Error(updateError.message);
        }
    }
} 