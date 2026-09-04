import { useMutation } from '@tanstack/react-query';

import { register } from '@/services/api/auth';
import { useAuthStore } from '@/store/auth-store';

export function useRegister() {
  const signIn = useAuthStore((state) => state.signIn);

  return useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      await signIn(data.accessToken, data.user);
    },
  });
}
