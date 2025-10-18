# 🏰 Getting Started with Runic CMS

Welcome to Runic CMS! This guide will help you get up and running quickly.

## 📋 What You've Got

Runic CMS is a complete, self-hosted Content Management System with:

- ✅ **49 project files** ready to use
- ✅ **Drag-and-drop page builder** with visual editor
- ✅ **Multiple deployment options** (Docker, Supabase, Self-hosted)
- ✅ **Full documentation** and guides
- ✅ **Production-ready** architecture

## 🎯 Choose Your Path

### Path 1: Just Want to Try It? (5 minutes)
**→ Use Docker**

```bash
cd docker-aio
docker-compose up -d
# Wait 30 seconds, then visit http://localhost:3000
```

[Full Docker Guide](./docker-aio/README.md)

---

### Path 2: Building a Real Site? (15 minutes)
**→ Use Supabase + Vercel**

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run SQL from `backend-guide/supabase-schema.sql`
3. Deploy frontend to Vercel
4. Add environment variables
5. Done!

[Full Supabase Guide](./backend-guide/README.md)

---

### Path 3: Want Full Control? (30 minutes)
**→ Self-Host Everything**

1. Install PostgreSQL
2. Setup backend
3. Setup frontend
4. Configure Nginx
5. Add SSL

[Full Self-Hosting Guide](./DEPLOYMENT.md)

---

## 🚀 Quick Start (Docker Method)

### Step 1: Prerequisites

Make sure you have:
- Docker & Docker Compose installed
- Ports 3000, 3001 free

Check with:
```bash
docker --version
docker-compose --version
```

### Step 2: Start Runic CMS

```bash
# Clone repository
git clone https://github.com/yourusername/runic-cms.git
cd runic-cms

# Verify setup
./verify-setup.sh

# Start with Docker
cd docker-aio
docker-compose up -d

# Check status
docker-compose ps
```

### Step 3: Create Admin Account

```bash
# Create your admin account
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "YourSecurePassword123",
    "username": "admin"
  }'
```

### Step 4: Login & Explore

1. Visit: http://localhost:3000/admin
2. Login with your credentials
3. Explore the dashboard!

---

## 📚 Understanding the Structure

```
runic-cms/
├── 📂 frontend/         Your Next.js website
│   ├── src/app/         Pages (admin, login, preview)
│   ├── src/components/  React components
│   └── src/lib/         API client & utilities
│
├── 📂 backend/          Your Express API
│   ├── src/routes/      API endpoints
│   ├── src/middleware/  Authentication
│   └── src/db/          Database schema
│
├── 📂 docker-aio/       All-in-one Docker setup
│   ├── Dockerfile       Container definition
│   └── docker-compose.yml  Service orchestration
│
├── 📂 backend-guide/    Supabase setup guide
├── 📂 marketplace/      Extension documentation
│
├── 📄 README.md         Main documentation
├── 📄 QUICKSTART.md     5-minute setup
├── 📄 DEPLOYMENT.md     Production deployment
└── 📄 CONTRIBUTING.md   How to contribute
```

---

## 🎨 Your First Page

### 1. Create a New Page

1. Go to Admin Dashboard
2. Click **"+ New Page"**
3. Enter:
   - Title: "Welcome"
   - Slug: "welcome"
4. Click **"Create Page"**

### 2. Add Content

You'll see the page editor with a palette on the left:

**Add a Text Block:**
1. Click **"Text Block"** from palette
2. Type your content
3. Customize styling in the right panel

**Add an Image Gallery:**
1. Click **"Image Gallery"**
2. Upload images (or add URLs)
3. Choose layout (grid/carousel/masonry)
4. Set columns for each device type

**Add a Video:**
1. Click **"Video"** or **"YouTube"**
2. Enter URL or video ID
3. Configure autoplay, controls, etc.

### 3. Preview & Publish

1. Click device icons to preview:
   - 🖥️ Desktop
   - 📱 Tablet
   - 📱 Mobile
