import type { AxiosResponse } from 'axios';
import { Axios, AxiosWithInterceptors } from '../axios';

import type { IUser } from '~/types/users';

const signIn = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
  const response = await Axios.post(
    `${import.meta.env.VITE_API_URL}/auth/login`,
    {
      email,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

const signUp = async (
  data: Partial<IUser> & { password: string }
): Promise<{ user: IUser; token: string }> => {
  const response = await Axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

const forgotPassword = async (email: string): Promise<AxiosResponse<{ message: string }>> => {
  const response = await Axios.post(
    `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
    {
      email,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

const resendVerificationEmail = async (
  email: string
): Promise<AxiosResponse<{ message: string }>> => {
  const response = await Axios.post(
    `${import.meta.env.VITE_API_URL}/auth/resend-verification-email`,
    {
      email,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

const resetPassword = async (
  password: string,
  token: string
): Promise<AxiosResponse<{ message: string }>> => {
  const response = await Axios.post(
    `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
    {
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

const getUserProfile = async (): Promise<IUser | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const response = await AxiosWithInterceptors.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response?.data.user || null;
};

const getNewAccessToken = async (): Promise<string | null> => {
  //! We use axios and not the instance with the interceptor that we've created
  const response = await Axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );

  return response.data.token;
};

const logout = async (): Promise<{ message: string } | null> => {
  const response = await Axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    withCredentials: true,
  });

  return response.data;
};

export {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  logout,
  getUserProfile,
  getNewAccessToken,
  resendVerificationEmail,
};
