// Supabase client (optional - use if deploying with Supabase backend)
// Uncomment and install @supabase/supabase-js to use

/*
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for Supabase
export const supabaseAPI = {
  // Auth
  signUp: (email: string, password: string) =>
    supabase.auth.signUp({ email, password }),
  
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  
  signOut: () => supabase.auth.signOut(),
  
  getUser: () => supabase.auth.getUser(),
  
  // Pages
  getPages: () =>
    supabase.from('pages').select('*').eq('is_published', true),
  
  getPageBySlug: (slug: string) =>
    supabase.from('pages').select('*').eq('slug', slug).single(),
  
  createPage: (data: any) =>
    supabase.from('pages').insert(data).select().single(),
  
  updatePage: (id: string, data: any) =>
    supabase.from('pages').update(data).eq('id', id).select().single(),
  
  deletePage: (id: string) =>
    supabase.from('pages').delete().eq('id', id),
  
  // Site Config
  getSiteConfig: () =>
    supabase.from('site_config').select('*').single(),
  
  updateSiteConfig: (id: string, data: any) =>
    supabase.from('site_config').update(data).eq('id', id).select().single(),
  
  // Media
  uploadFile: (path: string, file: File) =>
    supabase.storage.from('media').upload(path, file),
  
  getPublicUrl: (path: string) =>
    supabase.storage.from('media').getPublicUrl(path),
  
  listFiles: (path: string = '') =>
    supabase.storage.from('media').list(path),
  
  deleteFile: (path: string) =>
    supabase.storage.from('media').remove([path]),
}
*/

// Placeholder export when not using Supabase
export const supabase = null
