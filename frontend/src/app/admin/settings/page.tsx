'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { siteConfigAPI } from '@/lib/api'

export default function SettingsPage() {
  const router = useRouter()
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await siteConfigAPI.get()
      setConfig(response.data.config)
    } catch (error) {
      console.error('Error loading config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await siteConfigAPI.update(config)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateTheme = (key: string, value: string) => {
    setConfig({
      ...config,
      theme: {
        ...config.theme,
        [key]: value,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
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
      <main className="max-w-4xl mx-auto py-8 px-4">
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={config?.site_name || ''}
                  onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={config?.logo || ''}
                  onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  value={config?.favicon || ''}
                  onChange={(e) => setConfig({ ...config, favicon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config?.theme?.primaryColor || '#3b82f6'}
                    onChange={(e) => updateTheme('primaryColor', e.target.value)}
                    className="h-10 w-20 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={config?.theme?.primaryColor || '#3b82f6'}
                    onChange={(e) => updateTheme('primaryColor', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config?.theme?.secondaryColor || '#8b5cf6'}
                    onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                    className="h-10 w-20 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={config?.theme?.secondaryColor || '#8b5cf6'}
                    onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config?.theme?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateTheme('backgroundColor', e.target.value)}
                    className="h-10 w-20 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={config?.theme?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateTheme('backgroundColor', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config?.theme?.textColor || '#1f2937'}
                    onChange={(e) => updateTheme('textColor', e.target.value)}
                    className="h-10 w-20 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={config?.theme?.textColor || '#1f2937'}
                    onChange={(e) => updateTheme('textColor', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <input
                  type="text"
                  value={config?.theme?.fontFamily || 'Inter, sans-serif'}
                  onChange={(e) => updateTheme('fontFamily', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Inter, sans-serif"
                />
              </div>
            </div>
          </div>

          {/* Custom CSS/JS */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Custom Code</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom CSS
                </label>
                <textarea
                  value={config?.custom_css || ''}
                  onChange={(e) => setConfig({ ...config, custom_css: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  rows={8}
                  placeholder="/* Add custom CSS here */"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom JavaScript
                </label>
                <textarea
                  value={config?.custom_js || ''}
                  onChange={(e) => setConfig({ ...config, custom_js: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  rows={8}
                  placeholder="// Add custom JavaScript here"
                />
                <p className="text-sm text-gray-500 mt-1">
                  ⚠️ Be careful with custom JavaScript - it will run on all pages
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
