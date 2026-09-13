import axiosClient from './axiosClient';

export function getMyProfile() {
  return axiosClient.get('/users/me').then((res) => res.data);
}

export function updateMyProfile(payload) {
  return axiosClient.put('/users/me', payload).then((res) => res.data);
}