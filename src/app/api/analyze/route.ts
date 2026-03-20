import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { scrapeUrl } from '@/lib/scraper'
import { detectStack } from '@/lib/fingerprint'
import { analyzeStackWithLLM } from '@/lib/llm'

// Zod validates the incoming request body
// If url is missing or not a valid URL, we return 400 before doing any work
const RequestSchema = z.object({
  url: z.string().url('Please provide a valid URL including http:// or https://'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { url } = parsed.data

    // Step 1: Fetch and scrape the website
    let scraped
    try {
      scraped = await scrapeUrl(url)
    } catch {
      return NextResponse.json(
        { error: 'Could not reach that URL. It may be blocked, offline, or too slow.' },
        { status: 422 }
      )
    }

    // Step 2: Run fingerprint detection
    const analysis = detectStack(scraped)

    // Step 3: Get LLM summary (only if we detected something)
    let llmSummary = null
    if (analysis.detected.length > 0) {
      try {
        llmSummary = await analyzeStackWithLLM(url, analysis.detected)
      } catch {
        // LLM failure is non-fatal — still return the detected stack
        console.error('LLM analysis failed, continuing without it')
      }
    }

    return NextResponse.json({
      url: analysis.url,
      title: analysis.title,
      detected: analysis.detected,
      llmSummary,
      detectedAt: analysis.detectedAt,
    })

  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}