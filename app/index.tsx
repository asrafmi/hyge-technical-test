import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function Index() {
  const authStatus = useAuthStore((state) => state.status);
  const onboardingStatus = useOnboardingStore((state) => state.status);

  if (authStatus === 'signedIn') {
    return <Redirect href="/(app)/(tabs)/home" />;
  }

  if (onboardingStatus === 'pending') {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(auth)/login" />;
}
