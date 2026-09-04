import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import type { AuthUser } from '@/services/api/types';

const TOKEN_KEY = 'courtly_access_token';
const USER_KEY = 'courtly_user';

type AuthStatus = 'checking' | 'signedIn' | 'signedOut';

interface AuthState {
  status: AuthStatus;
  token: string | null;
  user: AuthUser | null;
  hydrate: () => Promise<void>;
  signIn: (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'checking',
  token: null,
  user: null,

  hydrate: async () => {
    const [token, userJson] = await Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(USER_KEY),
    ]);

    if (token && userJson) {
      set({ status: 'signedIn', token, user: JSON.parse(userJson) as AuthUser });
    } else {
      set({ status: 'signedOut', token: null, user: null });
    }
  },

  signIn: async (token, user) => {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, token),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
    ]);
    set({ status: 'signedIn', token, user });
  },

  signOut: async () => {
    await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(USER_KEY)]);
    set({ status: 'signedOut', token: null, user: null });
  },
}));

export function getStoredToken(): string | null {
  return useAuthStore.getState().token;
}
