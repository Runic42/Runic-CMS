# 📖 Runic CMS - Documentation Index

Quick reference guide to all documentation and resources.

## 🚀 Getting Started

Start here if you're new:

1. **[GETTING_STARTED.md](./GETTING_STARTED.md)** ⭐
   - Beginner-friendly introduction
   - Choose your deployment path
   - Your first page tutorial
   - Common tasks guide

2. **[QUICKSTART.md](./QUICKSTART.md)**
   - 5-minute setup guide
   - Minimal instructions to get running
   - Each deployment method

3. **[README.md](./README.md)**
   - Project overview
   - Feature list
   - Architecture overview
   - Installation options

## 📚 Main Documentation

### For Users

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Complete beginner guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Fast setup
- **[README.md](./README.md)** - Main documentation

### For Deployers

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
  - Docker deployment
  - Vercel + Supabase
  - VPS/Cloud server
  - Kubernetes
  - Security hardening
  - Monitoring & backups

### For Developers

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute
  - Code style guide
  - Commit conventions
  - PR process
  - Development workflow

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical overview
  - Architecture details
  - File structure
  - Technology stack
  - API reference

## 🎯 Specialized Guides

### Backend Setup

- **[backend/README.md](./backend/README.md)**
  - Self-hosted backend setup
  - API endpoints
  - Database schema
  - Environment variables

- **[backend-guide/README.md](./backend-guide/README.md)**
  - Supabase integration
  - Serverless deployment
  - Setup instructions
  - API usage examples

### Docker Deployment

- **[docker-aio/README.md](./docker-aio/README.md)**
  - All-in-one container
  - Docker Compose setup
  - Environment variables
  - Troubleshooting
  - Production tips

### Marketplace

- **[marketplace/README.md](./marketplace/README.md)**
  - Marketplace overview
  - Browsing and installing
  - Submission process
  - Moderation guidelines

- **[marketplace/DEVELOPER_GUIDE.md](./marketplace/DEVELOPER_GUIDE.md)**
  - Creating templates
  - Creating elements
  - Creating plugins
  - Creating themes
  - Testing and publishing

## 🔧 Tools & Utilities

### Scripts

- **[install.sh](./install.sh)** - Automated installation
  - Interactive setup wizard
  - Supports all deployment methods
  - Generates secure secrets

- **[verify-setup.sh](./verify-setup.sh)** - Setup verification
  - Checks prerequisites
  - Validates configuration
  - Reports issues

### Configuration Files

- **[package.json](./package.json)** - Root package config
  - Workspace scripts
  - Convenience commands
  - Dependency management

- **[.gitignore](./.gitignore)** - Git ignore rules
  - Node modules
  - Environment files
  - Build artifacts

- **[LICENSE](./LICENSE)** - MIT License
  - Usage terms
  - Distribution rights

## 📋 Reference Sheets

### Quick Commands

```bash
# Verify setup
./verify-setup.sh

# Install everything
./install.sh

# Start development (all services)
npm run dev

# Build for production
npm run build

# Docker deployment
npm run docker:up

# Check Docker logs
npm run docker:logs
```

### File Locations

| What | Where |
|------|-------|
| Frontend pages | `frontend/src/app/` |
| React components | `frontend/src/components/` |
| API routes | `backend/src/routes/` |
| Database schema | `backend/src/db/schema.sql` |
| Docker config | `docker-aio/docker-compose.yml` |
| Supabase schema | `backend-guide/supabase-schema.sql` |

### Common Paths

| Task | Path |
|------|------|
| Admin dashboard | `/admin` |
| Login page | `/login` |
| Preview page | `/preview/:slug` |
| Page editor | `/admin/pages/:id/edit` |
| Site settings | `/admin/settings` |
| Marketplace | `/admin/marketplace` |

## 🎓 Learning Path

### Level 1: User
1. Read [GETTING_STARTED.md](./GETTING_STARTED.md)
2. Deploy with Docker
3. Create your first page
4. Customize theme
5. Publish your site

### Level 2: Administrator
1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Set up production deployment
3. Configure domain and SSL
4. Set up backups
5. Monitor performance

