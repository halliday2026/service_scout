export default function ZipFallbackInput({ value, onChange, onSubmit, loading }) {
  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onSubmit()
  }

  return (
    <div className="py-6 px-2">
      <p className="text-gray-600 text-sm font-medium text-center mb-1">Location access was denied</p>
      <p className="text-gray-500 text-sm text-center mb-6">
        Enter your ZIP code or city to find providers near you.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ZIP code or city (e.g. 91786)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          autoComplete="postal-code"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!value.trim() || loading}
          className="w-full bg-brand text-white py-3 px-4 rounded-xl min-h-[44px] font-semibold text-sm disabled:opacity-50"
        >
          {loading ? 'Finding providers…' : 'Find Providers'}
        </button>
      </form>
    </div>
  )
}
