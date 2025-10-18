'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { pagesAPI } from '@/lib/api'

export default function NewPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await pagesAPI.create({
        title,
        slug,
        content: [],
        is_published: false,
      })

      const pageId = response.data.page.id
      router.push(`/admin/pages/${pageId}/edit`)
    } catch (error: any) {
      console.error('Error creating page:', error)
      alert(error.response?.data?.error || 'Failed to create page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-8">Create New Page</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter page title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="page-url-slug"
                  pattern="[a-z0-9-]+"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Only lowercase letters, numbers, and hyphens
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Page'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
