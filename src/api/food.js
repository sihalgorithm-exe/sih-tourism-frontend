import axiosClient from './axiosClient';

export function getAllFoodPlaces() {
  return axiosClient.get('/food').then((res) => res.data);
}

export function getFoodPlaceById(id) {
  return axiosClient.get(`/food/${id}`).then((res) => res.data);
}
