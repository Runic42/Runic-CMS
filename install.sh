#!/bin/bash

# Runic CMS Installation Script
# This script helps you set up Runic CMS quickly

set -e

echo "🏰 Runic CMS Installation Script"
echo "================================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. You have $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Ask deployment method
echo ""
echo "Choose your deployment method:"
echo "1) Docker (Recommended - All-in-one)"
echo "2) Manual (Frontend + Backend + PostgreSQL)"
echo "3) Supabase Backend (Serverless)"
echo ""
read -p "Enter your choice (1-3): " CHOICE

case $CHOICE in
    1)
        echo ""
        echo "🐳 Setting up with Docker..."
        
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker is not installed. Please install Docker first."
            exit 1
        fi
        
        if ! command -v docker-compose &> /dev/null; then
            echo "❌ Docker Compose is not installed. Please install Docker Compose first."
            exit 1
        fi
        
        echo "✅ Docker found"
        
        cd docker-aio
        
        # Generate secrets
        DB_PASSWORD=$(openssl rand -base64 32)
        JWT_SECRET=$(openssl rand -base64 32)
        
        # Create .env file
        cat > .env << EOF
DB_PASSWORD=${DB_PASSWORD}
JWT_SECRET=${JWT_SECRET}
EOF
        
        echo ""
        echo "Starting Docker containers..."
        docker-compose up -d
        
        echo ""
        echo "✅ Installation complete!"
        echo ""
        echo "🌐 Services:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:3001"
        echo "   Admin:    http://localhost:3000/admin"
        echo ""
        echo "📝 Next steps:"
        echo "   1. Wait 30 seconds for services to start"
        echo "   2. Create admin account: curl -X POST http://localhost:3001/api/auth/register \\"
        echo "      -H 'Content-Type: application/json' \\"
        echo "      -d '{\"email\":\"admin@example.com\",\"password\":\"SecurePassword123\",\"username\":\"admin\"}'"
        echo "   3. Visit http://localhost:3000/admin and login"
        echo ""
        echo "📖 Documentation: See README.md"
        ;;
        
    2)
        echo ""
        echo "💻 Setting up manually..."
        
        if ! command -v psql &> /dev/null; then
            echo "❌ PostgreSQL is not installed. Please install PostgreSQL 14+ first."
            exit 1
        fi
        
        echo "✅ PostgreSQL found"
        
        # Database setup
        read -p "Enter database name (default: runic_cms): " DB_NAME
        DB_NAME=${DB_NAME:-runic_cms}
        
        read -p "Enter database user (default: postgres): " DB_USER
        DB_USER=${DB_USER:-postgres}
        
        read -sp "Enter database password: " DB_PASSWORD
        echo ""
        
        echo "Creating database..."
        createdb "$DB_NAME" || echo "Database might already exist"
        
        echo "Initializing schema..."
        PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USER" -d "$DB_NAME" -f backend/src/db/schema.sql
        
        # Backend setup
        echo ""
        echo "Setting up backend..."
        cd backend
        
        npm install
        
        JWT_SECRET=$(openssl rand -base64 32)
        
        cat > .env << EOF
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
JWT_SECRET=${JWT_SECRET}
FRONTEND_URL=http://localhost:3000
EOF
        
        echo "Starting backend..."
        npm run dev &
        BACKEND_PID=$!
        
        cd ..
        
        # Frontend setup
        echo ""
        echo "Setting up frontend..."
        cd frontend
        
        npm install
        
        cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
        
        echo "Starting frontend..."
        npm run dev &
        FRONTEND_PID=$!
        
        cd ..
        
        echo ""
        echo "✅ Installation complete!"
        echo ""
        echo "🌐 Services:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:3001"
        echo "   Admin:    http://localhost:3000/admin"
        echo ""
        echo "📝 Next steps:"
        echo "   1. Create admin account using the API"
        echo "   2. Visit http://localhost:3000/admin and login"
        echo ""
        echo "To stop services:"
        echo "   kill $BACKEND_PID $FRONTEND_PID"
        ;;
        
    3)
        echo ""
        echo "☁️ Setting up with Supabase backend..."
        
        echo ""
        echo "Please complete these steps:"
        echo ""
        echo "1. Go to https://supabase.com and create an account"
        echo "2. Create a new project"
        echo "3. Go to SQL Editor in your Supabase dashboard"
        echo "4. Copy and paste the content from backend-guide/supabase-schema.sql"
        echo "5. Run the SQL"
        echo ""
        read -p "Press Enter when you've completed the above steps..."
        
        echo ""
        read -p "Enter your Supabase URL: " SUPABASE_URL
        read -p "Enter your Supabase anon key: " SUPABASE_KEY
        
        cd frontend
        
        npm install
        
        cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY}
EOF
        
        echo ""
        echo "Starting frontend..."
        npm run dev
        
        echo ""
        echo "✅ Installation complete!"
        echo ""
        echo "🌐 Frontend: http://localhost:3000"
        echo "🌐 Admin: http://localhost:3000/admin"
        echo ""
        echo "📝 Note: Backend is powered by Supabase"
        ;;
        
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "📚 For more information, see:"
echo "   - README.md - Full documentation"
echo "   - QUICKSTART.md - Quick start guide"
echo "   - CONTRIBUTING.md - How to contribute"
echo ""
echo "Need help? Visit https://github.com/yourusername/runic-cms/issues"
