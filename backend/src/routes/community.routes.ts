import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get all communities
router.get('/', async (req, res, next) => {
    try {
        const { data: communities, error } = await supabase
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
    } catch (error) {
        next(error);
    }
});

// Get community by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data: community, error } = await supabase
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
    } catch (error) {
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

        const { error } = await supabase
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
    } catch (error) {
        next(error);
    }
});

export default router; 