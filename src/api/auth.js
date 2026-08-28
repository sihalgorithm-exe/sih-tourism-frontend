import axiosClient from './axiosClient';

/**
 * @param {{ name: string, email: string, password: string }} payload
 * @returns {Promise<{ token: string, userId: number, name: string, email: string, role: string }>}
 */
export function register(payload) {
  return axiosClient.post('/auth/register', payload).then((res) => res.data);
}

/**
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ token: string, userId: number, name: string, email: string, role: string }>}
 */
export function login(payload) {
  return axiosClient.post('/auth/login', payload).then((res) => res.data);
}
