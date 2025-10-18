'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { ContentObject, ContentObjectType } from '@/types/content'
import ContentObjectComponent from './ContentObjectComponent'
import ContentObjectPalette from './ContentObjectPalette'

interface PageEditorProps {
  initialContent: ContentObject[]
  onSave: (content: ContentObject[]) => void
  devicePreview: 'desktop' | 'tablet' | 'mobile'
}

export default function PageEditor({ initialContent, onSave, devicePreview }: PageEditorProps) {
  const [content, setContent] = useState<ContentObject[]>(initialContent)
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setContent((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addContentObject = (type: ContentObjectType) => {
    const newObject: ContentObject = {
      id: `obj-${Date.now()}`,
      type,
      order: content.length,
      deviceVisibility: {
        desktop: true,
        tablet: true,
        mobile: true,
      },
      // Type-specific defaults
      ...(type === 'text' && {
        content: 'New text block',
        styling: {
          fontSize: 16,
          fontWeight: 'normal',
          color: '#000000',
          alignment: 'left' as const,
          padding: { top: 16, right: 16, bottom: 16, left: 16 },
        },
      }),
      ...(type === 'gallery' && {
        images: [],
        layout: 'grid' as const,
        responsive: {
          desktop: { columns: 3, gap: 16 },
          tablet: { columns: 2, gap: 12 },
          mobile: { columns: 1, gap: 8 },
        },
      }),
      ...(type === 'video' && {
        url: '',
        autoplay: false,
        loop: false,
        muted: false,
        controls: true,
      }),
      ...(type === 'youtube' && {
        videoId: '',
        autoplay: false,
        controls: true,
      }),
      ...(type === 'embed' && {
        embedCode: '',
      }),
    } as ContentObject

    setContent([...content, newObject])
    setSelectedObjectId(newObject.id)
  }

  const updateContentObject = (id: string, updates: Partial<ContentObject>) => {
    setContent(
      content.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      )
    )
  }

  const deleteContentObject = (id: string) => {
    setContent(content.filter((obj) => obj.id !== id))
    if (selectedObjectId === id) {
      setSelectedObjectId(null)
    }
  }

  const selectedObject = content.find((obj) => obj.id === selectedObjectId)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Content Palette */}
      <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Content</h3>
        <ContentObjectPalette onAdd={addContentObject} />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Device Preview Toggle */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Page Content</h2>
            <button
              onClick={() => onSave(content)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Save Changes
            </button>
          </div>

          {/* Content Objects */}
          <div className="bg-white rounded-lg shadow-lg p-6 min-h-[500px]">
            {content.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No content yet</p>
                <p className="text-sm mt-2">Add content objects from the left sidebar</p>
              </div>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={content.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {content.map((obj) => (
                      <ContentObjectComponent
                        key={obj.id}
                        object={obj}
                        isSelected={obj.id === selectedObjectId}
                        onSelect={() => setSelectedObjectId(obj.id)}
                        onUpdate={(updates) => updateContentObject(obj.id, updates)}
                        onDelete={() => deleteContentObject(obj.id)}
                        devicePreview={devicePreview}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties Panel */}
      {selectedObject && (
        <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Properties</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Object Type
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded">{selectedObject.type}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Visibility
              </label>
              <div className="space-y-2">
                {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
                  <label key={device} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedObject.deviceVisibility[device]}
                      onChange={(e) =>
                        updateContentObject(selectedObject.id, {
                          deviceVisibility: {
                            ...selectedObject.deviceVisibility,
                            [device]: e.target.checked,
                          },
                        })
                      }
                      className="mr-2"
                    />
                    <span className="capitalize">{device}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
