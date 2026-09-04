import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { registerCourtlyAuthHandlers } from '@/services/api/courtly-client';
import { queryClient } from '@/shared/lib/query-client';
import { getStoredToken, useAuthStore } from '@/store/auth-store';

SplashScreen.preventAutoHideAsync().catch(() => {});

registerCourtlyAuthHandlers({
  getToken: getStoredToken,
  onUnauthorized: () => {
    void useAuthStore.getState().signOut();
  },
});

export default function RootLayout() {
  const status = useAuthStore((state) => state.status);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (status !== 'checking') {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [status]);

  if (status === 'checking') {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Protected guard={status === 'signedIn'}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>
            <Stack.Protected guard={status === 'signedOut'}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>
            <Stack.Screen name="+not-found" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
