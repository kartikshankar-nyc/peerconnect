"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const supabase_1 = require("../lib/supabase");
class PostService {
    constructor(emotionService) {
        this.emotionService = emotionService;
    }
    async createPost(data) {
        // Analyze content for emotions and sentiment
        const emotionAnalysis = await this.emotionService.analyzeContent(data.content);
        const postData = {
            content: data.content,
            author_id: data.authorId,
            community_id: data.isDiary ? null : data.communityId || null,
            is_anonymous: data.isAnonymous ?? true,
            is_diary: data.isDiary ?? false,
            detected_emotions: emotionAnalysis.emotions,
            sentiment_score: emotionAnalysis.intensity,
            empathy_potential_score: emotionAnalysis.empathyPotentialScore,
        };
        const { data: createdPost, error } = await supabase_1.supabase
            .from('posts')
            .insert(postData)
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return createdPost;
    }
    async getPostById(id) {
        const { data, error } = await supabase_1.supabase
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
    async getFeedPosts(communityId, limit = 20, offset = 0) {
        let query = supabase_1.supabase
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
    async getUserPosts(userId, includeDiary = false, limit = 20, offset = 0) {
        let query = supabase_1.supabase
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
    async getEmotionBasedPosts(targetEmotions, userId, limit = 10) {
        // This is a simplified version - in production, you'd want more sophisticated matching
        const { data, error } = await supabase_1.supabase
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
    async updatePost(id, content) {
        // Re-analyze content when updated
        const emotionAnalysis = await this.emotionService.analyzeContent(content);
        const { data, error } = await supabase_1.supabase
            .from('posts')
            .update({
            content,
            detected_emotions: emotionAnalysis.emotions,
            sentiment_score: emotionAnalysis.intensity,
            empathy_potential_score: emotionAnalysis.empathyPotentialScore,
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async deletePost(id) {
        const { error } = await supabase_1.supabase
            .from('posts')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    async addReaction(postId, userId, type) {
        // First, try to insert the reaction
        const { error: insertError } = await supabase_1.supabase
            .from('post_reactions')
            .insert({
            post_id: postId,
            user_id: userId,
            type,
        });
        if (insertError) {
            // If it's a duplicate, update the existing reaction
            if (insertError.code === '23505') { // Unique constraint violation
                const { error: updateError } = await supabase_1.supabase
                    .from('post_reactions')
                    .update({ type })
                    .eq('post_id', postId)
                    .eq('user_id', userId);
                if (updateError) {
                    throw new Error(updateError.message);
                }
            }
            else {
                throw new Error(insertError.message);
            }
        }
        // Update reaction count on the post
        await this.updatePostReactionCount(postId);
    }
    async removeReaction(postId, userId) {
        const { error } = await supabase_1.supabase
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
    async updatePostReactionCount(postId) {
        // Get current reaction count
        const { data: reactions, error: countError } = await supabase_1.supabase
            .from('post_reactions')
            .select('id')
            .eq('post_id', postId);
        if (countError) {
            throw new Error(countError.message);
        }
        const reactionCount = reactions?.length || 0;
        // Update the post
        const { error: updateError } = await supabase_1.supabase
            .from('posts')
            .update({ reaction_count: reactionCount })
            .eq('id', postId);
        if (updateError) {
            throw new Error(updateError.message);
        }
    }
}
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map