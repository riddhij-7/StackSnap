'use client'

import { useState } from 'react'

interface AnalysisResult {
  url: string
  title: string
  detected: any[]
  llmSummary: any
  detectedAt: string
}

interface Props {
  onResult: (result: AnalysisResult) => void
  onLoading: (loading: boolean) => void
}

export default function UrlInput({ onResult, onLoading }: Props) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Basic client-side check before hitting the API
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://')
      return
    }

    setLoading(true)
    onLoading(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      onResult(data)
    } catch {
      setError('Could not connect. Make sure the URL is reachable.')
    } finally {
      setLoading(false)
      onLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={loading}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm
                     text-gray-900 placeholder-gray-400 outline-none
                     focus:border-gray-400 focus:ring-2 focus:ring-gray-100
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white
                     hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors"
        >
          {loading ? 'Scanning...' : 'Snap'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
    </form>
  )
}