### Level 3: Developer
1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
3. Set up development environment
4. Explore the codebase
5. Make your first contribution

### Level 4: Extension Creator
1. Read [marketplace/DEVELOPER_GUIDE.md](./marketplace/DEVELOPER_GUIDE.md)
2. Study example extensions
3. Create your first template
4. Build a custom element
5. Publish to marketplace

## 🔍 Find What You Need

### I want to...

**...get started quickly**
→ [QUICKSTART.md](./QUICKSTART.md)

**...understand the project**
→ [README.md](./README.md)

**...deploy to production**
→ [DEPLOYMENT.md](./DEPLOYMENT.md)

**...use Supabase**
→ [backend-guide/README.md](./backend-guide/README.md)

**...use Docker**
→ [docker-aio/README.md](./docker-aio/README.md)

**...contribute code**
→ [CONTRIBUTING.md](./CONTRIBUTING.md)

**...create extensions**
→ [marketplace/DEVELOPER_GUIDE.md](./marketplace/DEVELOPER_GUIDE.md)

**...see what's built**
→ [COMPLETE.md](./COMPLETE.md)

**...understand architecture**
→ [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

**...troubleshoot issues**
→ [DEPLOYMENT.md](./DEPLOYMENT.md) (Troubleshooting section)

## 📞 Getting Help

### Documentation
- Start with [GETTING_STARTED.md](./GETTING_STARTED.md)
- Check relevant guide above
- Search for your question

### Community
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Discord: Real-time chat
- Forum: Long-form discussions

### Professional
- Email: support@runic-cms.com
- Consulting: Custom development
- Training: Team workshops

## 🗺️ Sitemap

```
Documentation/
├── Getting Started
│   ├── GETTING_STARTED.md (Beginner guide)
│   ├── QUICKSTART.md (Fast setup)
│   └── README.md (Overview)
│
├── Deployment
│   ├── DEPLOYMENT.md (Production)
│   ├── docker-aio/README.md (Docker)
│   └── backend-guide/README.md (Supabase)
│
├── Development
│   ├── CONTRIBUTING.md (Contributing)
│   ├── PROJECT_SUMMARY.md (Architecture)
│   └── backend/README.md (Backend API)
│
├── Extensions
│   ├── marketplace/README.md (Overview)
│   └── marketplace/DEVELOPER_GUIDE.md (Creating)
│
└── Reference
    ├── COMPLETE.md (What's built)
    ├── INDEX.md (This file)
    └── plan.txt (Original plan)
```

## ✅ Checklists

### Pre-Deployment
- [ ] Read [DEPLOYMENT.md](./DEPLOYMENT.md)
- [ ] Run [verify-setup.sh](./verify-setup.sh)
- [ ] Change default passwords
- [ ] Configure environment
- [ ] Test thoroughly

### First-Time Setup
- [ ] Read [GETTING_STARTED.md](./GETTING_STARTED.md)
- [ ] Choose deployment method
- [ ] Run [install.sh](./install.sh)
- [ ] Create admin account
- [ ] Login and explore

### Before Contributing
- [ ] Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- [ ] Fork repository
- [ ] Set up development environment
- [ ] Create feature branch
- [ ] Write tests

## 🆕 What's New

Check [COMPLETE.md](./COMPLETE.md) for the complete feature list.

## 📝 Status

- **Version**: 1.0.0
- **Status**: ✅ Complete & Production Ready
- **Last Updated**: 2025

---

## 🎯 Quick Links

| Resource | Link |
|----------|------|
| 🏠 Homepage | [README.md](./README.md) |
| 🚀 Quick Start | [QUICKSTART.md](./QUICKSTART.md) |
| 📖 Full Guide | [GETTING_STARTED.md](./GETTING_STARTED.md) |
| 🚢 Deployment | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| 💻 Contributing | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| 📦 Marketplace | [marketplace/README.md](./marketplace/README.md) |
| ✅ Complete | [COMPLETE.md](./COMPLETE.md) |
| 🗂️ Index | [INDEX.md](./INDEX.md) (You are here) |

---

**Need help finding something? Ask in our Discord or GitHub Discussions!**

*This index is your map to everything Runic CMS. Happy building! 🏰*
