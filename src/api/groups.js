import axiosClient from './axiosClient';

export function createGroup(payload) {
  return axiosClient
    .post('/groups', payload)
    .then((res) => res.data);
}

export function joinGroup(groupId) {
  return axiosClient
    .post(`/groups/${groupId}/join`)
    .then((res) => res.data);
}

export function getGroup(groupId) {
  return axiosClient
    .get(`/groups/${groupId}`)
    .then((res) => res.data);
}

export function getGroupMembers(groupId) {
  return axiosClient
    .get(`/groups/${groupId}/members`)
    .then((res) => res.data);
}

export function getMyGroups() {
  return axiosClient
    .get('/groups/my')
    .then((res) => res.data);
}

export function submitGroupLocation(groupId, payload) {
  return axiosClient
    .post(`/groups/${groupId}/locations`, payload)
    .then((res) => res.data);
}

export function getGroupAlerts(groupId) {
  return axiosClient
    .get(`/groups/${groupId}/alerts`)
    .then((res) => res.data);
}