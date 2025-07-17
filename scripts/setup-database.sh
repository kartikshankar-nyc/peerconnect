#!/bin/bash
# PeerConnect Database Setup Script
echo "🚀 PeerConnect Database Setup"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found"
    echo "📦 Install with: brew install --cask google-cloud-sdk"
    exit 1
fi

echo "✅ Google Cloud CLI found"

# Check authentication
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please authenticate with Google Cloud"
    echo "🔑 Run: gcloud auth login"
    exit 1
fi

echo "✅ Authenticated with Google Cloud"

# Display setup commands
echo ""
echo "📋 Copy and run these commands:"
echo ""
echo "1. 🗄️  Create database instance:"
echo "   gcloud sql instances create peerconnect-db \\"
echo "     --database-version=POSTGRES_15 \\"
echo "     --tier=db-f1-micro \\"
echo "     --region=us-central1 \\"
echo "     --storage-type=SSD \\"
echo "     --storage-size=10GB \\"
echo "     --authorized-networks=0.0.0.0/0"
echo ""
echo "2. 📊 Create database:"
echo "   gcloud sql databases create peerconnect --instance=peerconnect-db"
echo ""
echo "3. 👤 Create user:"
echo "   gcloud sql users create peerconnect-user \\"
echo "     --instance=peerconnect-db \\"
echo "     --password=your-secure-password"
echo ""
echo "4. 🌐 Get IP address:"
echo "   gcloud sql instances describe peerconnect-db --format=\"value(ipAddresses[0].ipAddress)\""
echo ""
echo "5. ⚙️  Update backend/.env:"
echo "   DATABASE_URL=\"postgresql://peerconnect-user:your-password@IP:5432/peerconnect\""

echo ""
echo "Choose your database provider:"
echo "1) Google Cloud SQL (PostgreSQL) - Recommended"
echo "2) AWS RDS (PostgreSQL)"
echo "3) Local PostgreSQL"
echo "4) Google Firestore"
echo "5) AWS DynamoDB"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Setting up Google Cloud SQL..."
        echo "Please follow these steps:"
        echo ""
        echo "1. Install gcloud CLI: https://cloud.google.com/sdk/docs/install"
        echo "2. Run: gcloud auth login"
        echo "3. Create instance:"
        echo "   gcloud sql instances create peernexus-db \\"
        echo "     --database-version=POSTGRES_15 \\"
        echo "     --tier=db-f1-micro \\"
        echo "     --region=us-central1 \\"
        echo "     --storage-type=SSD \\"
        echo "     --storage-size=10GB \\"
        echo "     --authorized-networks=0.0.0.0/0"
        echo ""
        echo "4. Create database:"
        echo "   gcloud sql databases create peernexus --instance=peernexus-db"
        echo ""
        echo "5. Create user:"
        echo "   gcloud sql users create peernexus-user \\"
        echo "     --instance=peernexus-db \\"
        echo "     --password=your-secure-password"
        echo ""
        echo "6. Get IP address:"
        echo "   gcloud sql instances describe peernexus-db --format=\"value(ipAddresses[0].ipAddress)\""
        echo ""
        echo "7. Update backend/.env with:"
        echo "   DB_PROVIDER=\"postgresql\""
        echo "   DATABASE_URL=\"postgresql://peernexus-user:your-password@IP:5432/peernexus\""
        ;;
    2)
        echo ""
        echo "🔧 Setting up AWS RDS..."
        echo "Please follow these steps:"
        echo ""
        echo "1. Go to AWS RDS Console"
        echo "2. Click 'Create database'"
        echo "3. Choose PostgreSQL"
        echo "4. Select 'Free tier' template"
        echo "5. Configure:"
        echo "   - DB instance identifier: peernexus-db"
        echo "   - Master username: postgres"
        echo "   - Master password: your-secure-password"
        echo "   - DB instance class: db.t3.micro"
        echo "   - Public access: Yes"
        echo ""
        echo "6. Update backend/.env with:"
        echo "   DB_PROVIDER=\"postgresql\""
        echo "   DATABASE_URL=\"postgresql://postgres:password@endpoint:5432/postgres\""
        ;;
    3)
        echo ""
        echo "🔧 Setting up Local PostgreSQL..."
        echo "Please ensure PostgreSQL is installed and running"
        echo ""
        echo "Update backend/.env with:"
        echo "DB_PROVIDER=\"postgresql\""
        echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/peerconnect\""
        ;;
    4)
        echo ""
        echo "🔧 Setting up Google Firestore..."
        echo "Please follow these steps:"
        echo ""
        echo "1. Install gcloud CLI and login"
        echo "2. Enable Firestore: gcloud services enable firestore.googleapis.com"
        echo "3. Create database: gcloud firestore databases create --region=us-central1"
        echo "4. Create service account and download JSON key"
        echo ""
        echo "Update backend/.env with:"
        echo "DB_PROVIDER=\"firestore\""
        echo "GOOGLE_CLOUD_PROJECT_ID=\"your-project-id\""
        echo "GOOGLE_APPLICATION_CREDENTIALS=\"./service-account.json\""
        ;;
    5)
        echo ""
        echo "🔧 Setting up AWS DynamoDB..."
        echo "Please follow these steps:"
        echo ""
        echo "1. Go to AWS DynamoDB Console"
        echo "2. Create tables: users, posts, communities, emotions, etc."
        echo "3. Configure AWS credentials"
        echo ""
        echo "Update backend/.env with:"
        echo "DB_PROVIDER=\"dynamodb\""
        echo "AWS_REGION=\"us-east-1\""
        echo "AWS_ACCESS_KEY_ID=\"your-key\""
        echo "AWS_SECRET_ACCESS_KEY=\"your-secret\""
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📋 Next Steps:"
echo "1. Update backend/.env with your database credentials"
echo "2. Run database migration (for PostgreSQL):"
echo "   psql -h HOST -U USER -d DATABASE -f supabase/migrations/001_initial_schema.sql"
echo "3. Test the application: npm run dev"
echo ""
echo "📚 For detailed instructions, see: CLOUD_DATABASE_ALTERNATIVES.md" 