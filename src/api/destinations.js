import axiosClient from './axiosClient';

export function getAllDestinations() {
  return axiosClient.get('/destinations').then((res) => res.data);
}

export function getDestinationById(id) {
  return axiosClient.get(`/destinations/${id}`).then((res) => res.data);
}
