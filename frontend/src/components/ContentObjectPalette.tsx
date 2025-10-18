'use client'

import { ContentObjectType } from '@/types/content'

interface ContentObjectPaletteProps {
  onAdd: (type: ContentObjectType) => void
}

const contentTypes: { type: ContentObjectType; label: string; icon: string }[] = [
  { type: 'text', label: 'Text Block', icon: '📝' },
  { type: 'gallery', label: 'Image Gallery', icon: '🖼️' },
  { type: 'video', label: 'Video', icon: '🎥' },
  { type: 'youtube', label: 'YouTube', icon: '📺' },
  { type: 'embed', label: 'Embed/iFrame', icon: '🔲' },
]

export default function ContentObjectPalette({ onAdd }: ContentObjectPaletteProps) {
  return (
    <div className="space-y-2">
      {contentTypes.map((item) => (
        <button
          key={item.type}
          onClick={() => onAdd(item.type)}
          className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition flex items-center gap-3"
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
