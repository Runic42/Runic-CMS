-- Supabase Schema for Runic CMS
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extended from auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site configuration table
CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  seo JSONB DEFAULT '{"title": "", "description": "", "keywords": []}',
  custom_html TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media library (metadata only, files in Supabase Storage)
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace items
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) CHECK (type IN ('template', 'element', 'plugin', 'theme')),
  version VARCHAR(20) NOT NULL,
  author_id UUID REFERENCES auth.users(id),
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
CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON public.pages(is_published);
CREATE INDEX IF NOT EXISTS idx_marketplace_type ON public.marketplace_items(type);
CREATE INDEX IF NOT EXISTS idx_marketplace_approved ON public.marketplace_items(is_approved);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at 
  BEFORE UPDATE ON public.site_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at 
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at 
  BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Site Config Policies
CREATE POLICY "Site config is viewable by everyone"
  ON public.site_config FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update site config"
  ON public.site_config FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Pages Policies
CREATE POLICY "Published pages are viewable by everyone"
  ON public.pages FOR SELECT
  USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create pages"
  ON public.pages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update pages they created or are admins"
  ON public.pages FOR UPDATE
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete pages"
  ON public.pages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Media Policies
CREATE POLICY "Media is viewable by everyone"
  ON public.media FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload media"
  ON public.media FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update media they uploaded"
  ON public.media FOR UPDATE
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete media they uploaded"
  ON public.media FOR DELETE
  USING (uploaded_by = auth.uid());

-- Marketplace Policies
CREATE POLICY "Approved marketplace items are viewable by everyone"
  ON public.marketplace_items FOR SELECT
  USING (is_approved = true OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create marketplace items"
  ON public.marketplace_items FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their items"
  ON public.marketplace_items FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors and admins can delete items"
  ON public.marketplace_items FOR DELETE
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Marketplace Reviews Policies
CREATE POLICY "Reviews are viewable by everyone"
  ON public.marketplace_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.marketplace_reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own reviews"
  ON public.marketplace_reviews FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
  ON public.marketplace_reviews FOR DELETE
  USING (user_id = auth.uid());

-- Insert default site config
INSERT INTO public.site_config (site_name, theme, navigation, footer)
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

-- Create storage bucket (run this separately or via Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('media', 'media', true);

-- Storage Policies (add via Supabase dashboard or here)
-- CREATE POLICY "Media files are publicly accessible"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'media');

-- CREATE POLICY "Authenticated users can upload media"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);

-- CREATE POLICY "Users can update their own media"
--   ON storage.objects FOR UPDATE
--   USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own media"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
