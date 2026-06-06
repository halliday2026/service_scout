const FALLBACK_COORDS = { lat: 34.09, lng: -117.65 } // Upland, CA

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
    )
  })
}

// TODO: replace with real geocoding (e.g., Google Geocoding API, Nominatim)
export async function geocodeInput(input) {
  console.warn('Using hardcoded fallback coords for input:', input)
  return FALLBACK_COORDS
}
