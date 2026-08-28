import axiosClient from './axiosClient';

/**
 * Returns the authenticated user's preferences, or a falsy/empty value if
 * none have been configured yet (per API.md). We don't fabricate a default
 * object here — the UI treats an empty response as "not set up yet".
 */
export function getMyPreferences() {
  return axiosClient.get('/preferences').then((res) => res.data);
}

/**
 * Upsert: creates preferences if none exist, otherwise updates them.
 * @param {{ interests?: string, budgetLevel?: string, preferredCategory?: string }} payload
 */
export function updateMyPreferences(payload) {
  return axiosClient.put('/preferences', payload).then((res) => res.data);
}
