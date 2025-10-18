'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: 'template' | 'element' | 'plugin' | 'theme'
  version: string
  author: string
  rating: number
  downloads: number
  price: number
  preview: string
}

const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Minimal Blog Template',
    description: 'A clean, minimal blog template perfect for writers and content creators',
    type: 'template',
    version: '1.0.0',
    author: 'Jane Developer',
    rating: 4.8,
    downloads: 1234,
    price: 0,
    preview: '/marketplace/minimal-blog.png'
  },
  {
    id: '2',
    name: 'Pricing Table Element',
    description: 'Beautiful pricing tables with multiple column layouts',
    type: 'element',
    version: '1.2.0',
    author: 'John Builder',
    rating: 4.6,
    downloads: 892,
    price: 0,
    preview: '/marketplace/pricing-table.png'
  },
  {
    id: '3',
    name: 'Dark Mode Theme',
    description: 'Elegant dark theme with customizable accent colors',
    type: 'theme',
    version: '2.0.0',
    author: 'Theme Master',
    rating: 4.9,
    downloads: 2341,
    price: 0,
    preview: '/marketplace/dark-theme.png'
  },
]

export default function MarketplacePage() {
  const router = useRouter()
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = mockItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleInstall = (item: MarketplaceItem) => {
    // In a real implementation, this would download and install the item
    alert(`Installing ${item.name}...\n\nThis is a demo. In production, this would download and install the marketplace item.`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
            <button
              onClick={() => router.push('/admin')}
              className="text-primary-600 hover:text-primary-700"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🛍️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Marketplace Coming Soon!
              </h3>
              <p className="text-blue-800 text-sm">
                The full marketplace with templates, themes, and plugins is currently in development.
                These are placeholder items to demonstrate the functionality.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'template', 'element', 'plugin', 'theme'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg capitalize transition ${
                    filter === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              {/* Preview Image */}
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 rounded-t-lg flex items-center justify-center">
                <span className="text-6xl">
                  {item.type === 'template' && '📄'}
                  {item.type === 'element' && '🧩'}
                  {item.type === 'plugin' && '🔌'}
                  {item.type === 'theme' && '🎨'}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded capitalize">
                    {item.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    {item.rating}
                  </div>
                  <div>↓ {item.downloads.toLocaleString()}</div>
                  <div>v{item.version}</div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500">by {item.author}</p>
                    <p className="font-semibold text-lg">
                      {item.price === 0 ? 'Free' : `$${item.price}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleInstall(item)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    Install
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found matching your criteria</p>
          </div>
        )}

        {/* Submit Your Item CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Create Your Own Marketplace Item</h2>
            <p className="text-lg mb-6 opacity-90">
              Share your templates, themes, and plugins with the Runic CMS community.
              Earn recognition and help others build amazing websites.
            </p>
            <button
              onClick={() => window.open('https://github.com/runic-cms/marketplace', '_blank')}
              className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Learn How to Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
