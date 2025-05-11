import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signIn, logout, getUserProfile } from '~/api/auth';

import type { IUser } from '~/types/users';

const useSignIn = () =>
  useMutation<
    any,
    unknown,
    {
      email: string;
      password: string;
    },
    unknown
  >({
    mutationFn: ({ email, password }) => signIn(email, password),
  });

const useUserProfile = () =>
  useQuery({
    queryKey: ['user-profile'],
    queryFn: async (): Promise<IUser | null> => getUserProfile(),
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

export { useSignIn, useLogout, useUserProfile, signIn };
