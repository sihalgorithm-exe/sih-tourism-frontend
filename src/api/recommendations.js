import axiosClient from './axiosClient';

/**
 * Returns personalized destinations for the authenticated user (identity
 * comes from the JWT — no user id is ever sent from the client).
 */
export function getMyRecommendations() {
  return axiosClient.get('/recommendations').then((res) => res.data);
}
