import { fingerprints } from '@/data/fingerprints'
import type { ScrapedData } from './scraper'

export interface DetectedTech {
  name: string
  category: string
  icon: string
  confidence: 'high' | 'medium' | 'low'
  matchedSignals: string[] // what actually triggered the match
}

export interface AnalysisResult {
  url: string
  title: string
  detected: DetectedTech[]
  detectedAt: string
}

export function detectStack(data: ScrapedData): AnalysisResult {
  const detected: DetectedTech[] = []

  for (const fp of fingerprints) {
    let score = 0
    const matchedSignals: string[] = []
    const { checks } = fp

    // Check HTTP headers — strongest signal (score: 2 per match)
    // Headers like x-powered-by and cf-ray are hard to fake
    checks.headers?.forEach(({ key, contains }) => {
      const headerVal = (data.headers[key] || '').toLowerCase()
      const matched = contains === ''
        ? !!headerVal                              // just presence of header
        : headerVal.includes(contains.toLowerCase()) // header contains value

      if (matched) {
        score += 2
        matchedSignals.push(`header: ${key}`)
      }
    })

    // Check script src URLs — strong signal (score: 2 per match)
    // cdn.shopify.com in a script src is very deliberate
    checks.scripts?.forEach(pattern => {
      if (data.scriptSrcs.some(src => src.includes(pattern))) {
        score += 2
        matchedSignals.push(`script: ${pattern}`)
      }
    })

    // Check raw HTML — weaker signal (score: 1 per match)
    // Could appear in comments or variable names, so lower weight
    checks.html?.forEach(pattern => {
      if (data.htmlSnippet.includes(pattern)) {
        score += 1
        matchedSignals.push(`html: ${pattern}`)
      }
    })

    // Check meta tags — medium signal (score: 1 per match)
    checks.meta?.forEach(({ key, contains }) => {
      if ((data.metaTags[key] || '').toLowerCase().includes(contains.toLowerCase())) {
        score += 1
        matchedSignals.push(`meta: ${key}`)
      }
    })

    // Only include if at least one signal matched
    if (score > 0) {
      detected.push({
        name: fp.name,
        category: fp.category,
        icon: fp.icon,
        // Score thresholds:
        // high   = 3+ points  (multiple signals or one very strong one)
        // medium = 2 points   (one strong signal)
        // low    = 1 point    (one weak HTML hint)
        confidence: score >= 3 ? 'high' : score === 2 ? 'medium' : 'low',
        matchedSignals,
      })
    }
  }

  // Sort: high confidence first, then alphabetically within each tier
  const order = { high: 0, medium: 1, low: 2 }
  detected.sort((a, b) =>
    order[a.confidence] - order[b.confidence] ||
    a.name.localeCompare(b.name)
  )

  return {
    url: data.url,
    title: data.title,
    detected,
    detectedAt: new Date().toISOString(),
  }
}