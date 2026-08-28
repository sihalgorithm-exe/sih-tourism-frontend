import axiosClient from './axiosClient';

export function getAllHotels() {
  return axiosClient.get('/hotels').then((res) => res.data);
}

export function getHotelById(id) {
  return axiosClient.get(`/hotels/${id}`).then((res) => res.data);
}
