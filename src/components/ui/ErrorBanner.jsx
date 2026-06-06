export default function ErrorBanner({ message, onRetry, onBack }) {
  return (
    <div className="flex flex-col items-center py-12 px-4 gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-red-500">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-gray-700 max-w-xs">{message}</p>
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-brand text-white px-6 py-3 rounded-xl min-h-[44px] font-semibold text-sm"
          >
            Retry
          </button>
        )}
        {onBack && (
          <button
            onClick={onBack}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl min-h-[44px] font-semibold text-sm"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  )
}
