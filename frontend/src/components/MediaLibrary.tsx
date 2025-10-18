'use client'

import { useState, useEffect } from 'react'
import { mediaAPI } from '@/lib/api'

interface MediaItem {
  id: string
  filename: string
  original_filename: string
  mime_type: string
  size: number
  url: string
  alt_text?: string
  caption?: string
  created_at: string
}

interface MediaLibraryProps {
  onSelect?: (media: MediaItem) => void
  multiple?: boolean
}

export default function MediaLibrary({ onSelect, multiple = false }: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    try {
      const response = await mediaAPI.getAll()
      setMedia(response.data.media)
    } catch (error) {
      console.error('Error loading media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        await mediaAPI.upload(file)
      }
      await loadMedia()
    } catch (error) {
      console.error('Error uploading media:', error)
      alert('Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const handleSelect = (item: MediaItem) => {
    if (multiple) {
      const newSelected = new Set(selected)
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id)
      } else {
        newSelected.add(item.id)
      }
      setSelected(newSelected)
    } else {
      if (onSelect) {
        onSelect(item)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      await mediaAPI.delete(id)
      setMedia(media.filter(m => m.id !== id))
    } catch (error) {
      console.error('Error deleting media:', error)
      alert('Failed to delete file')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const isImage = (mimeType: string) => mimeType.startsWith('image/')
  const isVideo = (mimeType: string) => mimeType.startsWith('video/')

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading media...</div>
      </div>
    )
  }

  return (
    <div className="media-library">
      {/* Upload Section */}
      <div className="mb-6">
        <label className="block w-full">
          <input
            type="file"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition">
            {uploading ? (
              <div>
                <div className="text-2xl mb-2">⏳</div>
                <div className="text-gray-600">Uploading...</div>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">📁</div>
                <div className="text-gray-700 font-medium mb-1">
                  Click to upload files
                </div>
                <div className="text-gray-500 text-sm">
                  or drag and drop (coming soon)
                </div>
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Media Grid */}
      {media.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🖼️</div>
          <p>No media files yet</p>
          <p className="text-sm mt-2">Upload some files to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition ${
                selected.has(item.id)
                  ? 'border-primary-500 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              onClick={() => handleSelect(item)}
            >
              {/* Preview */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {isImage(item.mime_type) ? (
                  <img
                    src={item.url}
                    alt={item.alt_text || item.original_filename}
                    className="w-full h-full object-cover"
                  />
                ) : isVideo(item.mime_type) ? (
                  <div className="text-4xl">🎥</div>
                ) : (
                  <div className="text-4xl">📄</div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 bg-white">
                <div className="text-sm font-medium truncate">
                  {item.original_filename}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(item.size)}
                </div>
              </div>

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(item.id)
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>

              {/* Selected Indicator */}
              {selected.has(item.id) && (
                <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Selected Actions */}
      {multiple && selected.size > 0 && (
        <div className="mt-6 flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="text-primary-900 font-medium">
            {selected.size} file{selected.size > 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(new Set())}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Clear
            </button>
            <button
              onClick={() => {
                const selectedItems = media.filter(m => selected.has(m.id))
                if (onSelect) {
                  selectedItems.forEach(item => onSelect(item))
                }
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
            >
              Use Selected
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
