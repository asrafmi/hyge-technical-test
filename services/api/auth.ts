import { courtly } from '@/services/api/courtly-client';
import type { LoginPayload, LoginResponse, RegisterPayload } from '@/services/api/types';

export function register(payload: RegisterPayload): Promise<LoginResponse> {
  return courtly.post<LoginResponse>('/v1/auth/register', payload);
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return courtly.post<LoginResponse>('/v1/auth/login', payload);
}
