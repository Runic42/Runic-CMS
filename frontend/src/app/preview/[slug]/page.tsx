'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { pagesAPI, siteConfigAPI } from '@/lib/api'
import ContentRenderer from '@/components/ContentRenderer'

export default function PreviewPage() {
  const params = useParams()
  const [page, setPage] = useState<any>(null)
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [params.slug])

  const loadData = async () => {
    try {
      const [pageResponse, configResponse] = await Promise.all([
        pagesAPI.getBySlug(params.slug as string),
        siteConfigAPI.getPublic(),
      ])
      setPage(pageResponse.data.page)
      setConfig(configResponse.data.config)
    } catch (error) {
      console.error('Error loading page:', error)
    } finally {
      setLoading(false)
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
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl">Page not found</p>
        </div>
      </div>
    )
  }

  const theme = config?.theme || {}

  return (
    <div
      style={{
        fontFamily: theme.fontFamily || 'Inter, sans-serif',
        color: theme.textColor || '#1f2937',
        backgroundColor: theme.backgroundColor || '#ffffff',
      }}
    >
      {/* Navigation */}
      {config?.navigation?.items?.length > 0 && (
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                {config.logo && (
                  <img src={config.logo} alt={config.site_name} className="h-8 mr-4" />
                )}
                <span className="text-xl font-bold">{config.site_name}</span>
              </div>
              <div className="flex items-center space-x-4">
                {config.navigation.items.map((item: any) => (
                  <a
                    key={item.url}
                    href={item.url}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
        
        {page.custom_html ? (
          <div dangerouslySetInnerHTML={{ __html: page.custom_html }} />
        ) : (
          <ContentRenderer content={page.content || []} />
        )}
      </main>

      {/* Footer */}
      {config?.footer && (
        <footer className="bg-gray-50 border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600">{config.footer.text}</p>
              {config.footer.links?.length > 0 && (
                <div className="mt-4 space-x-4">
                  {config.footer.links.map((link: any) => (
                    <a
                      key={link.url}
                      href={link.url}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </footer>
      )}

      {/* Custom CSS */}
      {config?.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: config.custom_css }} />
      )}
    </div>
  )
}
