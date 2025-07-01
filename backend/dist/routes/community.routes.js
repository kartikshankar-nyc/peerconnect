"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const router = (0, express_1.Router)();
// Get all communities
router.get('/', async (req, res, next) => {
    try {
        const { data: communities, error } = await supabase_1.supabase
            .from('communities')
            .select('*')
            .order('member_count', { ascending: false });
        if (error) {
            throw new Error(error.message);
        }
        res.json({
            success: true,
            data: communities
        });
    }
    catch (error) {
        next(error);
    }
});
// Get community by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data: community, error } = await supabase_1.supabase
            .from('communities')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    error: 'Community not found'
                });
            }
            throw new Error(error.message);
        }
        res.json({
            success: true,
            data: community
        });
    }
    catch (error) {
        next(error);
    }
});
// Join community
router.post('/:id/join', async (req, res, next) => {
    try {
        const { id: communityId } = req.params;
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }
        const { error } = await supabase_1.supabase
            .from('user_communities')
            .insert({
            user_id: userId,
            community_id: communityId
        });
        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                return res.status(409).json({
                    success: false,
                    error: 'User already joined this community'
                });
            }
            throw new Error(error.message);
        }
        res.json({
            success: true,
            message: 'Successfully joined community'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=community.routes.js.map