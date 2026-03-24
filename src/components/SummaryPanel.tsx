interface LLMSummary {
  architecture: string
  suggestions: string[]
  concerns: string[]
}

interface Props {
  summary: LLMSummary
  title: string
  url: string
}

export default function SummaryPanel({ summary, title, url }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5">

      {/* Site identity */}
      <div className="border-b border-gray-100 pb-4">
        <p className="text-xs text-gray-400 mb-1">{url}</p>
        <h2 className="font-semibold text-gray-900 text-lg leading-snug">
          {title || 'Untitled site'}
        </h2>
      </div>

      {/* Architecture summary */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Architecture
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          {summary.architecture}
        </p>
      </div>

      {/* Suggestions */}
      {summary.suggestions.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Suggestions
          </h4>
          <ul className="space-y-2">
            {summary.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns */}
      {summary.concerns.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Concerns
          </h4>
          <ul className="space-y-2">
            {summary.concerns.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}