2. Click **"Preview"** to see live version
3. Click **"Save"** when ready
4. Toggle **"Published"** to make it live

---

## ⚙️ Configure Your Site

### Site Settings

Go to **Admin → Settings** to configure:

**General:**
- Site name
- Logo URL
- Favicon URL

**Theme:**
- Primary color
- Secondary color
- Background color
- Text color
- Font family

**Advanced:**
- Custom CSS
- Custom JavaScript
- Navigation menu
- Footer content

---

## 🎯 Common Tasks

### Adding a Navigation Menu

1. Go to Settings
2. Scroll to Navigation
3. Add menu items with labels and URLs
4. Reorder as needed
5. Save

### Uploading Media

1. Create a new page or edit existing
2. Add a Gallery object
3. Click "Upload Images"
4. Select files from your computer
5. Add alt text and captions

### Exporting to HTML

1. Go to any page in admin
2. Click "Export" button
3. Download the HTML file
4. Host it anywhere!

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different ports in docker-compose.yml
```

### Can't Login

```bash
# Check backend is running
curl http://localhost:3001/health

# Check logs
docker-compose logs backend

# Reset password (via database)
docker exec -it runic-cms psql -U runic -d runic_cms
```

### Database Error

```bash
# Restart containers
docker-compose restart

# Check database
docker-compose exec runic-cms psql -U runic -l

# Reinitialize if needed
docker-compose down -v
docker-compose up -d
```

### Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📖 Next Steps

### Learn More

- **[Full Documentation](./README.md)** - Complete feature guide
- **[API Reference](./backend/README.md)** - API endpoints
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment
- **[Marketplace Guide](./marketplace/README.md)** - Extensions

### Customize

- **[Create Templates](./marketplace/DEVELOPER_GUIDE.md)**
- **[Build Plugins](./marketplace/DEVELOPER_GUIDE.md#creating-plugins)**
- **[Design Themes](./marketplace/DEVELOPER_GUIDE.md#creating-themes)**
- **[Add Elements](./marketplace/DEVELOPER_GUIDE.md#creating-elements)**

### Contribute

- **[Contributing Guide](./CONTRIBUTING.md)**
- **[GitHub Issues](https://github.com/yourusername/runic-cms/issues)**
- **[Discord Community](https://discord.gg/runic-cms)**

---

## 💡 Tips & Tricks

### Keyboard Shortcuts (coming soon)
- `Cmd/Ctrl + S` - Save page
- `Cmd/Ctrl + P` - Preview
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo

### Performance Tips
- Optimize images before uploading
- Use responsive images
- Enable caching in production
- Use a CDN for media files

### Security Best Practices
- Change default passwords immediately
- Use strong JWT secrets
- Enable HTTPS in production
- Regular backups
- Keep dependencies updated

---

## 🎉 You're Ready!

You now have a fully functional CMS. Here's what to do next:

1. ✅ Create your first page
2. ✅ Customize the theme
3. ✅ Add navigation menu
4. ✅ Upload some media
5. ✅ Preview on different devices
6. ✅ Publish your site!

---

## 🆘 Need Help?

### Documentation
- **Quick Questions**: Check [QUICKSTART.md](./QUICKSTART.md)
- **Detailed Info**: See [README.md](./README.md)
- **Deployment**: Read [DEPLOYMENT.md](./DEPLOYMENT.md)

### Community
- **Discord**: [Join our server](https://discord.gg/runic-cms)
- **Forum**: [community.runic-cms.com](https://community.runic-cms.com)
- **GitHub**: [Open an issue](https://github.com/yourusername/runic-cms/issues)

### Professional Support
- **Email**: support@runic-cms.com
- **Consulting**: Available for custom development

---

## 🌟 What's Next?

Check our roadmap:
- [ ] Marketplace platform launch
- [ ] Real-time collaboration
- [ ] Version control for pages
- [ ] A/B testing
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app

Want to contribute? See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Happy Building! 🚀**

Made with ❤️ by the Runic CMS team
