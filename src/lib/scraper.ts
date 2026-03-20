import axios from 'axios'
import * as cheerio from 'cheerio'

export interface ScrapedData {
  url: string
  headers: Record<string, string>
  metaTags: Record<string, string>
  scriptSrcs: string[]
  linkHrefs: string[]
  htmlSnippet: string
  title: string
}

export async function scrapeUrl(url: string): Promise<ScrapedData> {
  const response = await axios.get(url, {
    timeout: 10000,
    headers: {
      // We pretend to be a real browser so sites don't block us
      'User-Agent': 'Mozilla/5.0 (compatible; Stacksnap/1.0)',
    },
    maxRedirects: 5,
  })

  const html: string = response.data
  const $ = cheerio.load(html)
  const headers = response.headers as Record<string, string>

  // Extract all <meta name="x" content="y"> tags
  const metaTags: Record<string, string> = {}
  $('meta').each((_, el) => {
    const name = $(el).attr('name') || $(el).attr('property') || ''
    const content = $(el).attr('content') || ''
    if (name) metaTags[name] = content
  })

  // Extract all <script src="..."> URLs
  // These are goldmines — react.min.js, gtag, cdn.shopify.com etc
  const scriptSrcs: string[] = []
  $('script[src]').each((_, el) => {
    scriptSrcs.push($(el).attr('src') || '')
  })

  // Extract <link href="..."> — reveals CDNs, fonts, frameworks
  const linkHrefs: string[] = []
  $('link[href]').each((_, el) => {
    linkHrefs.push($(el).attr('href') || '')
  })

  return {
    url,
    headers,
    metaTags,
    scriptSrcs,
    linkHrefs,
    // first 5000 chars of HTML — enough for pattern matching
    // without loading megabytes of content into memory
    htmlSnippet: html.slice(0, 5000),
    title: $('title').text(),
  }
}

