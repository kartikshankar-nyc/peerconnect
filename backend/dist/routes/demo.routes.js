"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const demo_data_service_1 = require("../services/demo-data.service");
const router = (0, express_1.Router)();
// Get all communities
router.get('/communities', (req, res) => {
    try {
        const communities = demo_data_service_1.demoDataService.getCommunities();
        res.json({
            success: true,
            data: communities
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch communities'
        });
    }
});
// Get posts (all or by community)
router.get('/posts', (req, res) => {
    try {
        const { communityId } = req.query;
        const posts = demo_data_service_1.demoDataService.getPosts(communityId);
        res.json({
            success: true,
            data: posts
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch posts'
        });
    }
});
// Create a new post
router.post('/posts', (req, res) => {
    try {
        const { content, communityId, userId = '1' } = req.body;
        if (!content || !communityId) {
            return res.status(400).json({
                success: false,
                error: 'Content and community ID are required'
            });
        }
        const newPost = demo_data_service_1.demoDataService.createPost(content, communityId, userId);
        res.status(201).json({
            success: true,
            data: newPost
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create post'
        });
    }
});
// Get users
router.get('/users', (req, res) => {
    try {
        const users = demo_data_service_1.demoDataService.getUsers();
        res.json({
            success: true,
            data: users
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
});
// Create anonymous user (demo)
router.post('/users/anonymous', (req, res) => {
    try {
        // Return a demo user for the session
        const demoUser = {
            id: 'demo-user-' + Date.now(),
            anonymousId: 'DemoUser' + Math.floor(Math.random() * 1000),
            empathyScore: Math.floor(Math.random() * 40) + 60, // 60-100
            interactionScore: Math.floor(Math.random() * 40) + 60,
            createdAt: new Date().toISOString()
        };
        res.status(201).json({
            success: true,
            data: demoUser
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create anonymous user'
        });
    }
});
exports.default = router;
//# sourceMappingURL=demo.routes.js.map