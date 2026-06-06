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

export default function HomeScreen({ onSelectService, isOffline }) {
  return (
    <div className="flex flex-col items-center px-5 pt-12 pb-8 min-h-screen">
      <div className="flex items-center gap-3 mb-2">
        <AppLogo size={52} />
        <h1 className="text-2xl font-bold text-gray-900">Service Scout</h1>
      </div>
      <p className="text-gray-500 text-sm mb-12 text-center">Find nearby service providers</p>

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
    </div>
  )
}
