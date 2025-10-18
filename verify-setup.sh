#!/bin/bash

# Runic CMS Setup Verification Script
# Checks if your installation is correctly configured

echo "🏰 Runic CMS Setup Verification"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

check_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

# Check Node.js
echo "Checking prerequisites..."
echo ""

if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_status "Node.js installed: $NODE_VERSION"
    
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -lt 18 ]; then
        check_warning "Node.js version should be 18 or higher"
    fi
else
    check_status "Node.js installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_status "npm installed: $NPM_VERSION"
else
    check_status "npm installed"
fi

echo ""
echo "Checking project structure..."
echo ""

# Check directories
[ -d "frontend" ] && check_status "frontend/ directory exists" || check_status "frontend/ directory exists"
[ -d "backend" ] && check_status "backend/ directory exists" || check_status "backend/ directory exists"
[ -d "docker-aio" ] && check_status "docker-aio/ directory exists" || check_status "docker-aio/ directory exists"

echo ""
echo "Checking frontend setup..."
echo ""

# Check frontend files
[ -f "frontend/package.json" ] && check_status "frontend/package.json exists" || check_status "frontend/package.json exists"
[ -d "frontend/node_modules" ] && check_status "frontend dependencies installed" || check_warning "frontend dependencies not installed (run: cd frontend && npm install)"
[ -d "frontend/.next" ] && check_status "frontend built" || check_warning "frontend not built yet (run: cd frontend && npm run build)"

# Check frontend env
if [ -f "frontend/.env.local" ] || [ -f "frontend/.env" ]; then
    check_status "frontend environment variables configured"
else
    check_warning "frontend environment variables not configured"
fi

echo ""
echo "Checking backend setup..."
echo ""

# Check backend files
[ -f "backend/package.json" ] && check_status "backend/package.json exists" || check_status "backend/package.json exists"
[ -d "backend/node_modules" ] && check_status "backend dependencies installed" || check_warning "backend dependencies not installed (run: cd backend && npm install)"
[ -d "backend/dist" ] && check_status "backend built" || check_warning "backend not built yet (run: cd backend && npm run build)"

# Check backend env
if [ -f "backend/.env" ]; then
    check_status "backend environment variables configured"
    
    # Check for critical env vars
    if grep -q "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" backend/.env; then
        check_warning "JWT_SECRET is using default value - change this in production!"
    fi
    
    if grep -q "DB_PASSWORD=postgres" backend/.env; then
        check_warning "DB_PASSWORD is using default value - change this in production!"
    fi
else
    check_warning "backend environment variables not configured"
fi

# Check database schema
[ -f "backend/src/db/schema.sql" ] && check_status "database schema file exists" || check_status "database schema file exists"

echo ""
echo "Checking Docker setup..."
echo ""

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker -v)
    check_status "Docker installed: $DOCKER_VERSION"
else
    check_warning "Docker not installed (optional, but recommended)"
fi

if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose -v)
    check_status "Docker Compose installed: $COMPOSE_VERSION"
else
    check_warning "Docker Compose not installed (optional, but recommended)"
fi

[ -f "docker-aio/Dockerfile" ] && check_status "Dockerfile exists" || check_status "Dockerfile exists"
[ -f "docker-aio/docker-compose.yml" ] && check_status "docker-compose.yml exists" || check_status "docker-compose.yml exists"

echo ""
echo "Checking PostgreSQL..."
echo ""

if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    check_status "PostgreSQL client installed: $PSQL_VERSION"
    
    # Try to connect to database
    if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw runic_cms; then
        check_status "runic_cms database exists"
    else
        check_warning "runic_cms database not found"
    fi
else
    check_warning "PostgreSQL not installed (required for manual setup, not for Docker)"
fi

echo ""
echo "Checking documentation..."
echo ""

[ -f "README.md" ] && check_status "README.md exists" || check_status "README.md exists"
[ -f "QUICKSTART.md" ] && check_status "QUICKSTART.md exists" || check_status "QUICKSTART.md exists"
[ -f "CONTRIBUTING.md" ] && check_status "CONTRIBUTING.md exists" || check_status "CONTRIBUTING.md exists"
[ -f "LICENSE" ] && check_status "LICENSE exists" || check_status "LICENSE exists"

echo ""
echo "================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your Runic CMS installation looks good!"
    echo ""
    echo "Next steps:"
    echo "1. Start the application (see QUICKSTART.md)"
    echo "2. Create your admin account"
    echo "3. Start building!"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup complete with $WARNINGS warning(s)${NC}"
    echo ""
    echo "Your installation is functional but has some warnings."
    echo "Review the warnings above for optimal configuration."
else
    echo -e "${RED}✗ Setup incomplete: $ERRORS error(s), $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before proceeding."
    echo "See QUICKSTART.md for installation instructions."
    exit 1
fi

echo ""
echo "For help, visit: https://github.com/yourusername/runic-cms"
