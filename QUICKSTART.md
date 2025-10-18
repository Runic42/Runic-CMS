# 🚀 Runic CMS - Quick Start Guide

Get Runic CMS up and running in 5 minutes!

## Choose Your Deployment Method

### 1. 🐳 Docker (Easiest - Recommended for beginners)

Perfect if you want everything running with one command.

```bash
# Clone the repository
git clone https://github.com/yourusername/runic-cms.git
cd runic-cms

# Start everything with Docker
cd docker-aio
docker-compose up -d

# Wait about 30 seconds for services to start

# Open in browser
open http://localhost:3000
```

**What you get:**
- ✅ Frontend on http://localhost:3000
- ✅ Backend API on http://localhost:3001  
- ✅ PostgreSQL database (internal)
- ✅ Everything configured and ready

**Next steps:**
1. Go to http://localhost:3000/admin
2. Register your admin account (use the API or configure in .env)
3. Start building!

---

### 2. ☁️ Supabase + Vercel (Best for production)

Perfect for serverless deployment with no server management.

**Step 1: Setup Supabase (5 minutes)**

1. Go to [supabase.com](https://supabase.com) and create account
2. Create a new project
3. Go to SQL Editor
4. Copy and paste content from `backend-guide/supabase-schema.sql`
5. Run the SQL
6. Get your project URL and anon key from Project Settings > API

**Step 2: Deploy Frontend (3 minutes)**

```bash
# Clone and install
git clone https://github.com/yourusername/runic-cms.git
cd runic-cms/frontend
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EOF

# Deploy to Vercel
npm install -g vercel
vercel
```

**What you get:**
- ✅ Automatic scaling
- ✅ No server management
- ✅ Free tier available
- ✅ Global CDN

---

### 3. 💻 Manual Installation (Most control)

Perfect if you want to customize everything.

**Prerequisites:**
- Node.js 18+
- PostgreSQL 14+

**Step 1: Database Setup**

```bash
# Create database
createdb runic_cms

# Initialize schema
cd backend
psql -d runic_cms -f src/db/schema.sql
```

**Step 2: Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Create .env
cat > .env << EOF
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=runic_cms
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=$(openssl rand -base64 32)
FRONTEND_URL=http://localhost:3000
EOF

# Start backend
npm run dev
```

Backend is now running on http://localhost:3001

**Step 3: Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

# Start frontend
npm run dev
```

Frontend is now running on http://localhost:3000

---

## First Steps After Installation

### 1. Create Admin Account

**Option A: Using API**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123",
    "username": "admin"
  }'
```

**Option B: Using Supabase**
- Go to Supabase Dashboard > Authentication
- Create new user
- Set role to 'admin' in user_profiles table

### 2. Login

1. Go to http://localhost:3000/admin
2. Login with your credentials
3. You'll see the admin dashboard

### 3. Create Your First Page

1. Click "New Page"
2. Enter title and slug
3. Start adding content objects:
   - Text blocks
   - Image galleries
   - Videos
   - YouTube embeds
4. Preview on different devices
5. Publish when ready!

### 4. Customize Site Settings

1. Go to Admin > Settings
2. Configure:
   - Site name
   - Logo and favicon
   - Theme colors
   - Navigation menu
   - Footer

### 5. Explore the Marketplace

1. Go to Admin > Marketplace
2. Browse templates and themes
3. Install items you like
4. (Coming soon - full marketplace)

---

## Common Issues & Solutions

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # or :3001

# Kill process
kill -9 <PID>

# Or use different ports
PORT=3002 npm run dev
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Check connection details
psql -d runic_cms -U postgres

# Reset database if needed
dropdb runic_cms
createdb runic_cms
psql -d runic_cms -f backend/src/db/schema.sql
```

### Docker Container Won't Start

```bash
# Check logs
docker-compose logs

# Restart fresh
docker-compose down -v
docker-compose up -d --build

# Check status
docker-compose ps
```

### Frontend Can't Connect to Backend

1. Check backend is running: `curl http://localhost:3001/health`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Check CORS settings in backend `.env`
4. Check browser console for errors

---

## Next Steps

- 📖 Read the [full documentation](./README.md)
- 🎨 Explore [marketplace items](./marketplace/README.md)
- 🛠️ Learn [how to create extensions](./marketplace/DEVELOPER_GUIDE.md)
- 🐛 Report issues on [GitHub](https://github.com/yourusername/runic-cms/issues)
- 💬 Join our [Discord community](https://discord.gg/runic-cms)

---

## Production Deployment Checklist

Before going live:

- [ ] Change JWT_SECRET to a strong random key
- [ ] Change database passwords
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Set up automated backups
- [ ] Configure monitoring and logging
- [ ] Test on multiple devices
- [ ] Set up CDN for media files
- [ ] Configure email notifications
- [ ] Review security settings

---

## Getting Help

**Found a bug?**
- [Report on GitHub](https://github.com/yourusername/runic-cms/issues)

**Have a question?**
- [GitHub Discussions](https://github.com/yourusername/runic-cms/discussions)
- [Discord Community](https://discord.gg/runic-cms)

**Need features?**
- [Request a feature](https://github.com/yourusername/runic-cms/issues/new?template=feature_request.md)

---

Happy building! 🎉
