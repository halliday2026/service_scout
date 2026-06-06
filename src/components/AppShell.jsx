export default function AppShell({ children, isOffline }) {
  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      {isOffline && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-700 font-medium">
          No internet connection
        </div>
      )}
      {children}
    </div>
  )
}
