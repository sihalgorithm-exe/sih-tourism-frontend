import axiosClient from './axiosClient';

export function getAllTravelEstimates() {
  return axiosClient.get('/travel-estimates').then((res) => res.data);
}