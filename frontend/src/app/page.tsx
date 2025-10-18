'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Welcome to Runic CMS
        </h1>
        <p className="text-center mb-8 text-lg">
          Self-hosted, customizable content management system
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/admin" 
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Admin Dashboard
          </Link>
          <Link 
            href="/preview" 
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Preview Site
          </Link>
        </div>
      </div>
    </main>
  )
}
