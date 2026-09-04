import { createHttpClient, type UnauthorizedHandler } from '@/services/api/http-client';
import { createHttpMethods } from '@/services/api/http';

const COURTLY_API_URL = process.env.EXPO_PUBLIC_COURTLY_API_URL;

if (!COURTLY_API_URL) {
  throw new Error('EXPO_PUBLIC_COURTLY_API_URL is not set. Check your .env file.');
}

let getToken: (() => string | null) | null = null;
let onUnauthorized: UnauthorizedHandler | null = null;

export function registerCourtlyAuthHandlers(config: {
  getToken: () => string | null;
  onUnauthorized: UnauthorizedHandler;
}): void {
  getToken = config.getToken;
  onUnauthorized = config.onUnauthorized;
}

const courtlyHttpClient = createHttpClient({
  baseURL: COURTLY_API_URL,
  getToken: () => getToken?.() ?? null,
  onUnauthorized: () => onUnauthorized?.(),
});

export const courtly = createHttpMethods(courtlyHttpClient);
