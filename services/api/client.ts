import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'https://courtly-api.hyge.web.id';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface RawErrorBody {
  statusCode?: number;
  code?: string;
  message?: string | string[];
  path?: string;
  timestamp?: string;
}

function extractErrorMessage(body: RawErrorBody | undefined, fallback: string): string {
  if (!body?.message) return fallback;
  if (Array.isArray(body.message)) return body.message.join(', ');
  return body.message;
}

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;
let getToken: (() => string | null) | null = null;

export function registerAuthHandlers(config: {
  getToken: () => string | null;
  onUnauthorized: UnauthorizedHandler;
}): void {
  getToken = config.getToken;
  onUnauthorized = config.onUnauthorized;
}

interface AuthRequestConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean;
}

const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

httpClient.interceptors.request.use((config: AuthRequestConfig) => {
  if (config.requiresAuth) {
    const token = getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<RawErrorBody>) => {
    const authRequested = (error.config as AuthRequestConfig | undefined)?.requiresAuth;

    if (!error.response) {
      return Promise.reject(new ApiError('Network request failed. Check your connection and try again.', 0));
    }

    const { status, data } = error.response;

    if (status === 401 && authRequested) {
      onUnauthorized?.();
    }

    return Promise.reject(
      new ApiError(extractErrorMessage(data, `Request failed with status ${status}`), status, data?.code),
    );
  },
);

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  auth?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, auth = false } = options;

  const response = await httpClient.request<T>({
    url: path,
    method,
    data: body,
    params: query,
    requiresAuth: auth,
  } as AuthRequestConfig);

  return response.data;
}
