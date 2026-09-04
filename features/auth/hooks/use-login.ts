import { useMutation } from '@tanstack/react-query';

import { login } from '@/services/api/auth';
import { useAuthStore } from '@/store/auth-store';

export function useLogin() {
  const signIn = useAuthStore((state) => state.signIn);

  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await signIn(data.accessToken, data.user);
    },
  });
}
