import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const ONBOARDING_KEY = 'courtly_onboarding_seen';

type OnboardingStatus = 'checking' | 'pending' | 'completed';

interface OnboardingState {
  status: OnboardingStatus;
  hydrate: () => Promise<void>;
  complete: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  status: 'checking',

  hydrate: async () => {
    const seen = await SecureStore.getItemAsync(ONBOARDING_KEY);
    set({ status: seen === 'true' ? 'completed' : 'pending' });
  },

  complete: async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    set({ status: 'completed' });
  },
}));
