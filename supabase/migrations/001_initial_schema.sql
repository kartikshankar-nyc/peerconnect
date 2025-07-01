-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE emotion_category AS ENUM ('positive', 'negative', 'neutral', 'mixed');
CREATE TYPE post_reaction_type AS ENUM ('support', 'relate', 'care', 'hope');

-- Users table - Privacy first, no personal data
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anonymous_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}',
    
    -- Metadata for matching and insights (anonymous)
    interaction_score FLOAT DEFAULT 0.0,
    empathy_score FLOAT DEFAULT 0.0,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communities table
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Community settings
    is_private BOOLEAN DEFAULT FALSE,
    tags JSONB DEFAULT '[]',
    member_count INTEGER DEFAULT 0,
    
    -- Community health metrics
    activity_score FLOAT DEFAULT 0.0,
    support_quality_score FLOAT DEFAULT 0.0
);

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Post metadata
    is_anonymous BOOLEAN DEFAULT TRUE,
    is_diary BOOLEAN DEFAULT FALSE,
    
    -- AI-detected emotions and analysis
    detected_emotions JSONB DEFAULT '{}',
    content_tags JSONB DEFAULT '[]',
    sentiment_score FLOAT,
    empathy_potential_score FLOAT DEFAULT 0.0,
    
    -- Relationships
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id),
    
    -- Engagement metrics
    reaction_count INTEGER DEFAULT 0,
    support_score FLOAT DEFAULT 0.0
);

-- Emotions reference table
CREATE TABLE emotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category emotion_category NOT NULL,
    description TEXT,
    color_code TEXT -- For UI representation
);

-- User emotions tracking (for personalization)
CREATE TABLE user_emotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emotion_id UUID NOT NULL REFERENCES emotions(id),
    intensity FLOAT NOT NULL CHECK (intensity >= 0.0 AND intensity <= 1.0),
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- For tracking emotional journey
    session_id UUID,
    triggered_by_post_id UUID REFERENCES posts(id)
);

-- User communities (membership)
CREATE TABLE user_communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Member role and status
    is_moderator BOOLEAN DEFAULT FALSE,
    contribution_score FLOAT DEFAULT 0.0,
    
    UNIQUE(user_id, community_id)
);

-- Post reactions
CREATE TABLE post_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    type post_reaction_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- For measuring empathy and support quality
    empathy_score FLOAT DEFAULT 0.0,
    
    UNIQUE(user_id, post_id)
);

-- Hope threads - connecting people who overcame challenges with those facing them
CREATE TABLE hope_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seeker_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Matching criteria
    challenge_tags JSONB NOT NULL DEFAULT '[]',
    emotional_context JSONB DEFAULT '{}',
    
    -- Thread status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Success metrics
    helpfulness_score FLOAT DEFAULT 0.0,
    completion_score FLOAT DEFAULT 0.0
);

-- Success stories (automatically generated from hope threads)
CREATE TABLE success_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hope_thread_id UUID REFERENCES hope_threads(id),
    
    -- Story content (anonymized)
    title TEXT NOT NULL,
    story_content TEXT NOT NULL,
    challenge_overcome TEXT NOT NULL,
    
    -- Categorization
    tags JSONB DEFAULT '[]',
    emotion_journey JSONB DEFAULT '{}',
    
    -- Metrics
    inspiration_score FLOAT DEFAULT 0.0,
    relatability_score FLOAT DEFAULT 0.0,
    view_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX idx_users_anonymous_id ON users(anonymous_id);
CREATE INDEX idx_users_last_active ON users(last_active_at);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_community_id ON posts(community_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_sentiment ON posts(sentiment_score);
CREATE INDEX idx_user_emotions_user_id ON user_emotions(user_id);
CREATE INDEX idx_user_emotions_created_at ON user_emotions(created_at DESC);
CREATE INDEX idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX idx_hope_threads_status ON hope_threads(status);
CREATE INDEX idx_success_stories_featured ON success_stories(is_featured);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default emotions
INSERT INTO emotions (name, category, description, color_code) VALUES
('joy', 'positive', 'Feeling of happiness and contentment', '#FFD700'),
('hope', 'positive', 'Optimism about the future', '#87CEEB'),
('gratitude', 'positive', 'Thankfulness and appreciation', '#98FB98'),
('relief', 'positive', 'Release from stress or anxiety', '#E6E6FA'),
('sadness', 'negative', 'Feeling of sorrow or melancholy', '#4682B4'),
('anxiety', 'negative', 'Worry or unease about future events', '#FF6347'),
('loneliness', 'negative', 'Feeling isolated or disconnected', '#708090'),
('frustration', 'negative', 'Feeling blocked or hindered', '#CD853F'),
('overwhelm', 'negative', 'Feeling unable to cope', '#B22222'),
('confusion', 'neutral', 'Uncertainty or lack of clarity', '#DDA0DD'),
('curiosity', 'neutral', 'Desire to learn or understand', '#20B2AA'),
('acceptance', 'neutral', 'Coming to terms with circumstances', '#F0E68C'),
('determination', 'mixed', 'Resolve despite challenges', '#FF4500'),
('bittersweet', 'mixed', 'Happiness mixed with sadness', '#DEB887');

-- Insert default communities
INSERT INTO communities (name, description, tags) VALUES
('Solo Entrepreneurs', 'Support for first-time entrepreneurs navigating business challenges alone', '["entrepreneurship", "business", "startup", "isolation"]'),
('ADHD Support', 'Understanding and managing ADHD in daily life', '["adhd", "neurodiversity", "focus", "productivity"]'),
('Life Transitions', 'Navigating major life changes and challenges', '["change", "growth", "transition", "uncertainty"]'),
('Relationship Challenges', 'Support for relationship and family difficulties', '["relationships", "family", "communication", "conflict"]'),
('Mental Health Journey', 'Sharing experiences with mental health challenges', '["mental-health", "therapy", "healing", "recovery"]'),
('Career & Purpose', 'Finding meaning and direction in work and life', '["career", "purpose", "fulfillment", "direction"]'); 