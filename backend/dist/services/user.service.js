"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const supabase_1 = require("../lib/supabase");
const uuid_1 = require("uuid");
class UserService {
    async createAnonymousUser() {
        const anonymousId = `anon_${(0, uuid_1.v4)()}`;
        const { data, error } = await supabase_1.supabase
            .from('users')
            .insert({
            anonymous_id: anonymousId,
        })
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getUserById(id) {
        const { data, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            // Supabase returns PGRST116 when no rows found
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(error.message);
        }
        return data;
    }
    async getUserByAnonymousId(anonymousId) {
        const { data, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('anonymous_id', anonymousId)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(error.message);
        }
        return data;
    }
    async updateUserPreferences(id, preferences) {
        const { data, error } = await supabase_1.supabase
            .from('users')
            .update({ preferences })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async updateLastActive(id) {
        const { error } = await supabase_1.supabase
            .from('users')
            .update({ last_active_at: new Date().toISOString() })
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    async updateUserScores(id, interactionScore, empathyScore) {
        const updates = {};
        if (interactionScore !== undefined) {
            updates.interaction_score = interactionScore;
        }
        if (empathyScore !== undefined) {
            updates.empathy_score = empathyScore;
        }
        const { data, error } = await supabase_1.supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async deleteUser(id) {
        const { error } = await supabase_1.supabase
            .from('users')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map