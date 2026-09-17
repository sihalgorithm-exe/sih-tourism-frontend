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

export function mapDestinationToFeasibility(destination) {
  const id = getId(destination);
  const name = getName(destination);
  const latLng = getLatLng(destination);
  const visitDurationHours = getVisitDurationHours(destination);

  if (!name || !latLng || visitDurationHours === undefined) {
    return null;
  }

  return {
    id,
    name,
    latitude: latLng.lat,
    longitude: latLng.lng,
    visitDurationHours,
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