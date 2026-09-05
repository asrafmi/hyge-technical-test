export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  sports: string[];
  startingPrice: number;
  imageUrl: string;
}

export interface FacilitiesResponse {
  data: Facility[];
  pagination: PaginationMeta;
}

export interface FacilityParam {
  search?: string;
  sport?: string;
  city?: string;
  limit?: number;
}

export interface SportOption {
  id: string;
  name: string;
  slug: string;
}

export interface SportsResponse {
  data: SportOption[];
}

export interface CitiesResponse {
  data: string[];
}
