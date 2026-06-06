export default function AppLogo({ size = 48 }) {
  return (
    <img
      src="/assets/app-icon.png"
      alt="Service Scout logo"
      width={size}
      height={size}
      className="rounded-xl"
      onError={(e) => { e.currentTarget.style.display = 'none' }}
    />
  )
}
