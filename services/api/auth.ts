import { apiRequest } from '@/services/api/client';
import type { LoginPayload, LoginResponse, RegisterPayload } from '@/services/api/types';

export function register(payload: RegisterPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/v1/auth/register', { method: 'POST', body: payload });
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/v1/auth/login', { method: 'POST', body: payload });
}
