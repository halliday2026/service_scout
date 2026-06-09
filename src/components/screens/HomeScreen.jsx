import { useState } from 'react'
import AppLogo from '../ui/AppLogo'
import ServiceButton from '../ui/ServiceButton'

function OilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

function WashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  )
}

function TireIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2"  x2="12" y2="9"  />
      <line x1="12" y1="15" x2="12" y2="22" />
      <line x1="2"  y1="12" x2="9"  y2="12" />
      <line x1="15" y1="12" x2="22" y2="12" />
    </svg>
  )
}

const SERVICES = [
  { id: 'oilChange', label: 'Oil Change', icon: <OilIcon /> },
  { id: 'wash',      label: 'Car Wash',   icon: <WashIcon /> },
  { id: 'tires',     label: 'Tires',      icon: <TireIcon /> },
]

// status: 'idle' | 'testing' | 'success' | 'denied' | 'unavailable'
function GeoTestModal({ onClose }) {
  const [status, setStatus] = useState('idle')
  const [coords, setCoords] = useState(null)

  function runTest() {
    setStatus('testing')
    setCoords(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('success')
      },
      (err) => setStatus(err.code === 1 ? 'denied' : 'unavailable'),
      { timeout: 10000, enableHighAccuracy: false }
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">Test Location Services</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-4">
          <button
            onClick={runTest}
            disabled={status === 'testing'}
            className="w-full bg-brand text-white py-3 rounded-xl min-h-[44px] font-semibold text-sm disabled:opacity-60"
          >
            {status === 'testing' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Testing…
              </span>
            ) : 'Test GEO Location'}
          </button>

          {status === 'success' && (
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 flex items-start gap-3">
              <span className="text-green-500 text-lg mt-0.5">✓</span>
              <div>
                <p className="text-green-800 font-semibold text-sm">Location services working</p>
                <p className="text-green-700 text-xs mt-0.5">
                  {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </p>
              </div>
            </div>
          )}

          {status === 'denied' && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-3">
              <span className="text-red-500 text-lg mt-0.5">✕</span>
              <div>
                <p className="text-red-800 font-semibold text-sm">Location access is blocked</p>
                <p className="text-red-700 text-xs mt-1">
                  On iPhone: Settings → Privacy &amp; Security → Location Services → enable for Safari or Service Scout.
                </p>
                <p className="text-red-700 text-xs mt-1">
                  On Android: Settings → Apps → Browser → Permissions → Location.
                </p>
              </div>
            </div>
          )}

          {status === 'unavailable' && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-3">
              <span className="text-amber-500 text-lg mt-0.5">⚠</span>
              <div>
                <p className="text-amber-800 font-semibold text-sm">Location unavailable</p>
                <p className="text-amber-700 text-xs mt-0.5">
                  Could not get a position fix. Check that Location Services is on and try again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DefaultLocationInput({ value, onSave }) {
  const [draft, setDraft]       = useState(value)
  const [saved, setSaved]       = useState(false)
  const [showModal, setShowModal] = useState(false)

  function handleSave() {
    const trimmed = draft.trim()
    if (!trimmed) return
    onSave(trimmed)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave()
  }

  return (
    <div className="w-full pt-6 border-t border-gray-200 mt-auto">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide text-center mb-1">
        Default location
      </p>
      <p className="text-xs text-gray-400 text-center mb-3">
        Used automatically when GPS is unavailable
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setShowModal(true)}
          className="border border-gray-300 text-gray-600 px-3 rounded-xl min-h-[44px] text-sm font-medium shrink-0"
        >
          Test
        </button>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ZIP or city (e.g. 90210)"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white min-w-0"
          autoComplete="postal-code"
        />
        <button
          onClick={handleSave}
          disabled={!draft.trim() || draft.trim() === value}
          className="bg-brand text-white px-3 rounded-xl min-h-[44px] text-sm font-semibold disabled:opacity-40 shrink-0 min-w-[52px]"
        >
          {saved ? '✓' : 'Save'}
        </button>
      </div>

      {showModal && <GeoTestModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

export default function HomeScreen({ onSelectService, isOffline, defaultLocation, onSaveDefaultLocation }) {
  return (
    <div className="flex flex-col items-center px-5 pt-12 pb-8 min-h-screen">
      <div className="flex items-center gap-4 mb-12">
        <AppLogo size={52} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Scout</h1>
          <p className="text-gray-500 text-sm">Find nearby service providers</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        {SERVICES.map((s) => (
          <ServiceButton
            key={s.id}
            icon={s.icon}
            label={s.label}
            onClick={() => onSelectService(s.id)}
            disabled={isOffline}
          />
        ))}
      </div>

      {isOffline && (
        <p className="mt-8 text-amber-600 text-sm text-center px-4">
          You're offline. Connect to the internet to find services.
        </p>
      )}

      <div className="w-full mt-auto pt-8">
        <DefaultLocationInput value={defaultLocation} onSave={onSaveDefaultLocation} />
      </div>
    </div>
  )
}
