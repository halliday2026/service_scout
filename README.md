# Service Scout

A mobile-first PWA for finding nearby oil change, car wash, and tire shops.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser. For PWA testing (service worker, installability), use the production preview:

```bash
npm run build
npm run preview
```

Then open http://localhost:4173 and check Chrome DevTools → Application → Manifest.

## App icon setup

Placeholder icons (solid blue 192×192 and 512×512 PNGs) are included so the app runs immediately. Before deploying to production, replace them with resized variants of your real icon:

```bash
# Requires ImageMagick
magick public/assets/app-icon.png -resize 192x192 public/assets/icon-192.png
magick public/assets/app-icon.png -resize 512x512 public/assets/icon-512.png
```

Or use [Squoosh](https://squoosh.app) to resize manually. The 512×512 icon should have ~10% padding on all sides for Android's maskable icon safe zone.

## Swapping in a real Places API

All mock data lives in `src/services/providerService.js`. The function signature stays the same — only the internals change:

```js
// src/services/providerService.js
export function getProviders(serviceType, userLat, userLng) {
  // TODO: replace with real Places API call (Google Places Nearby Search)
  // 1. Map serviceType → Places type:
  //    'oilChange' → 'oil_change', 'wash' → 'car_wash', 'tires' → 'tire_dealer'
  // 2. Call the Nearby Search endpoint with userLat/userLng and a radius (e.g. 8047m = 5mi)
  // 3. Map results to { id, name, lat, lng, rating, priceLevel, phone, distance }
  // 4. Return Promise<Provider[]> (max 5, sorted by distance)
}
```

For geocoding the manual ZIP/city fallback, edit `src/services/locationService.js`:

```js
export async function geocodeInput(input) {
  // TODO: replace with real geocoding (e.g., Google Geocoding API, Nominatim)
  // Call the Geocoding API with `input`, return { lat, lng }
}
```

## Open TODOs (from code markers)

| File | TODO |
|------|------|
| `src/services/providerService.js` | Replace mock data with real Google Places Nearby Search |
| `src/services/locationService.js` | Replace geocoding stub with real geocoding API |
| `src/utils/haversine.js` | Auto-detect locale to display km instead of miles |
