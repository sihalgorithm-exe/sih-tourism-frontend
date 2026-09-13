import axiosClient from './axiosClient';

export function getAllDestinations() {
  return axiosClient.get('/destinations').then((res) => res.data);
}

export function getDestinationById(id) {
  return axiosClient.get(`/destinations/${id}`).then((res) => res.data);
}

export function getStates() {
  return axiosClient.get('/destinations/states').then((res) => res.data);
}

export function getCitiesByState(state) {
  return axiosClient
    .get('/destinations/cities', { params: { state } })
    .then((res) => res.data);
}
