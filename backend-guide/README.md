# Using Supabase as Backend for Runic CMS

This guide explains how to use Supabase as your backend instead of self-hosting the Node.js backend.

## Why Supabase?

- **No server management** - Supabase handles all infrastructure
- **Automatic API generation** - RESTful and GraphQL APIs automatically created
- **Real-time capabilities** - Built-in real-time subscriptions
- **Authentication** - Built-in auth with multiple providers
- **Storage** - File storage included
- **Free tier available** - Great for small to medium sites

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for the database to be provisioned (1-2 minutes)
4. Note your project URL and anon/public API key

### 2. Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema.sql` (in this directory)
3. Run the SQL to create all tables and functions

### 3. Configure Row Level Security (RLS)

Supabase uses Row Level Security for fine-grained access control. The schema includes RLS policies that:

- Allow public read access to published pages
- Require authentication for admin operations
- Restrict sensitive data access

### 4. Set Up Storage Buckets

1. In Supabase dashboard, go to Storage
2. Create a new bucket called `media`
3. Set the bucket to **public** if you want direct media access
4. Configure upload policies (size limits, file types, etc.)

### 5. Configure Frontend

Update your frontend `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 6. Install Supabase Client

In your frontend directory:

```bash
npm install @supabase/supabase-js
```

### 7. Create Supabase Client Utility

Create `frontend/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## API Usage Examples

### Authentication

```typescript
import { supabase } from '@/lib/supabase'

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### Pages

```typescript
// Get all published pages
const { data: pages } = await supabase
  .from('pages')
  .select('*')
  .eq('is_published', true)

// Get single page by slug
const { data: page } = await supabase
  .from('pages')
  .select('*')
  .eq('slug', 'about')
  .single()

// Create page (requires authentication)
const { data, error } = await supabase
  .from('pages')
  .insert({
    title: 'New Page',
    slug: 'new-page',
    content: [],
    is_published: false
  })

// Update page
const { data, error } = await supabase
  .from('pages')
  .update({ title: 'Updated Title' })
  .eq('id', pageId)

// Delete page
const { error } = await supabase
  .from('pages')
  .delete()
  .eq('id', pageId)
```

### Media/Storage

```typescript
// Upload file
const file = event.target.files[0]
const { data, error } = await supabase.storage
  .from('media')
  .upload(`images/${file.name}`, file)

// Get public URL
const { data } = supabase.storage
  .from('media')
  .getPublicUrl('images/photo.jpg')

// List files
const { data, error } = await supabase.storage
  .from('media')
  .list('images')

// Delete file
const { error } = await supabase.storage
  .from('media')
  .remove(['images/photo.jpg'])
```

### Site Configuration

```typescript
// Get site config
const { data: config } = await supabase
  .from('site_config')
  .select('*')
  .single()

// Update site config
const { data, error } = await supabase
  .from('site_config')
  .update({
    site_name: 'My Blog',
    theme: { primaryColor: '#3b82f6' }
  })
  .eq('id', configId)
```

## Real-time Updates

One advantage of Supabase is real-time capabilities:

```typescript
// Subscribe to page changes
const subscription = supabase
  .channel('pages-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'pages' },
    (payload) => {
      console.log('Page changed:', payload)
      // Update your UI accordingly
    }
  )
  .subscribe()

// Unsubscribe when done
subscription.unsubscribe()
```

## Environment Variables

For Vercel deployment with Supabase:

1. Go to your Vercel project settings
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

## Security Considerations

1. **Never expose the service_role key** - Only use the anon/public key in frontend
2. **Use RLS policies** - Always enable and configure Row Level Security
3. **Validate on server** - Use Supabase Edge Functions for sensitive operations
4. **Rate limiting** - Configure rate limits in Supabase dashboard
5. **CORS** - Configure allowed origins in Supabase settings

## Limitations

- Supabase free tier has limits (500MB database, 1GB file storage, 2GB bandwidth)
- Some complex queries may need optimization
- Edge Functions have cold start times

## Migrating from Self-Hosted

To migrate from the self-hosted backend to Supabase:

1. Export your data from PostgreSQL
2. Set up Supabase schema
3. Import data into Supabase
4. Update frontend to use Supabase client
5. Update authentication logic
6. Migrate file storage to Supabase Storage

## Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
