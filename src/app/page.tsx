'use client'

import { useState } from 'react'
import UrlInput from '@/components/UrlInput'
import StackGrid from '@/components/StackGrid'
import SummaryPanel from '@/components/SummaryPanel'

interface AnalysisResult {
  url: string
  title: string
  detected: any[]
  llmSummary: any
  detectedAt: string
}

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-5 flex justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              StackSnap
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              X-ray vision for the web
            </p>
          </div>
          
            <a href="https://github.com/riddhij-7/stacksnap"
            target="_blank"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >

            GitHub →
          </a>
        </div>
      </div>

      {/* Hero + input */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
          What is this site built with?
        </h2>
        <p className="text-gray-500 text-base mb-10 max-w-xl mx-auto">
          Paste any URL and StackSnap reverse-engineers the full tech stack,
          frameworks, hosting, CDN, analytics and more.
        </p>

        <div className="max-w-2xl mx-auto">
          <UrlInput onResult={setResult} onLoading={setLoading} />
        </div>

        {/* Example URLs */}
        {!result && !loading && (
          <div className="mt-4 flex gap-2 justify-center flex-wrap">
            {['https://vercel.com', 'https://linear.app', 'https://ghost.org'].map(example => (
              <button
                key={example}
                onClick={() => {
                  setResult(null)
                  document.querySelector('input')?.setAttribute('value', example)
                }}
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="h-40 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="max-w-4xl mx-auto px-6 pb-16 space-y-8">

          {/* Detected count badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {result.detected.length} technologies detected on{' '}
              <span className="font-medium text-gray-900">{result.url}</span>
            </span>
          </div>

          {/* Tech stack cards */}
          <StackGrid detected={result.detected} />

          {/* AI summary */}
          {result.llmSummary && (
            <SummaryPanel
              summary={result.llmSummary}
              title={result.title}
              url={result.url}
            />
          )}

        </div>
      )}
    </main>
  )
}