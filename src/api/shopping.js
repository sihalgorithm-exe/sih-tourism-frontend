import axiosClient from './axiosClient';

export function getAllShoppingPlaces() {
  return axiosClient.get('/shopping').then((res) => res.data);
}

export function getShoppingPlaceById(id) {
  return axiosClient.get(`/shopping/${id}`).then((res) => res.data);
}
