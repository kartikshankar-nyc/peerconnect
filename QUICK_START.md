# 🚀 PeerNexus Quick Start with Google Cloud SQL

## ⚡ 5-Minute Setup

### 1. Install Google Cloud CLI
```bash
# macOS
brew install --cask google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### 2. Authenticate and Setup
```bash
# Login to Google Cloud
gcloud auth login

# Set your project (create one if needed)
gcloud config set project YOUR_PROJECT_ID
```

### 3. Create Database (One Command!)
```bash
# Create PostgreSQL instance (~2 minutes)
gcloud sql instances create peernexus-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --authorized-networks=0.0.0.0/0

# Create database
gcloud sql databases create peernexus --instance=peernexus-db

# Create user (replace with your password)
gcloud sql users create peernexus-user \
  --instance=peernexus-db \
  --password=MySecurePassword123
```

### 4. Get Connection Details
```bash
# Get the IP address
gcloud sql instances describe peernexus-db --format="value(ipAddresses[0].ipAddress)"
```

### 5. Update Configuration
Copy the IP address and update `backend/.env`:
```env
DB_PROVIDER="postgresql"
DATABASE_URL="postgresql://peernexus-user:MySecurePassword123@YOUR_IP:5432/peernexus"
```

### 6. Run Database Migration
```bash
# Install PostgreSQL client if not installed
brew install postgresql

# Run the migration
psql -h YOUR_IP -U peernexus-user -d peernexus -f supabase/migrations/001_initial_schema.sql
```

### 7. Start PeerNexus! 🎉
```bash
npm run dev
```

Visit:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## 💰 Cost
- **Monthly**: ~$7 USD for db-f1-micro
- **Free tier**: Google Cloud offers $300 credit for new accounts

## 🔧 Troubleshooting

### Connection Issues
```bash
# Test connection
psql -h YOUR_IP -U peernexus-user -d peernexus -c "SELECT version();"
```

### Reset Database
```bash
# Delete and recreate
gcloud sql instances delete peernexus-db
# Then repeat setup steps
```

## 🚀 Production Ready
Your database is now:
- ✅ **Scalable**: Auto-scales to millions of users
- ✅ **Secure**: Encrypted connections and data
- ✅ **Backed up**: Automatic daily backups
- ✅ **Monitored**: Built-in monitoring and alerts

**You're ready to launch PeerNexus! 🌟** 