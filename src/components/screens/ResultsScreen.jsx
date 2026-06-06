import { useMemo } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'
import ZipFallbackInput from '../ui/ZipFallbackInput'
import ErrorBanner from '../ui/ErrorBanner'
import SortTabs from '../ui/SortTabs'
import ProviderCard from '../ui/ProviderCard'

const SERVICE_LABELS = {
  oilChange: 'Oil Change',
  wash:      'Car Wash',
  tires:     'Tires',
}

export default function ResultsScreen({ state, dispatch }) {
  const {
    selectedService, locationState, locationDeniedReason, loadingProviders,
    providers, sortBy, error, isOffline, manualInput, pendingGeocode,
  } = state

  const sortedProviders = useMemo(() => {
    const copy = [...providers]
    if (sortBy === 'price')  return copy.sort((a, b) => a.priceLevel - b.priceLevel)
    if (sortBy === 'rating') return copy.sort((a, b) => b.rating - a.rating)
    return copy // already distance-sorted from service
  }, [providers, sortBy])

  const isLoading = locationState === 'requesting' || loadingProviders || pendingGeocode
  const showZipFallback = !isLoading && (locationState === 'denied' || locationState === 'error')
  const loadingMessage = locationState === 'requesting'
    ? 'Getting your location to find providers near you…'
    : 'Loading providers…'

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-white sticky top-0 z-10">
        <button
          onClick={() => dispatch({ type: 'GO_HOME' })}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-brand rounded-xl active:bg-brand-50"
          aria-label="Back to home"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="text-lg font-bold flex-1 text-gray-900">
          {SERVICE_LABELS[selectedService]}
        </h2>
      </div>

      <div className="flex-1 px-4 py-4">
        {/* Offline state */}
        {isOffline && !isLoading && (
          <ErrorBanner
            message="You're offline. Results require a network connection."
            onRetry={() => dispatch({ type: 'SELECT_SERVICE', payload: selectedService })}
            onBack={() => dispatch({ type: 'GO_HOME' })}
          />
        )}

        {/* Loading */}
        {isLoading && <LoadingSpinner message={loadingMessage} />}

        {/* Location denied — manual ZIP input */}
        {showZipFallback && (
          <ZipFallbackInput
            value={manualInput}
            onChange={(v) => dispatch({ type: 'SET_MANUAL_INPUT', payload: v })}
            onSubmit={() => dispatch({ type: 'SUBMIT_MANUAL' })}
            loading={pendingGeocode}
            deniedReason={locationDeniedReason}
          />
        )}

        {/* Error state */}
        {!isLoading && !showZipFallback && error && !isOffline && (
          <ErrorBanner
            message={error}
            onRetry={() => dispatch({ type: 'SELECT_SERVICE', payload: selectedService })}
            onBack={() => dispatch({ type: 'GO_HOME' })}
          />
        )}

        {/* Results */}
        {!isLoading && !showZipFallback && !error && !isOffline && (
          <>
            {sortedProviders.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-gray-400">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <p className="text-gray-500 max-w-xs">
                  No providers found nearby. Try a different service or location.
                </p>
                <button
                  onClick={() => dispatch({ type: 'GO_HOME' })}
                  className="bg-brand text-white px-6 py-3 rounded-xl min-h-[44px] font-semibold text-sm"
                >
                  Try Another Service
                </button>
              </div>
            ) : (
              <>
                <SortTabs
                  sortBy={sortBy}
                  onChange={(s) => dispatch({ type: 'SET_SORT', payload: s })}
                />
                <div className="flex flex-col gap-3">
                  {sortedProviders.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
