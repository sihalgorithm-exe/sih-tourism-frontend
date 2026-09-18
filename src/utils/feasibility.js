import { getId, getName, getLatLng, getVisitDurationHours, getCity } from './fields.js';

function parseAveragePrice(text) {
  if (!text || typeof text !== 'string') return undefined;
  const numbers = text.match(/[\d,]+(?:\.\d+)?/g);
  if (!numbers || numbers.length === 0) return undefined;
  const values = numbers.map((n) => parseFloat(n.replace(/,/g, '')));
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function parseAverageRating(text) {
  if (!text || typeof text !== 'string') return undefined;
  const beforeSlash = text.split('/')[0]; // drop the "/5" in "4.3-4.5/5"
  const numbers = beforeSlash.match(/\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length === 0) return undefined;
  const avg = numbers.map(parseFloat).reduce((a, b) => a + b, 0) / numbers.length;
  return Math.min(5, avg);
}

/**
 * Groups already-mapped destinations by city and averages their
 * coordinates. Hotels have no lat/long of their own (not present in the
 * CSV import), so this gives a reasonable, clearly-approximate stand-in:
 * "somewhere near the middle of where you're actually going in that city."
 */
function computeCityCentroids(mappedDestinations) {
  const groups = {};
  for (const d of mappedDestinations) {
    if (!d.city) continue;
    if (!groups[d.city]) groups[d.city] = { latSum: 0, lngSum: 0, count: 0 };
    groups[d.city].latSum += d.latitude;
    groups[d.city].lngSum += d.longitude;
    groups[d.city].count += 1;
  }
  const centroids = {};
  for (const city of Object.keys(groups)) {
    const g = groups[city];
    centroids[city] = { lat: g.latSum / g.count, lng: g.lngSum / g.count };
  }
  return centroids;
}

/**
 * Adapts a raw Wayfare Hotel object (free-text priceRange/ratingText/
 * amenities, per the CSV-driven schema) into the clean numeric shape the
 * AI Planner's contract requires. Returns null if price or rating can't be
 * parsed into a usable number - such a hotel is excluded rather than sent
 * with an invented number.
 */
function mapHotelToFeasibility(hotel, cityCentroids) {
  const id = getId(hotel);
  const name = getName(hotel);
  const pricePerNight = parseAveragePrice(hotel.priceRange);
  const rating = parseAverageRating(hotel.ratingText);

  if (!id || !name || pricePerNight === undefined || rating === undefined) {
    return null;
  }

  let latitude = hotel.latitude;
  let longitude = hotel.longitude;

  if ((latitude === null || latitude === undefined || longitude === null || longitude === undefined)) {
    const centroid = cityCentroids[hotel.city];
    if (!centroid) return null; // no coordinates and no city fallback available
    latitude = centroid.lat;
    longitude = centroid.lng;
  }

  const amenities = typeof hotel.amenities === 'string'
    ? hotel.amenities.split(',').map((a) => a.trim()).filter(Boolean)
    : Array.isArray(hotel.amenities) ? hotel.amenities : [];

  return { id, name, latitude, longitude, pricePerNight, rating, amenities };
}

export function mapDestinationToFeasibility(destination) {
  const id = getId(destination);
  const name = getName(destination);
  const latLng = getLatLng(destination);
  const visitDurationHours = getVisitDurationHours(destination);
  const city = getCity(destination);

  if (!name || !latLng || visitDurationHours === undefined) {
    return null;
  }

  return {
    id,
    name,
    latitude: latLng.lat,
    longitude: latLng.lng,
    visitDurationHours,
    city: city || null,
  };
}
/**
 * Validates trip-level inputs (days/hours). Returns an error message
 * string, or null if valid.
 */
export function validateTripInputs(numberOfDays, hoursPerDay) {
  const days = Number(numberOfDays);
  const hours = Number(hoursPerDay);

  if (!Number.isFinite(days) || days <= 0) {
    return 'Please enter a valid number of days.';
  }

  if (!Number.isFinite(hours) || hours <= 0) {
    return 'Please enter valid hours per day.';
  }

  return null;
}

/**
 * Builds the full payload from selected Wayfare destination objects
 * and trip inputs.
 *
 * Extra trip data is preserved for the AI Planner handoff.
 */
export function buildFeasibilityPayload(
  selectedDestinations,
  numberOfDays,
  hoursPerDay,
  options = {}
) {
  const mapped = selectedDestinations.map(mapDestinationToFeasibility);

  if (mapped.some((d) => d === null)) {
    throw new Error('One or more selected destinations are missing required data.');
  }

  const payload = {
    trip: {
      city: options.city || '',
      numberOfDays: Number(numberOfDays),
      hoursPerDay: Number(hoursPerDay),
    },
    destinations: mapped,
    hotels: options.hotels || [],
    preferences: options.preferences || {},
    // Curated transport cost dataset, embedded so the Feasibility Checker
    // (which has no backend of its own) can compute a budget estimate
    // without needing any new network dependency of its own.
    travelEstimates: options.travelEstimates || [],
  };

  // Budget is entirely optional - omit it and everything behaves exactly
  // as it did before this feature existed.
  if (options.totalBudget !== undefined && options.totalBudget !== null && options.totalBudget !== '') {
    payload.trip.totalBudget = Number(options.totalBudget);
  }

  return payload;
}

/**
 * URL-safe base64 encoding of the payload for the `data` query param.
 */
export function encodeFeasibilityPayload(payload) {
  const json = JSON.stringify(payload);
  const base64 = btoa(unescape(encodeURIComponent(json)));

  const urlSafe = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return encodeURIComponent(urlSafe);
}

/**
 * Redirects the browser to the deployed Feasibility Checker with the
 * encoded payload attached.
 */
export function redirectToFeasibilityChecker(payload) {
  const baseUrl =
    import.meta.env.VITE_FEASIBILITY_CHECKER_URL ||
    'https://trip-feasibility-checker.onrender.com';

  const encoded = encodeFeasibilityPayload(payload);

  window.location.href = `${baseUrl}/?data=${encoded}`;
}