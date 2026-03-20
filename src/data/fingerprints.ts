export type Category = 
  | 'Frontend' 
  | 'Backend' 
  | 'Hosting' 
  | 'CDN' 
  | 'Analytics' 
  | 'CMS'

export interface Fingerprint {
  name: string
  category: Category
  icon: string
  checks: {
    // Look for these key-value patterns in HTTP response headers
    headers?: { key: string; contains: string }[]
    // Look for these substrings in <script src="..."> URLs
    scripts?: string[]
    // Look for these substrings anywhere in the first 5000 chars of HTML
    html?: string[]
    // Look for these in <meta> tag values
    meta?: { key: string; contains: string }[]
  }
}

export const fingerprints: Fingerprint[] = [
  // ─── Frontend Frameworks ───────────────────────────────
  {
    name: 'Next.js',
    category: 'Frontend',
    icon: '▲',
    checks: {
      headers: [{ key: 'x-powered-by', contains: 'Next.js' }],
      html: ['__NEXT_DATA__', '_next/static', '_next/image'],
    },
  },
  {
    name: 'React',
    category: 'Frontend',
    icon: '⚛',
    checks: {
      html: ['react.development.js', 'react.production.min.js', '__reactFiber', 'react-dom'],
    },
  },
  {
    name: 'Vue.js',
    category: 'Frontend',
    icon: '💚',
    checks: {
      html: ['vue.runtime', '__vue__', 'data-v-', 'vue.min.js'],
    },
  },
  {
    name: 'Nuxt',
    category: 'Frontend',
    icon: '💚',
    checks: {
      html: ['__nuxt', '_nuxt/', 'nuxt.config'],
    },
  },
  {
    name: 'Svelte',
    category: 'Frontend',
    icon: '🔥',
    checks: {
      html: ['__svelte', 'svelte/internal', '.svelte-'],
    },
  },
  {
    name: 'Angular',
    category: 'Frontend',
    icon: '🅰',
    checks: {
      html: ['ng-version=', 'angular/core', 'ng-app'],
    },
  },
  {
    name: 'Remix',
    category: 'Frontend',
    icon: '💿',
    checks: {
      html: ['__remixContext', '__remixManifest'],
    },
  },
  {
    name: 'Astro',
    category: 'Frontend',
    icon: '🚀',
    checks: {
      html: ['astro-island', 'astro/client'],
    },
  },

  // ─── Hosting ───────────────────────────────────────────
  {
    name: 'Vercel',
    category: 'Hosting',
    icon: '▲',
    checks: {
      headers: [
        { key: 'server', contains: 'Vercel' },
        { key: 'x-vercel-id', contains: '' },
      ],
    },
  },
  {
    name: 'Netlify',
    category: 'Hosting',
    icon: '🟩',
    checks: {
      headers: [
        { key: 'server', contains: 'Netlify' },
        { key: 'x-nf-request-id', contains: '' },
      ],
    },
  },
  {
    name: 'GitHub Pages',
    category: 'Hosting',
    icon: '🐙',
    checks: {
      headers: [{ key: 'server', contains: 'GitHub.com' }],
    },
  },
  {
    name: 'AWS S3',
    category: 'Hosting',
    icon: '☁',
    checks: {
      headers: [
        { key: 'server', contains: 'AmazonS3' },
        { key: 'x-amz-request-id', contains: '' },
      ],
    },
  },
  {
    name: 'Firebase',
    category: 'Hosting',
    icon: '🔥',
    checks: {
      headers: [{ key: 'server', contains: 'Firebase' }],
      html: ['firebaseapp.com', 'firebase/app'],
    },
  },

  // ─── CDN ───────────────────────────────────────────────
  {
    name: 'Cloudflare',
    category: 'CDN',
    icon: '🔶',
    checks: {
      headers: [
        { key: 'server', contains: 'cloudflare' },
        { key: 'cf-ray', contains: '' },
      ],
    },
  },
  {
    name: 'Fastly',
    category: 'CDN',
    icon: '⚡',
    checks: {
      headers: [{ key: 'x-served-by', contains: 'cache' }],
    },
  },
  {
    name: 'jsDelivr',
    category: 'CDN',
    icon: '📦',
    checks: {
      scripts: ['cdn.jsdelivr.net'],
    },
  },

  // ─── CMS ───────────────────────────────────────────────
  {
    name: 'WordPress',
    category: 'CMS',
    icon: '🔵',
    checks: {
      html: ['wp-content', 'wp-includes', 'wordpress'],
    },
  },
  {
    name: 'Shopify',
    category: 'CMS',
    icon: '🛍',
    checks: {
      html: ['Shopify.theme', 'cdn.shopify.com', 'myshopify.com'],
    },
  },
  {
    name: 'Webflow',
    category: 'CMS',
    icon: '🌊',
    checks: {
      html: ['webflow.com/css', 'data-wf-page'],
    },
  },
  {
    name: 'Ghost',
    category: 'CMS',
    icon: '👻',
    checks: {
      html: ['ghost-url', 'content/themes/'],
    },
  },
  {
    name: 'Contentful',
    category: 'CMS',
    icon: '📝',
    checks: {
      html: ['ctfassets.net', 'contentful.com'],
    },
  },

  // ─── Analytics ─────────────────────────────────────────
  {
    name: 'Google Analytics',
    category: 'Analytics',
    icon: '📊',
    checks: {
      scripts: ['google-analytics.com/analytics.js', 'googletagmanager.com'],
      html: ['gtag(', 'GoogleAnalyticsObject'],
    },
  },
  {
    name: 'Plausible',
    category: 'Analytics',
    icon: '📈',
    checks: {
      scripts: ['plausible.io/js'],
    },
  },
  {
    name: 'PostHog',
    category: 'Analytics',
    icon: '🦔',
    checks: {
      scripts: ['posthog.com'],
      html: ['posthog.init'],
    },
  },
  {
    name: 'Hotjar',
    category: 'Analytics',
    icon: '🔥',
    checks: {
      html: ['hotjar.com', 'hj(\'identify'],
    },
  },
  {
    name: 'Mixpanel',
    category: 'Analytics',
    icon: '🎯',
    checks: {
      scripts: ['cdn.mxpnl.com', 'mixpanel.com'],
      html: ['mixpanel.init'],
    },
  },

  // ─── Backend hints ─────────────────────────────────────
  {
    name: 'Nginx',
    category: 'Backend',
    icon: '🟩',
    checks: {
      headers: [{ key: 'server', contains: 'nginx' }],
    },
  },
  {
    name: 'Apache',
    category: 'Backend',
    icon: '🪶',
    checks: {
      headers: [{ key: 'server', contains: 'Apache' }],
    },
  },
  {
    name: 'Express',
    category: 'Backend',
    icon: '🚂',
    checks: {
      headers: [{ key: 'x-powered-by', contains: 'Express' }],
    },
  },
]