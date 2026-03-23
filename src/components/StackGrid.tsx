import StackCard from './StackCard'

interface Tech {
  name: string
  icon: string
  category: string
  confidence: 'high' | 'medium' | 'low'
}

interface Props {
  detected: Tech[]
}

// Category display order — most important first
const CATEGORY_ORDER = ['Frontend', 'Backend', 'Hosting', 'CDN', 'CMS', 'Analytics']

export default function StackGrid({ detected }: Props) {
  // Group techs by category
  const grouped = detected.reduce<Record<string, Tech[]>>((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = []
    acc[tech.category].push(tech)
    return acc
  }, {})

  // Sort categories by our preferred order
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  )

  if (detected.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-sm">No technologies detected. The site may be blocking scrapers.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedCategories.map(category => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {category}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {grouped[category].map(tech => (
              <StackCard key={tech.name} {...tech} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}