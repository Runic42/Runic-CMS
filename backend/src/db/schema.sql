-- Database schema for Runic CMS

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site configuration table
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name VARCHAR(255) NOT NULL,
  logo TEXT,
  favicon TEXT,
  theme JSONB DEFAULT '{}',
  navigation JSONB DEFAULT '{"items": []}',
  footer JSONB DEFAULT '{"text": "", "links": []}',
  custom_css TEXT,
  custom_js TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  seo JSONB DEFAULT '{"title": "", "description": "", "keywords": []}',
  custom_html TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media library
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace items
CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) CHECK (type IN ('template', 'element', 'plugin', 'theme')),
  version VARCHAR(20) NOT NULL,
  author_id UUID REFERENCES users(id),
  author_name VARCHAR(255) NOT NULL,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  price DECIMAL(10, 2) DEFAULT 0.00,
  is_approved BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  preview_images TEXT[],
  repository_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace reviews
CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(is_published);
CREATE INDEX IF NOT EXISTS idx_marketplace_type ON marketplace_items(type);
CREATE INDEX IF NOT EXISTS idx_marketplace_approved ON marketplace_items(is_approved);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default site config
INSERT INTO site_config (site_name, theme, navigation, footer)
VALUES (
  'Runic CMS',
  '{
    "primaryColor": "#3b82f6",
    "secondaryColor": "#8b5cf6",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Inter, sans-serif"
  }',
  '{
    "items": [
      {"label": "Home", "url": "/", "order": 0},
      {"label": "About", "url": "/about", "order": 1}
    ]
  }',
  '{
    "text": "Powered by Runic CMS",
    "links": []
  }'
)
ON CONFLICT DO NOTHING;
