import { useReducer, useEffect } from 'react'
import AppShell from './components/AppShell'
import HomeScreen from './components/screens/HomeScreen'
import ResultsScreen from './components/screens/ResultsScreen'
import { getCurrentPosition, geocodeInput } from './services/locationService'
import { getProviders } from './services/providerService'

const initialState = {
  screen: 'home',
  selectedService: null,
  locationState: 'idle',   // 'idle' | 'requesting' | 'granted' | 'denied' | 'error'
  locationDeniedReason: null, // 'permission' | 'unavailable'
  userCoords: null,
  defaultLocation: localStorage.getItem('defaultLocation') ?? '',
  manualInput: '',
  pendingGeocode: false,
  providers: [],
  loadingProviders: false,
  sortBy: 'distance',
  error: null,
  isOffline: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_SERVICE':
      return {
        ...state,
        selectedService: action.payload,
        screen: 'results',
        providers: [],
        error: null,
        sortBy: 'distance',
        locationDeniedReason: null,
        locationState: state.userCoords ? 'granted' : 'requesting',
      }
    case 'LOCATION_GRANTED':
      return { ...state, locationState: 'granted', userCoords: action.payload, locationDeniedReason: null }
    case 'LOCATION_DENIED':
      return { ...state, locationState: 'denied', locationDeniedReason: action.payload ?? 'unavailable' }
    case 'USE_DEFAULT_LOCATION':
      // Auto-geocode the saved default location instead of showing the manual input
      return { ...state, locationState: 'idle', manualInput: state.defaultLocation, pendingGeocode: true }
    case 'SET_DEFAULT_LOCATION':
      return { ...state, defaultLocation: action.payload }
    case 'PROVIDERS_LOADING':
      return { ...state, loadingProviders: true, error: null }
    case 'PROVIDERS_LOADED':
      return { ...state, providers: action.payload, loadingProviders: false }
    case 'PROVIDERS_ERROR':
      return { ...state, error: action.payload, loadingProviders: false }
    case 'SET_MANUAL_INPUT':
      return { ...state, manualInput: action.payload }
    case 'SUBMIT_MANUAL':
      return { ...state, pendingGeocode: true }
    case 'GEOCODE_STARTED':
      return { ...state, pendingGeocode: false }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload }
    case 'GO_HOME':
      return { ...initialState, defaultLocation: state.defaultLocation, userCoords: state.userCoords, isOffline: state.isOffline }
    case 'SET_OFFLINE':
      return { ...state, isOffline: action.payload }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Persist default location to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('defaultLocation', state.defaultLocation)
  }, [state.defaultLocation])

  // Offline detection
  useEffect(() => {
    dispatch({ type: 'SET_OFFLINE', payload: !navigator.onLine })
    const handleOnline  = () => dispatch({ type: 'SET_OFFLINE', payload: false })
    const handleOffline = () => dispatch({ type: 'SET_OFFLINE', payload: true })
    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // When GPS is denied, auto-use the saved default location if one exists —
  // skips the manual ZIP fallback input entirely
  useEffect(() => {
    if (state.locationState !== 'denied') return
    if (!state.defaultLocation) return
    dispatch({ type: 'USE_DEFAULT_LOCATION' })
  }, [state.locationState, state.defaultLocation])

  // Service selection — GPS is called synchronously from the tap handler (not a useEffect)
  // so it stays within iOS Safari's user-gesture context
  const handleSelectService = (service) => {
    if (state.userCoords) {
      dispatch({ type: 'SELECT_SERVICE', payload: service })
      return
    }

    const gpsPromise = getCurrentPosition()
    dispatch({ type: 'SELECT_SERVICE', payload: service })

    gpsPromise
      .then((coords) => dispatch({ type: 'LOCATION_GRANTED', payload: coords }))
      .catch((err) => dispatch({
        type: 'LOCATION_DENIED',
        payload: err?.code === 1 ? 'permission' : 'unavailable',
      }))
  }

  // Manual geocode (ZIP fallback input or auto-triggered from default location)
  useEffect(() => {
    if (!state.pendingGeocode) return
    dispatch({ type: 'GEOCODE_STARTED' })
    geocodeInput(state.manualInput)
      .then((coords) => dispatch({ type: 'LOCATION_GRANTED', payload: coords }))
      .catch(() => dispatch({ type: 'PROVIDERS_ERROR', payload: 'Could not find that location. Try a ZIP code.' }))
  }, [state.pendingGeocode])

  // Load providers once coords are available
  useEffect(() => {
    if (state.locationState !== 'granted' || !state.userCoords || !state.selectedService) return
    dispatch({ type: 'PROVIDERS_LOADING' })
    getProviders(state.selectedService, state.userCoords.lat, state.userCoords.lng)
      .then((providers) => dispatch({ type: 'PROVIDERS_LOADED', payload: providers }))
      .catch((err) => dispatch({ type: 'PROVIDERS_ERROR', payload: err.message || 'Failed to load providers.' }))
  }, [state.locationState, state.userCoords, state.selectedService])

  return (
    <AppShell isOffline={state.isOffline}>
      {state.screen === 'home' && (
        <HomeScreen
          onSelectService={handleSelectService}
          isOffline={state.isOffline}
          defaultLocation={state.defaultLocation}
          onSaveDefaultLocation={(loc) => dispatch({ type: 'SET_DEFAULT_LOCATION', payload: loc })}
        />
      )}
      {state.screen === 'results' && (
        <ResultsScreen state={state} dispatch={dispatch} />
      )}
    </AppShell>
  )
}
