'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [pages, setPages] = useState([
    { id: '1', title: 'Home', slug: 'home', isPublished: true, updatedAt: '2025-01-15' },
    { id: '2', title: 'About', slug: 'about', isPublished: true, updatedAt: '2025-01-14' },
  ])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Runic CMS Admin</h1>
            <Link href="/" className="text-primary-600 hover:text-primary-700">
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pages</h2>
            <Link
              href="/admin/pages/new"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              + New Page
            </Link>
          </div>

          {/* Pages List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {page.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      /{page.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        page.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.updatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/preview/${page.slug}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/admin/settings" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Site Settings</h3>
            <p className="text-gray-600">Configure site name, logo, theme, and more</p>
          </Link>
          <Link href="/admin/marketplace" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Marketplace</h3>
            <p className="text-gray-600">Browse templates, plugins, and extensions</p>
          </Link>
          <Link href="/admin/export" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Export to HTML</h3>
            <p className="text-gray-600">Generate static HTML version of your site</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
