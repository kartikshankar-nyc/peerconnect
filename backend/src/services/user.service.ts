import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../types/database.types';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export class UserService {
    async createAnonymousUser(): Promise<User> {
        const anonymousId = `anon_${uuidv4()}`;

        const { data, error } = await supabase
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

    async getUserById(id: string): Promise<User | null> {
        const { data, error } = await supabase
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

    async getUserByAnonymousId(anonymousId: string): Promise<User | null> {
        const { data, error } = await supabase
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

    async updateUserPreferences(id: string, preferences: any): Promise<User> {
        const { data, error } = await supabase
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

    async updateLastActive(id: string): Promise<void> {
        const { error } = await supabase
            .from('users')
            .update({ last_active_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }

    async updateUserScores(id: string, interactionScore?: number, empathyScore?: number): Promise<User> {
        const updates: Partial<UserUpdate> = {};

        if (interactionScore !== undefined) {
            updates.interaction_score = interactionScore;
        }

        if (empathyScore !== undefined) {
            updates.empathy_score = empathyScore;
        }

        const { data, error } = await supabase
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

    async deleteUser(id: string): Promise<void> {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }
} 