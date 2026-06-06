# Service Scout

Mobile-first PWA for finding nearby auto service providers (oil change, car wash, tires). No backend, no auth, no login — ever.

## Commands

```bash
npm run dev       # dev server at http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve dist/ at http://localhost:4173 (use for PWA/SW testing)
```

## Tech stack

- **React 18** + **Vite 5** — no router (state-based screen switching)
- **Tailwind CSS v3** — mobile-first, custom `brand` color scale anchored at `#1D6FE8`
- **vite-plugin-pwa** + Workbox — service worker, web app manifest, offline app shell caching

## Architecture

All app state lives in a single `useReducer` in [src/App.jsx](src/App.jsx). There are exactly two screens rendered conditionally — no URL routing.

```
screen: 'home'    → HomeScreen
screen: 'results' → ResultsScreen (handles loading, error, zip-fallback, and results inline)
```

**State machine flow:**
1. User taps service → `SELECT_SERVICE` → locationState: `'requesting'`
2. GPS succeeds → `LOCATION_GRANTED` → locationState: `'granted'`
3. GPS denied → `LOCATION_DENIED` → ZIP fallback input shown
4. ZIP submitted → `SUBMIT_MANUAL` → geocode stub → `LOCATION_GRANTED`
5. Coords available → `getProviders()` → `PROVIDERS_LOADED`

Cached coords are reused when the user goes back and picks a different service.

## Data layer

**[src/services/providerService.js](src/services/providerService.js)** — the only file to touch when swapping in a real API. Exports one function:

```js
getProviders(serviceType, userLat, userLng) → Promise<Provider[]>
// serviceType: 'oilChange' | 'wash' | 'tires'
// Returns max 5 providers sorted by distance
```

Mock data covers 8 providers per category around Upland, CA (34.09, -117.65). Distance is computed via haversine in [src/utils/haversine.js](src/utils/haversine.js).

**[src/services/locationService.js](src/services/locationService.js)** — wraps `navigator.geolocation` and exports a `geocodeInput()` stub for the ZIP fallback.

## TODO markers in code

All real-API integration points are marked:

| File | Marker |
|------|--------|
| `src/services/providerService.js` | `// TODO: replace with real Places API call` |
| `src/services/locationService.js` | `// TODO: replace with real geocoding` |
| `src/utils/haversine.js` | `// TODO: auto-detect locale for km` |

## Styling conventions

- Accent color: `bg-brand` / `text-brand` (Tailwind custom scale, base `#1D6FE8`)
- All interactive elements: `min-h-[44px]` (44px touch target floor)
- No horizontal scroll: `overflow-x: hidden` on `html, body` in [src/index.css](src/index.css)
- Max content width: `max-w-md mx-auto` in AppShell

## Icons

Source icon at `public/assets/app-icon.png`. Sized variants at `icon-192.png` and `icon-512.png` were generated with `sharp`. To regenerate:

```bash
node -e "
const s = require('sharp');
Promise.all([
  s('public/assets/app-icon.png').resize(192,192,{fit:'contain',background:{r:255,g:255,b:255,alpha:0}}).toFile('public/assets/icon-192.png'),
  s('public/assets/app-icon.png').resize(512,512,{fit:'contain',background:{r:255,g:255,b:255,alpha:0}}).toFile('public/assets/icon-512.png'),
]).then(() => console.log('done'))
"
```

## Hard constraints

- Zero authentication, accounts, sessions, or credential entry — anywhere
- Never show more than 5 results per service
- No horizontal scrolling on mobile viewports (320–430px)
- All error/fallback states must be handled without dead ends (always a retry or back path)
