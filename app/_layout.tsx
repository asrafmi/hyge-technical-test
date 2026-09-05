import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { registerCourtlyAuthHandlers } from '@/services/api/courtly-client';
import { queryClient } from '@/shared/lib/query-client';
import { getStoredToken, useAuthStore } from '@/store/auth-store';
import { useOnboardingStore } from '@/store/onboarding-store';

SplashScreen.preventAutoHideAsync().catch(() => {});

registerCourtlyAuthHandlers({
  getToken: getStoredToken,
  onUnauthorized: () => {
    void useAuthStore.getState().signOut();
  },
});

export default function RootLayout() {
  const authStatus = useAuthStore((state) => state.status);
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const onboardingStatus = useOnboardingStore((state) => state.status);
  const hydrateOnboarding = useOnboardingStore((state) => state.hydrate);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    hydrateAuth();
    hydrateOnboarding();
  }, [hydrateAuth, hydrateOnboarding]);

  const ready = authStatus !== 'checking' && onboardingStatus !== 'checking' && fontsLoaded;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  const needsOnboarding = onboardingStatus === 'pending' && authStatus === 'signedOut';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Protected guard={needsOnboarding}>
              <Stack.Screen name="onboarding" />
            </Stack.Protected>
            <Stack.Protected guard={authStatus === 'signedIn'}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>
            <Stack.Protected guard={authStatus === 'signedOut' && !needsOnboarding}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>
            <Stack.Screen name="+not-found" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
