import { getId, getName, getLatLng, getVisitDurationHours } from './fields.js';

/**
 * Maps a single Wayfare destination object to the exact shape the
 * Feasibility Checker contract requires. Returns null if any required
 * field is missing, so the caller can validate before redirecting.
 */
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

  return {
    trip: {
      city: options.city || '',
      numberOfDays: Number(numberOfDays),
      hoursPerDay: Number(hoursPerDay),
    },
    destinations: mapped,
    hotels: options.hotels || [],
    preferences: options.preferences || {},
  };
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