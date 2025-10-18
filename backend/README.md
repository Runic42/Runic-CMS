# Runic CMS Backend

Express.js + PostgreSQL backend for Runic CMS.

## Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a PostgreSQL database:
```bash
createdb runic_cms
```

3. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

4. Initialize the database schema:
```bash
psql -d runic_cms -f src/db/schema.sql
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Pages
- `GET /api/pages/public` - Get all published pages
- `GET /api/pages/public/:slug` - Get page by slug (published only)
- `GET /api/pages` - Get all pages (admin)
- `GET /api/pages/:id` - Get page by ID (admin)
- `POST /api/pages` - Create new page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page
- `GET /api/pages/:id/export` - Export page as HTML

### Site Configuration
- `GET /api/site-config/public` - Get public site config
- `GET /api/site-config` - Get full site config (admin)
- `PUT /api/site-config` - Update site config (admin)

### Media
- `GET /api/media` - Get all media
- `POST /api/media/upload` - Upload media file
- `PUT /api/media/:id` - Update media metadata
- `DELETE /api/media/:id` - Delete media

## Database Schema

See `src/db/schema.sql` for the complete database schema.

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Set environment variables for production

3. Run migrations:
```bash
npm run migrate
```

4. Start the server:
```bash
npm start
```

## Using with Supabase

See the `backend-guide/` directory for instructions on using Supabase as your backend.
