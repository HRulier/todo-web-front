import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { IUser, UserProfile } from '~/types/users';
import {
  signIn,
  signUp,
  logout,
  getUserProfile,
  resetPassword,
  resendVerificationEmail,
  forgotPassword,
  updateUserProfile,
} from '~/api/auth';

const useSignIn = () =>
  useMutation<
    any,
    AxiosError,
    {
      email: string;
      password: string;
    },
    unknown
  >({
    mutationFn: ({ email, password }) => signIn(email, password),
  });

const useSignUp = () =>
  useMutation<any, AxiosError, Partial<IUser> & { password: string }, unknown>({
    mutationFn: data => signUp(data),
  });

const useUserProfile = (options?: { enabled: boolean }) =>
  useQuery({
    queryKey: ['user-profile'],
    queryFn: async (): Promise<IUser | null> => getUserProfile(),
    enabled: options?.enabled || true,
  });

const useUpdateUserProfile = () =>
  useMutation<any, AxiosError, UserProfile, unknown>({
    mutationFn: data => updateUserProfile(data),
  });

const useResendValidationEmail = () =>
  useMutation<any, unknown, string, unknown>({
    mutationFn: email => resendVerificationEmail(email),
  });

const useResetPassword = () =>
  useMutation<any, unknown, { password: string; token: string }, unknown>({
    mutationFn: ({ password, token }) => resetPassword(password, token),
  });

const useForgotPassword = () =>
  useMutation<any, unknown, string, unknown>({
    mutationFn: email => forgotPassword(email),
  });

const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: async data => {
      console.log(data);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(['user-profile'], null);
    },
  });
};

export {
  useSignIn,
  useSignUp,
  useLogout,
  useUserProfile,
  useUpdateUserProfile,
  useResetPassword,
  useForgotPassword,
  useResendValidationEmail,
};
