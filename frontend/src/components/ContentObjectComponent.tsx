'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ContentObject } from '@/types/content'

interface ContentObjectComponentProps {
  object: ContentObject
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<ContentObject>) => void
  onDelete: () => void
  devicePreview: 'desktop' | 'tablet' | 'mobile'
}

export default function ContentObjectComponent({
  object,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  devicePreview,
}: ContentObjectComponentProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: object.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const renderContent = () => {
    switch (object.type) {
      case 'text':
        return (
          <div className="p-4">
            <textarea
              value={object.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full border rounded p-2 min-h-[100px]"
              placeholder="Enter text content..."
            />
          </div>
        )
      case 'gallery':
        return (
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-2">
              Gallery: {object.images.length} images
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
              Add Images
            </button>
          </div>
        )
      case 'video':
        return (
          <div className="p-4">
            <input
              type="url"
              value={object.url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              className="w-full border rounded p-2"
              placeholder="Video URL..."
            />
          </div>
        )
      case 'youtube':
        return (
          <div className="p-4">
            <input
              type="text"
              value={object.videoId}
              onChange={(e) => onUpdate({ videoId: e.target.value })}
              className="w-full border rounded p-2"
              placeholder="YouTube Video ID..."
            />
          </div>
        )
      case 'embed':
        return (
          <div className="p-4">
            <textarea
              value={object.embedCode}
              onChange={(e) => onUpdate({ embedCode: e.target.value })}
              className="w-full border rounded p-2 min-h-[100px] font-mono text-sm"
              placeholder="Paste embed code or iframe..."
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`border-2 rounded-lg bg-white transition ${
        isSelected ? 'border-primary-500 shadow-lg' : 'border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <button
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </button>
          <span className="font-medium capitalize">{object.type}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="text-red-600 hover:text-red-800 px-2 py-1"
        >
          Delete
        </button>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}
