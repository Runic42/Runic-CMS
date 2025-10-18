// API client for self-hosted backend
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: (email: string, password: string, username: string) =>
    api.post('/auth/register', { email, password, username }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  logout: () => api.post('/auth/logout'),
  
  me: () => api.get('/auth/me'),
}

// Pages API
export const pagesAPI = {
  getAll: () => api.get('/pages'),
  
  getAllPublic: () => api.get('/pages/public'),
  
  getById: (id: string) => api.get(`/pages/${id}`),
  
  getBySlug: (slug: string) => api.get(`/pages/public/${slug}`),
  
  create: (data: any) => api.post('/pages', data),
  
  update: (id: string, data: any) => api.put(`/pages/${id}`, data),
  
  delete: (id: string) => api.delete(`/pages/${id}`),
  
  export: (id: string) => api.get(`/pages/${id}/export`, { responseType: 'blob' }),
}

// Site Config API
export const siteConfigAPI = {
  get: () => api.get('/site-config'),
  
  getPublic: () => api.get('/site-config/public'),
  
  update: (data: any) => api.put('/site-config', data),
}

// Media API
export const mediaAPI = {
  getAll: () => api.get('/media'),
  
  upload: (file: File, metadata?: { alt_text?: string; caption?: string }) => {
    const formData = new FormData()
    formData.append('file', file)
    if (metadata?.alt_text) formData.append('alt_text', metadata.alt_text)
    if (metadata?.caption) formData.append('caption', metadata.caption)
    
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  
  update: (id: string, data: { alt_text?: string; caption?: string }) =>
    api.put(`/media/${id}`, data),
  
  delete: (id: string) => api.delete(`/media/${id}`),
}

export default api
