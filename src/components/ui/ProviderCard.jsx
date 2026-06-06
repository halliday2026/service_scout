const PRICE_LABELS = { 1: '$', 2: '$$', 3: '$$$' }

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

export default function ProviderCard({ provider }) {
  const { name, rating, priceLevel, phone, lat, lng, distance } = provider
  const mapsUrl = `https://maps.google.com/?daddr=${lat},${lng}`
  const priceText = priceLevel ? `${PRICE_LABELS[priceLevel]} (est.)` : 'Call for pricing'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-gray-900 flex-1 pr-3 leading-snug">{name}</h3>
        <span className="text-gray-500 text-sm whitespace-nowrap shrink-0">{distance?.toFixed(1)} mi</span>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <span className="text-gray-600">{priceText}</span>
        <span className="flex items-center gap-1 text-amber-500">
          <StarIcon />
          <span className="text-gray-700 font-medium">{rating.toFixed(1)}</span>
        </span>
      </div>

      <div className="flex gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-brand text-white text-center py-3 px-3 rounded-xl text-sm font-semibold min-h-[44px] flex items-center justify-center"
        >
          Directions
        </a>
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 border-2 border-brand text-brand text-center py-3 px-3 rounded-xl text-sm font-semibold min-h-[44px] flex items-center justify-center"
          >
            Call
          </a>
        )}
      </div>
    </div>
  )
}
