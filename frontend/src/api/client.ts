import axios, { AxiosError, type AxiosInstance } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const TOKEN_KEY = 'ekart_token';
export const USER_KEY = 'ekart_user';

/**
 * Single Axios instance used by every API module. Attaches the JWT on each
 * request and normalises backend error strings into Error messages.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Backends return a plain-text message in the body on 400.
    const data = error.response?.data;
    const message =
      typeof data === 'string'
        ? data
        : (data as { message?: string } | undefined)?.message ??
          error.message ??
          'Something went wrong. Please try again.';

    // On 401 the token is invalid/expired — clear it so the user re-logs in.
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
