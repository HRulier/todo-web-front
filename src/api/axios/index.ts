import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

import { getNewAccessToken } from '../auth';

const AxiosWithInterceptors = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Token refresh queue management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

AxiosWithInterceptors.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request and wait for token refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (token) {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              return Axios(originalRequest);
            }
            return Promise.reject(error);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = await getNewAccessToken();
        if (token) {
          localStorage.setItem('token', token);
          processQueue(null, token);
          originalRequest.headers!.Authorization = `Bearer ${token}`;
          return Axios(originalRequest);
        } else {
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.log('refreshError', refreshError);

        if (
          refreshError instanceof AxiosError &&
          (refreshError.response?.status === 403 || refreshError.response?.status === 400)
        ) {
          localStorage.removeItem('token');
          // localStorage.removeItem('refreshToken');
          if (!window.location.href.includes('/signin')) {
            window.location.replace('/signin');
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { Axios, AxiosWithInterceptors };
