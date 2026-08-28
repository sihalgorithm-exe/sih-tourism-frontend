import axiosClient from './axiosClient';

export function getAllTransportOptions() {
  return axiosClient.get('/transport').then((res) => res.data);
}

export function getTransportOptionById(id) {
  return axiosClient.get(`/transport/${id}`).then((res) => res.data);
}
