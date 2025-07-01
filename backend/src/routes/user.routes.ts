import { Router } from 'express';
import { UserService } from '../services/user.service';
import { validateRequest } from '../middleware/validation';
import Joi from 'joi';

const router = Router();
const userService = new UserService();

// Validation schemas
const updatePreferencesSchema = Joi.object({
    preferences: Joi.object().required()
});

// Create anonymous user
router.post('/anonymous', async (req, res, next) => {
    try {
        const user = await userService.createAnonymousUser();
        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                anonymousId: user.anonymous_id,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        next(error);
    }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                anonymousId: user.anonymous_id,
                preferences: user.preferences,
                interactionScore: user.interaction_score,
                empathyScore: user.empathy_score,
                lastActiveAt: user.last_active_at,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        next(error);
    }
});

// Update user preferences
router.put('/:id/preferences', validateRequest(updatePreferencesSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { preferences } = req.body;

        const user = await userService.updateUserPreferences(id, preferences);

        res.json({
            success: true,
            data: {
                id: user.id,
                preferences: user.preferences,
                updatedAt: user.updated_at
            }
        });
    } catch (error) {
        next(error);
    }
});

// Update last active timestamp
router.post('/:id/activity', async (req, res, next) => {
    try {
        const { id } = req.params;
        await userService.updateLastActive(id);

        res.json({
            success: true,
            message: 'Activity updated'
        });
    } catch (error) {
        next(error);
    }
});

// Update user scores (for internal use by the system)
router.put('/:id/scores', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { interactionScore, empathyScore } = req.body;

        const user = await userService.updateUserScores(id, interactionScore, empathyScore);

        res.json({
            success: true,
            data: {
                id: user.id,
                interactionScore: user.interaction_score,
                empathyScore: user.empathy_score,
                updatedAt: user.updated_at
            }
        });
    } catch (error) {
        next(error);
    }
});

// Delete user (for privacy compliance)
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

export default router; 