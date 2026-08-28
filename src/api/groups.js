import axiosClient from './axiosClient';

/**
 * @param {{ name: string, radiusMeters: number }} payload
 */
export function createGroup(payload) {
  return axiosClient.post('/groups', payload).then((res) => res.data);
}

/**
 * Only the group leader can call this successfully (backend-enforced).
 * @param {number|string} groupId
 * @param {number} userId - id of the existing user to add
 */
export function addGroupMember(groupId, userId) {
  return axiosClient
    .post(`/groups/${groupId}/members`, { userId })
    .then((res) => res.data);
}

export function getGroup(groupId) {
  return axiosClient.get(`/groups/${groupId}`).then((res) => res.data);
}

/**
 * Submits the authenticated user's current location within a group.
 * @param {number|string} groupId
 * @param {{ latitude: number, longitude: number }} payload
 */
export function submitGroupLocation(groupId, payload) {
  return axiosClient
    .post(`/groups/${groupId}/locations`, payload)
    .then((res) => res.data);
}

/**
 * Only the group leader can access this feed (backend-enforced).
 * @param {number|string} groupId
 */
export function getGroupAlerts(groupId) {
  return axiosClient.get(`/groups/${groupId}/alerts`).then((res) => res.data);
}
