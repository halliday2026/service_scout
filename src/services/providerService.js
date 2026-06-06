import { haversine } from '../utils/haversine.js'

// TODO: replace with real Places API call (Google Places Nearby Search)
// When replacing: call the Nearby Search endpoint with location, radius, and type
// mapped from serviceType ('oilChange' → 'oil_change', 'wash' → 'car_wash', 'tires' → 'tire_dealer')
// Return up to 5 results in the same provider schema below.

const MOCK_DATA = {
  oilChange: [
    { id: 'oc_001', name: 'Jiffy Lube Upland',              lat: 34.1062, lng: -117.6483, rating: 4.3, priceLevel: 2, phone: '9097881100' },
    { id: 'oc_002', name: 'Valvoline Instant Oil Change',   lat: 34.0921, lng: -117.6612, rating: 4.5, priceLevel: 2, phone: '9097234567' },
    { id: 'oc_003', name: 'Take 5 Oil Change',              lat: 34.0845, lng: -117.6392, rating: 4.1, priceLevel: 1, phone: '9096543210' },
    { id: 'oc_004', name: 'Firestone Complete Auto Care',   lat: 34.1134, lng: -117.6721, rating: 3.9, priceLevel: 2, phone: '9097891234' },
    { id: 'oc_005', name: 'Pep Boys Upland',                lat: 34.0789, lng: -117.6554, rating: 4.0, priceLevel: 2, phone: '9096789012' },
    { id: 'oc_006', name: 'Meineke Car Care Center',        lat: 34.1023, lng: -117.6334, rating: 4.4, priceLevel: 1, phone: null          },
    { id: 'oc_007', name: 'Kwik Kar Oil & Lube',            lat: 34.0934, lng: -117.6789, rating: 4.2, priceLevel: 1, phone: '9095551234' },
    { id: 'oc_008', name: 'Christian Brothers Automotive',  lat: 34.0867, lng: -117.6445, rating: 4.7, priceLevel: 3, phone: '9094445678' },
  ],
  wash: [
    { id: 'wh_001', name: 'Mister Car Wash',                lat: 34.1045, lng: -117.6612, rating: 4.2, priceLevel: 2, phone: '9097112233' },
    { id: 'wh_002', name: "Tommy's Express Car Wash",       lat: 34.1112, lng: -117.6723, rating: 4.5, priceLevel: 1, phone: '9097223344' },
    { id: 'wh_003', name: 'Super Star Car Wash',            lat: 34.0823, lng: -117.6534, rating: 4.0, priceLevel: 2, phone: '9096334455' },
    { id: 'wh_004', name: 'Delta Sonic Car Wash',           lat: 34.0978, lng: -117.6502, rating: 3.8, priceLevel: 2, phone: null          },
    { id: 'wh_005', name: 'Wave Car Wash',                  lat: 34.0945, lng: -117.6289, rating: 4.3, priceLevel: 1, phone: '9095556677' },
    { id: 'wh_006', name: 'Autobell Car Wash',              lat: 34.0856, lng: -117.6388, rating: 4.1, priceLevel: 1, phone: '9094667788' },
    { id: 'wh_007', name: 'Spotless Car Wash',              lat: 34.1067, lng: -117.6445, rating: 4.4, priceLevel: 2, phone: '9097778899' },
    { id: 'wh_008', name: 'Clean Machine Detail Center',    lat: 34.0789, lng: -117.6667, rating: 4.6, priceLevel: 3, phone: '9096889900' },
  ],
  tires: [
    { id: 'tr_001', name: "America's Tire",                 lat: 34.0912, lng: -117.6423, rating: 4.6, priceLevel: 2, phone: '9097001122' },
    { id: 'tr_002', name: 'Discount Tire',                  lat: 34.1089, lng: -117.6556, rating: 4.5, priceLevel: 2, phone: '9097112233' },
    { id: 'tr_003', name: 'Big O Tires',                    lat: 34.0967, lng: -117.6734, rating: 4.0, priceLevel: 2, phone: '9096223344' },
    { id: 'tr_004', name: 'Pep Boys Tires',                 lat: 34.1145, lng: -117.6389, rating: 3.9, priceLevel: 2, phone: '9097334455' },
    { id: 'tr_005', name: 'Firestone Tire & Auto Service',  lat: 34.0834, lng: -117.6678, rating: 4.1, priceLevel: 2, phone: null          },
    { id: 'tr_006', name: 'NTB - National Tire & Battery',  lat: 34.1034, lng: -117.6267, rating: 3.8, priceLevel: 1, phone: '9094556677' },
    { id: 'tr_007', name: 'Mavis Discount Tire',            lat: 34.0878, lng: -117.6512, rating: 4.3, priceLevel: 1, phone: '9095667788' },
    { id: 'tr_008', name: 'Costco Tire Center',             lat: 34.0923, lng: -117.6845, rating: 4.7, priceLevel: 1, phone: '9096778899' },
  ],
}

/**
 * Returns up to 5 providers for the given service, sorted by distance from user coords.
 * @param {'oilChange'|'wash'|'tires'} serviceType
 * @param {number} userLat
 * @param {number} userLng
 * @returns {Promise<Array>}
 */
export function getProviders(serviceType, userLat, userLng) {
  // TODO: replace with real Places API call (Google Places Nearby Search)
  const providers = MOCK_DATA[serviceType] ?? []
  const withDistance = providers.map((p) => ({
    ...p,
    distance: haversine(userLat, userLng, p.lat, p.lng),
  }))
  withDistance.sort((a, b) => a.distance - b.distance)
  return Promise.resolve(withDistance.slice(0, 5))
}
