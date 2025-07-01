export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    anonymous_id: string
                    created_at: string
                    updated_at: string
                    preferences: Json | null
                    interaction_score: number
                    empathy_score: number
                    last_active_at: string
                }
                Insert: {
                    id?: string
                    anonymous_id: string
                    created_at?: string
                    updated_at?: string
                    preferences?: Json | null
                    interaction_score?: number
                    empathy_score?: number
                    last_active_at?: string
                }
                Update: {
                    id?: string
                    anonymous_id?: string
                    created_at?: string
                    updated_at?: string
                    preferences?: Json | null
                    interaction_score?: number
                    empathy_score?: number
                    last_active_at?: string
                }
            }
            posts: {
                Row: {
                    id: string
                    content: string
                    created_at: string
                    updated_at: string
                    is_anonymous: boolean
                    is_diary: boolean
                    detected_emotions: Json | null
                    content_tags: Json | null
                    sentiment_score: number | null
                    empathy_potential_score: number
                    author_id: string
                    community_id: string | null
                    reaction_count: number
                    support_score: number
                }
                Insert: {
                    id?: string
                    content: string
                    created_at?: string
                    updated_at?: string
                    is_anonymous?: boolean
                    is_diary?: boolean
                    detected_emotions?: Json | null
                    content_tags?: Json | null
                    sentiment_score?: number | null
                    empathy_potential_score?: number
                    author_id: string
                    community_id?: string | null
                    reaction_count?: number
                    support_score?: number
                }
                Update: {
                    id?: string
                    content?: string
                    created_at?: string
                    updated_at?: string
                    is_anonymous?: boolean
                    is_diary?: boolean
                    detected_emotions?: Json | null
                    content_tags?: Json | null
                    sentiment_score?: number | null
                    empathy_potential_score?: number
                    author_id?: string
                    community_id?: string | null
                    reaction_count?: number
                    support_score?: number
                }
            }
            communities: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    created_at: string
                    updated_at: string
                    is_private: boolean
                    tags: Json | null
                    member_count: number
                    activity_score: number
                    support_quality_score: number
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                    is_private?: boolean
                    tags?: Json | null
                    member_count?: number
                    activity_score?: number
                    support_quality_score?: number
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                    is_private?: boolean
                    tags?: Json | null
                    member_count?: number
                    activity_score?: number
                    support_quality_score?: number
                }
            }
            emotions: {
                Row: {
                    id: string
                    name: string
                    category: string
                    description: string | null
                    color_code: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    category: string
                    description?: string | null
                    color_code?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    category?: string
                    description?: string | null
                    color_code?: string | null
                }
            }
        }
    }
} 