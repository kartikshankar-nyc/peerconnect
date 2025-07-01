# PeerNexus Deployment Guide

## 🚀 Quick Demo Access

**Live Demo:** [https://kartikshankar.github.io/peernexus/](https://kartikshankar.github.io/peernexus/)

The frontend is deployed automatically to GitHub Pages whenever code is pushed to the master branch.

## 🛠️ Deployment Options

### Option 1: GitHub Pages (Frontend Only - Recommended for Demo)

**Status:** ✅ Configured and Deployed
- **URL:** https://kartikshankar.github.io/peernexus/
- **Features:** Full frontend functionality with demo data
- **Limitations:** Backend features run in demo mode (no real database)

**Setup Steps:**
1. Fork this repository
2. Go to Settings > Pages > Source: GitHub Actions
3. The site will auto-deploy on every push to master

### Option 2: Full-Stack Deployment

For production with real backend functionality:

#### Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**Backend (Railway):**
1. Connect your GitHub repo to Railway
2. Deploy the `backend` folder
3. Set environment variables:
   - `DATABASE_URL`
   - `PORT=3001`
   - `NODE_ENV=production`

#### Alternative: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Option 3: Self-Hosted

**Requirements:**
- Node.js 18+
- PostgreSQL database
- PM2 for process management

**Setup:**
```bash
# Clone and install
git clone https://github.com/kartikshankar/peernexus.git
cd peernexus
npm install

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Build production
cd backend && npm run build
cd ../frontend && npm run build

# Start with PM2
pm2 start ecosystem.config.js
```

## 🔧 Environment Configuration

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/peernexus"
PORT=3001
NODE_ENV=production
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-key" # Optional for AI features
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com
```

## 📱 Features Available in Demo Mode

Since the demo runs frontend-only on GitHub Pages:

✅ **Working Features:**
- Complete UI/UX experience
- Navigation between all pages
- Responsive design showcase
- Component interactions
- Demo data visualization

🔄 **Demo Mode Features:**
- User authentication (mock)
- Community browsing (demo data)
- Post creation (local storage)
- Profile management (simulated)
- Emotion analysis (client-side demo)

❌ **Requires Backend:**
- Real user accounts
- Persistent data storage
- Real-time messaging
- AI-powered emotion analysis
- Cross-user interactions

## 🎯 For Reviewers & Demo Users

The GitHub Pages deployment at **https://kartikshankar.github.io/peernexus/** showcases:

1. **Complete Frontend Experience** - All pages and components
2. **Design System** - Custom 8pt grid system with emotion-based colors
3. **Responsive Design** - Works perfectly on mobile and desktop
4. **User Journey** - From onboarding through community interaction
5. **Innovation Features** - Empathy scoring, Hope Threads, emotion analysis UI

## 🔄 Deployment Status

- ✅ GitHub Pages: Auto-deployed from master branch
- ⏳ Backend: Ready for deployment to your preferred platform
- ✅ Docker: Production-ready containers available
- ✅ CI/CD: GitHub Actions configured

## 🆘 Troubleshooting

**Common Issues:**

1. **404 on refresh:** GitHub Pages SPA routing issue
   - Solution: Uses client-side routing fallback

2. **API errors:** Backend not connected in demo mode
   - Expected behavior: Demo mode handles this gracefully

3. **Build failures:** Check Node.js version
   - Required: Node.js 18+

## 📞 Support

For deployment issues or questions:
- Check the [Issues](https://github.com/kartikshankar/peernexus/issues) tab
- Review the main [README.md](./README.md) for development setup

---

🎉 **Try the live demo now:** [PeerNexus Demo](https://kartikshankar.github.io/peernexus/) 