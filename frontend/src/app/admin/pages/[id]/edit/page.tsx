'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PageEditor from '@/components/PageEditor'
import { pagesAPI } from '@/lib/api'
import { ContentObject } from '@/types/content'

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  useEffect(() => {
    loadPage()
  }, [params.id])

  const loadPage = async () => {
    try {
      const response = await pagesAPI.getById(params.id as string)
      setPage(response.data.page)
    } catch (error) {
      console.error('Error loading page:', error)
      alert('Failed to load page')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (content: ContentObject[]) => {
    try {
      await pagesAPI.update(params.id as string, { content })
      alert('Page saved successfully!')
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Failed to save page')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Page not found</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold">{page.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Device Preview Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDevicePreview('desktop')}
              className={`px-3 py-1 rounded ${
                devicePreview === 'desktop' ? 'bg-white shadow' : ''
              }`}
            >
              🖥️ Desktop
            </button>
            <button
              onClick={() => setDevicePreview('tablet')}
              className={`px-3 py-1 rounded ${
                devicePreview === 'tablet' ? 'bg-white shadow' : ''
              }`}
            >
              📱 Tablet
            </button>
            <button
              onClick={() => setDevicePreview('mobile')}
              className={`px-3 py-1 rounded ${
                devicePreview === 'mobile' ? 'bg-white shadow' : ''
              }`}
            >
              📱 Mobile
            </button>
          </div>

          <button
            onClick={() => router.push(`/preview/${page.slug}`)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <PageEditor
          initialContent={page.content || []}
          onSave={handleSave}
          devicePreview={devicePreview}
        />
      </div>
    </div>
  )
}
