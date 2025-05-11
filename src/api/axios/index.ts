import axios, { AxiosError } from 'axios';

import { getNewAccessToken } from '../auth';

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

Axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest) {
      try {
        const token = await getNewAccessToken();
        if (token) {
          localStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return Axios(originalRequest);
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 403) {
          localStorage.removeItem('token');
          // localStorage.removeItem('refreshToken');
          if (!window.location.href.includes('/signin')) {
            window.location.replace('/signin');
          }
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default Axios;
