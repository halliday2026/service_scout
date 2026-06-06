function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 opacity-70">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function ServiceButton({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-4 bg-brand text-white rounded-2xl px-5 py-4 min-h-[64px] text-left font-semibold text-lg shadow-md active:scale-[0.97] transition-transform disabled:opacity-40 disabled:cursor-not-allowed select-none"
    >
      <span className="w-10 h-10 flex items-center justify-center shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRight />
    </button>
  )
}
