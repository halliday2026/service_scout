const TABS = [
  { id: 'distance', label: 'Distance' },
  { id: 'price',    label: 'Price'    },
  { id: 'rating',   label: 'Rating'   },
]

export default function SortTabs({ sortBy, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-2 px-3 rounded-full text-sm font-medium min-h-[44px] transition-colors ${
            sortBy === tab.id
              ? 'bg-brand text-white shadow-sm'
              : 'border border-brand text-brand bg-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
