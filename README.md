# IF YOU COME ACROSS THIS DONT TRY TO RUN THIS, THIS IS UNFINISHED

____________________

# 🏰 Runic CMS

A self-hosted, customizable Content Management System similar to WordPress, but with modern drag-and-drop page building and flexible deployment options.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- 🎨 **Drag-and-Drop Page Builder** - Intuitive visual editor with responsive design controls
- 📱 **Fully Responsive** - Design for desktop, tablet, and mobile separately or use auto-responsive layouts
- 🧩 **Extensible** - Marketplace for templates, themes, and custom elements
- 🐳 **Flexible Deployment** - Self-hosted or use Supabase backend
- 🎯 **Content Objects**:
  - Text blocks with rich formatting
  - Image galleries with multiple layouts
  - Video embeds
  - YouTube integration
  - Custom iFrames/embeds
- 🔐 **Authentication & Permissions** - Built-in user management with role-based access
- 📤 **Export to Static HTML** - Generate standalone HTML files for your pages
- 🎨 **Theme Customization** - Full control over colors, fonts, and styling
- 🛍️ **Marketplace** - Community-driven templates, plugins, and themes

## 🚀 Quick Start

### Option 1: Docker All-in-One (Recommended)

The easiest way to get started - everything in one container:

```bash
# Clone the repository
git clone https://github.com/yourusername/runic-cms.git
cd runic-cms

# Start with Docker Compose
cd docker-aio
docker-compose up -d

# Access the CMS
# Frontend: http://localhost:3000
# Admin: http://localhost:3000/admin
```

### Option 2: Manual Installation

#### Prerequisites
- Node.js 18+
- PostgreSQL 14+

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Create database
createdb runic_cms

# Initialize database schema
psql -d runic_cms -f src/db/schema.sql

# Start backend
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start frontend
npm run dev
```

Access at `http://localhost:3000`

### Option 3: Deploy with Supabase

For serverless deployment without managing backend infrastructure:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL from `backend-guide/supabase-schema.sql` in your Supabase SQL editor
3. Configure frontend environment variables
4. Deploy frontend to Vercel

See the [Supabase Backend Guide](./backend-guide/README.md) for detailed instructions.

## 📚 Documentation

- **[Backend Setup](./backend/README.md)** - Self-hosted API setup
- **[Supabase Guide](./backend-guide/README.md)** - Using Supabase as backend
- **[Docker Guide](./docker-aio/README.md)** - All-in-one Docker deployment
- **[Marketplace Guide](./marketplace/README.md)** - Creating and using marketplace items
- **[Developer Guide](./marketplace/DEVELOPER_GUIDE.md)** - Building extensions

## 🏗️ Architecture

```
runic-cms/
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   ├── components/# React components
│   │   ├── lib/       # Utilities and API clients
│   │   └── types/     # TypeScript definitions
├── backend/           # Express.js + PostgreSQL API
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── middleware/# Auth and validation
│   │   └── db/        # Database schema
├── backend-guide/     # Supabase setup instructions
├── docker-aio/        # All-in-one Docker setup
└── marketplace/       # Marketplace documentation
```

## 🎨 Content Objects

Runic CMS comes with built-in content objects:

### Text Block
Rich text editor with full formatting controls, custom styling, and responsive padding.

### Gallery
Multiple layout options (grid, carousel, masonry) with configurable columns for each device type. Supports text positioning alongside images.

### Video
Self-hosted video with controls for autoplay, loop, mute, and poster images.

### YouTube
Embed YouTube videos with start time, autoplay, and control options.

### Embed/iFrame
Custom HTML embeds for third-party widgets, forms, or any HTML content.

## 🔐 Default Setup

After installation:

1. **Create Admin Account:**
   - Use the `/api/auth/register` endpoint
   - Or configure through environment variables

2. **Access Admin Dashboard:**
   - Navigate to `/admin`
   - Create your first page
   - Customize site settings
   - Configure theme

3. **Build Your Site:**
   - Add content objects to pages
   - Design responsive layouts
   - Preview on different devices
   - Publish when ready

## 🛠️ Development

### Frontend Development

```bash
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run linter
```

### Backend Development

```bash
cd backend
npm run dev     # Start with hot reload
npm run build   # Compile TypeScript
npm start       # Run production server
```

### Database Migrations

```bash
cd backend
npm run migrate      # Run migrations
npm run migrate:down # Rollback migrations
```

## 🌐 Deployment

### Vercel (Frontend) + Supabase (Backend)

1. **Setup Supabase:**
   - Follow the [Supabase Guide](./backend-guide/README.md)
   
2. **Deploy to Vercel:**
   ```bash
   cd frontend
   vercel
   ```
   
3. **Set Environment Variables** in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Docker Production Deployment

```bash
cd docker-aio

# Build and start
docker-compose up -d --build

# Configure reverse proxy (Nginx/Apache)
# Set up SSL certificates
# Configure backups
```

### VPS/Cloud Server

1. Set up PostgreSQL database
2. Deploy backend as a Node.js service
3. Build and serve frontend
4. Configure Nginx/Apache reverse proxy
5. Set up SSL with Let's Encrypt

## 🔒 Security

- JWT-based authentication
- Row Level Security (RLS) with Supabase
- Input validation and sanitization
- XSS protection
- CSRF tokens
- Rate limiting
- Helmet.js security headers

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📝 Creating Marketplace Items

Want to create templates, themes, or plugins?

1. Read the [Developer Guide](./marketplace/DEVELOPER_GUIDE.md)
2. Use the item starter template
3. Test thoroughly
4. Submit to the marketplace

## 🐛 Issues & Support

- **Bug Reports:** [GitHub Issues](https://github.com/yourusername/runic-cms/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/runic-cms/discussions)
- **Discord:** [Join our community](https://discord.gg/runic-cms)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for excellent backend infrastructure
- The open-source community

## 🗺️ Roadmap

- [x] Core CMS functionality
- [x] Drag-and-drop page builder
- [x] Content objects (text, gallery, video, YouTube, embed)
- [x] Docker all-in-one container
- [x] Supabase integration
- [ ] Marketplace platform
- [ ] Real-time collaboration
- [ ] Version control for pages
- [ ] Advanced SEO tools
- [ ] A/B testing
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support
- [ ] API documentation site
- [ ] CLI tools

## 💰 Sponsors

Support this project:
- [GitHub Sponsors](https://github.com/sponsors/yourusername)
- [Open Collective](https://opencollective.com/runic-cms)

---

Made with ❤️ by the Runic CMS team
