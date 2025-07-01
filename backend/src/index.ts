import express from 'express';
import cors from 'cors';
import { demoDataService } from './services/demo-data.service';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        mode: 'demo',
        message: 'PeerNexus Demo API is running'
    });
});

// Communities endpoints
app.get('/api/communities', (req, res) => {
    try {
        const communities = demoDataService.getCommunities();
        res.json({ data: communities });
    } catch (error) {
        console.error('Error fetching communities:', error);
        res.status(500).json({ error: 'Failed to fetch communities' });
    }
});

app.get('/api/communities/:id', (req, res) => {
    try {
        const community = demoDataService.getCommunity(req.params.id);
        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }
        res.json({ data: community });
    } catch (error) {
        console.error('Error fetching community:', error);
        res.status(500).json({ error: 'Failed to fetch community' });
    }
});

// Posts endpoints
app.get('/api/posts', (req, res) => {
    try {
        const { communityId } = req.query;
        const posts = demoDataService.getPosts(communityId as string);
        res.json({ data: posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.get('/api/posts/:id', (req, res) => {
    try {
        const post = demoDataService.getPost(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ data: post });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

app.post('/api/posts', (req, res) => {
    try {
        const { content, communityId, userId } = req.body;

        if (!content || !communityId) {
            return res.status(400).json({ error: 'Content and communityId are required' });
        }

        const newPost = demoDataService.createPost(content, communityId, userId);
        res.status(201).json({ data: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Users endpoints
app.get('/api/users', (req, res) => {
    try {
        const users = demoDataService.getUsers();
        res.json({ data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('/api/users/anonymous', (req, res) => {
    try {
        const newUser = demoDataService.createUser();
        res.status(201).json({ data: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 PeerNexus API running on port ${PORT}`);
    console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
    console.log(`🎭 Demo endpoints available at:`);
    console.log(`   - Communities: http://localhost:${PORT}/api/communities`);
    console.log(`   - Posts: http://localhost:${PORT}/api/posts`);
    console.log(`   - Users: http://localhost:${PORT}/api/users`);
}); 