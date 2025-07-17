# 🌩️ Cloud Database Alternatives for PeerConnect

Since your Supabase has expired, here are excellent alternatives on GCP and AWS that work perfectly with PeerConnect:

## 🥇 **RECOMMENDED: Google Cloud SQL PostgreSQL**

### ⚡ Quick Setup (5 minutes):

```bash
# Create PostgreSQL instance
gcloud sql instances create peerconnect-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --authorized-networks=0.0.0.0/0

# Create database
gcloud sql databases create peerconnect --instance=peerconnect-db

# Create user
gcloud sql users create peerconnect-user \
  --instance=peerconnect-db \
  --password=your-secure-password

# Get public IP
gcloud sql instances describe peerconnect-db --format="value(connectionName)"

# Get public IP address
gcloud sql instances describe peerconnect-db --format="value(ipAddresses[0].ipAddress)"
```

**Update backend/.env:**
```env
DATABASE_URL="postgresql://peerconnect-user:your-secure-password@PUBLIC_IP:5432/peerconnect"
```

### **Cost Estimate**
- **db-f1-micro**: ~$7/month (perfect for MVP)
- **db-g1-small**: ~$25/month (production ready)
- **Storage**: $0.17/GB/month

---

## 🥈 **Alternative 1: AWS RDS PostgreSQL**

### **Why AWS RDS?**
- ✅ **Reliable**: Industry standard with excellent performance
- ✅ **Managed**: Automated backups, updates, monitoring
- ✅ **Scalable**: Easy vertical and horizontal scaling
- ✅ **Secure**: VPC, encryption, IAM integration

### **Setup Instructions**

#### 1. Create RDS Instance (AWS Console)
```
1. Go to AWS RDS Console
2. Click "Create database"
3. Choose "PostgreSQL"
4. Select "Free tier" template
5. Settings:
   - DB instance identifier: peernexus-db
   - Master username: postgres
   - Master password: your-secure-password
6. DB instance class: db.t3.micro (free tier)
7. Storage: 20 GB SSD
8. Public access: Yes
9. Create database
```

#### 2. Configure Security Group
```
1. Go to EC2 > Security Groups
2. Find your RDS security group
3. Add inbound rule:
   - Type: PostgreSQL
   - Port: 5432
   - Source: 0.0.0.0/0 (for development)
```

#### 3. Update Backend Configuration
```env
# backend/.env
DATABASE_URL="postgresql://postgres:your-secure-password@your-rds-endpoint:5432/postgres"
```

### **Cost Estimate**
- **db.t3.micro**: Free tier for 12 months, then ~$13/month
- **Storage**: $0.115/GB/month

---

## 🥉 **Alternative 2: Google Cloud Firestore (NoSQL)**

### **Why Firestore?**
- ✅ **Serverless**: No infrastructure management
- ✅ **Real-time**: Built-in real-time updates
- ✅ **Scalable**: Automatic scaling to millions of users
- ✅ **Free tier**: Generous free quota

### **Setup Instructions**

#### 1. Enable Firestore
```bash
# Enable Firestore API
gcloud services enable firestore.googleapis.com

# Create Firestore database
gcloud firestore databases create --region=us-central1
```

#### 2. Install Firebase Admin SDK
```bash
cd backend
npm install firebase-admin
```

#### 3. Update Backend for Firestore
I'll create the Firestore adapter below.

### **Cost Estimate**
- **Free tier**: 50K reads, 20K writes per day
- **Paid**: $0.18/100K reads, $0.18/100K writes

---

## 🥉 **Alternative 3: AWS DynamoDB (NoSQL)**

### **Why DynamoDB?**
- ✅ **Serverless**: Pay per request
- ✅ **Fast**: Single-digit millisecond latency
- ✅ **Scalable**: Handles any workload size
- ✅ **Free tier**: 25GB storage, 25 RCU/WCU

### **Setup Instructions**

#### 1. Create DynamoDB Tables (AWS Console)
```
Tables needed:
- users
- posts  
- communities
- emotions
- user_emotions
- post_reactions
- hope_threads
- success_stories
```

#### 2. Install AWS SDK
```bash
cd backend
npm install aws-sdk
```

### **Cost Estimate**
- **Free tier**: 25GB storage + 25 RCU/WCU
- **On-demand**: $1.25/million writes, $0.25/million reads

---

## 🚀 **Quick Migration Scripts**

### **For PostgreSQL (Cloud SQL or RDS)**
```bash
# Run the existing migration
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB -f supabase/migrations/001_initial_schema.sql
```

### **For Firestore**
I'll create the Firestore service adapter:

```typescript
// backend/src/lib/firestore.ts
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  });
}

export const db = admin.firestore();
```

## 📊 **Comparison Table**

| Feature | Google Cloud SQL | AWS RDS | Firestore | DynamoDB |
|---------|------------------|---------|-----------|----------|
| **Type** | SQL | SQL | NoSQL | NoSQL |
| **Setup Time** | 5 min | 10 min | 2 min | 5 min |
| **Free Tier** | $7/month | 12 months free | Generous | 25GB free |
| **Scaling** | Manual | Manual | Automatic | Automatic |
| **Real-time** | No | No | Yes | No |
| **SQL Support** | ✅ | ✅ | ❌ | ❌ |
| **Learning Curve** | Low | Low | Medium | Medium |

## 🎯 **My Recommendation**

For PeerConnect, I recommend **Google Cloud SQL PostgreSQL** because:

1. **Drop-in replacement**: No code changes needed
2. **Cost-effective**: Starting at $7/month
3. **PostgreSQL compatibility**: All existing SQL works
4. **Easy migration**: Just change the DATABASE_URL
5. **Production ready**: Scales to millions of users

## 🚀 **Next Steps**

1. **Choose your preferred option** (I recommend Google Cloud SQL)
2. **Follow the setup instructions** above
3. **Update your `.env` file** with new database URL
4. **Run the migration**: `psql -f supabase/migrations/001_initial_schema.sql`
5. **Test the application**: `npm run dev`

Would you like me to help you set up any of these alternatives? 