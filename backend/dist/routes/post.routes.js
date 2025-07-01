"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_service_1 = require("../services/post.service");
const emotion_service_1 = require("../services/emotion.service");
const validation_1 = require("../middleware/validation");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const emotionService = new emotion_service_1.EmotionService();
const postService = new post_service_1.PostService(emotionService);
// Validation schemas
const createPostSchema = joi_1.default.object({
    content: joi_1.default.string().min(1).max(5000).required(),
    authorId: joi_1.default.string().required(),
    communityId: joi_1.default.string().optional(),
    isAnonymous: joi_1.default.boolean().default(true),
    isDiary: joi_1.default.boolean().default(false)
});
const updatePostSchema = joi_1.default.object({
    content: joi_1.default.string().min(1).max(5000).required()
});
// Create new post
router.post('/', (0, validation_1.validateRequest)(createPostSchema), async (req, res, next) => {
    try {
        const postData = req.body;
        const post = await postService.createPost(postData);
        res.status(201).json({
            success: true,
            data: post
        });
    }
    catch (error) {
        next(error);
    }
});
// Get post by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await postService.getPostById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }
        res.json({
            success: true,
            data: post
        });
    }
    catch (error) {
        next(error);
    }
});
// Get feed posts (with optional community filter)
router.get('/', async (req, res, next) => {
    try {
        const { communityId, limit = '20', offset = '0' } = req.query;
        const posts = await postService.getFeedPosts(communityId, parseInt(limit), parseInt(offset));
        res.json({
            success: true,
            data: posts,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: posts.length === parseInt(limit)
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Get user's posts
router.get('/user/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { includeDiary = 'false', limit = '20', offset = '0' } = req.query;
        const posts = await postService.getUserPosts(userId, includeDiary === 'true', parseInt(limit), parseInt(offset));
        res.json({
            success: true,
            data: posts
        });
    }
    catch (error) {
        next(error);
    }
});
// Get emotion-based post recommendations
router.get('/recommendations/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { emotions, limit = '10' } = req.query;
        if (!emotions) {
            return res.status(400).json({
                success: false,
                error: 'Emotions parameter is required'
            });
        }
        const targetEmotions = emotions.split(',');
        const posts = await postService.getEmotionBasedPosts(targetEmotions, userId, parseInt(limit));
        res.json({
            success: true,
            data: posts
        });
    }
    catch (error) {
        next(error);
    }
});
// Update post
router.put('/:id', (0, validation_1.validateRequest)(updatePostSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const post = await postService.updatePost(id, content);
        res.json({
            success: true,
            data: post
        });
    }
    catch (error) {
        next(error);
    }
});
// Delete post
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await postService.deletePost(id);
        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
// Add reaction to post
router.post('/:id/reactions', async (req, res, next) => {
    try {
        const { id: postId } = req.params;
        const { userId, type } = req.body;
        if (!userId || !type) {
            return res.status(400).json({
                success: false,
                error: 'userId and type are required'
            });
        }
        await postService.addReaction(postId, userId, type);
        res.json({
            success: true,
            message: 'Reaction added successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
// Remove reaction from post
router.delete('/:id/reactions/:userId', async (req, res, next) => {
    try {
        const { id: postId, userId } = req.params;
        await postService.removeReaction(postId, userId);
        res.json({
            success: true,
            message: 'Reaction removed successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
// Analyze content emotions (utility endpoint)
router.post('/analyze', async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({
                success: false,
                error: 'Content is required'
            });
        }
        const analysis = await emotionService.analyzeEmotion(content);
        res.json({
            success: true,
            data: analysis
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=post.routes.js.map