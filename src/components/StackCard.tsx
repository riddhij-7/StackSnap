interface Props {
  name: string
  icon: string
  category: string
  confidence: 'high' | 'medium' | 'low'
}

const confidenceStyles = {
  high:   'bg-green-100 text-green-800 border border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  low:    'bg-gray-100 text-gray-600 border border-gray-200',
}

const categoryStyles: Record<string, string> = {
  Frontend:  'bg-purple-50 border-purple-200',
  Hosting:   'bg-blue-50 border-blue-200',
  CDN:       'bg-orange-50 border-orange-200',
  Analytics: 'bg-pink-50 border-pink-200',
  CMS:       'bg-teal-50 border-teal-200',
  Backend:   'bg-slate-50 border-slate-200',
}

export default function StackCard({ name, icon, category, confidence }: Props) {
  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-2 ${categoryStyles[category] ?? 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${confidenceStyles[confidence]}`}>
          {confidence}
        </span>
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{category}</p>
      </div>
    </div>
  )
}