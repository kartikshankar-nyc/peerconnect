# PeerNexus Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd peernexus

# Install all dependencies
npm run setup
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Copy `backend/env.example` to `backend/.env`
4. Update the environment variables:

```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Database Migration

Run the SQL migration in your Supabase SQL editor:

```bash
# Copy the contents of supabase/migrations/001_initial_schema.sql
# and run it in your Supabase SQL editor
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Runs on http://localhost:3000
npm run dev:backend   # Runs on http://localhost:3001
```

## Project Structure

```
peernexus/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── public/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── lib/           # Utilities and configs
│   │   └── types/         # TypeScript types
│   └── dist/              # Compiled JavaScript
├── supabase/               # Database migrations
└── docs/                   # Documentation
```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run test` - Run all tests
- `npm run build` - Build both frontend and backend
- `npm run setup` - Install all dependencies

### Backend
- `npm run dev:backend` - Start backend in development mode
- `npm run test:backend` - Run backend tests
- `npm run build:backend` - Build backend for production

### Frontend
- `npm run dev:frontend` - Start frontend in development mode
- `npm run test:frontend` - Run frontend tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run build:frontend` - Build frontend for production

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:backend -- --watch
npm run test:frontend -- --watch

# Run with coverage
npm run test:backend -- --coverage
```

### Test-Driven Development

This project follows TDD principles:

1. Write a failing test
2. Write minimal code to make it pass
3. Refactor while keeping tests green

Example test structure:
```typescript
describe('UserService', () => {
  it('should create anonymous user', async () => {
    // Arrange
    const mockUser = { id: '123', anonymous_id: 'anon_456' };
    
    // Act
    const result = await userService.createAnonymousUser();
    
    // Assert
    expect(result).toEqual(mockUser);
  });
});
```

## Key Features Implemented

### Phase 1 (MVP)
- ✅ Anonymous user creation
- ✅ Basic emotion detection
- ✅ Post creation with emotion analysis
- ✅ Database schema with privacy-first design
- ✅ API endpoints for users and posts
- 🔄 Frontend UI components (in progress)

### Innovative Features
- **Emotion-Aware Matching**: AI-powered content matching based on emotional state
- **Empathy Scoring**: Algorithm to measure and reward genuine empathy
- **Hope Threads**: Connect people who overcame challenges with those currently facing them
- **Anonymous Success Stories**: Automatically generated inspiration from user journeys

## API Documentation

### User Endpoints
- `POST /api/users/anonymous` - Create anonymous user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id/preferences` - Update preferences

### Post Endpoints
- `POST /api/posts` - Create new post
- `GET /api/posts` - Get feed posts
- `GET /api/posts/recommendations/:userId` - Get emotion-based recommendations
- `POST /api/posts/:id/reactions` - Add reaction to post

### Example API Usage

```javascript
// Create anonymous user
const response = await fetch('/api/users/anonymous', {
  method: 'POST',
});
const { data: user } = await response.json();

// Create post with emotion detection
const post = await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Feeling overwhelmed with my startup journey',
    authorId: user.id,
    communityId: 'solo-entrepreneurs'
  })
});
```

## Environment Variables

### Backend (.env)
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# AI Services (optional for Phase 1)
OPENAI_API_KEY=your-openai-key
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build:frontend`
3. Set output directory: `frontend/dist`

### Backend (Railway/Render)
1. Connect your GitHub repo
2. Set build command: `npm run build:backend`
3. Set start command: `npm start`
4. Add environment variables

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify your environment variables
   - Check if your Supabase project is active
   - Ensure you've run the database migration

2. **Port Already in Use**
   ```bash
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   ```

3. **Module Not Found Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## Contributing

1. Follow TDD principles
2. Write tests before implementing features
3. Update the roadmap when completing tasks
4. Ensure all tests pass before committing

## Privacy & Security

- No personal data is stored (anonymous by design)
- All user interactions are anonymous
- Content moderation prevents harmful content
- GDPR compliant with user deletion capabilities

## Support

For questions or issues:
1. Check this setup guide
2. Review the project roadmap
3. Check existing tests for usage examples
4. Create an issue if needed 