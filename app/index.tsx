import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';

export default function Index() {
  const status = useAuthStore((state) => state.status);

  if (status === 'signedIn') {
    return <Redirect href="/(app)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
