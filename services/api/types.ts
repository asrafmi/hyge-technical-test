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

export interface FacilitiesResponse {
  data: Facility[]
}
export interface Facility {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  sports: string[],
  startingPrice: number,
  imageUrl: string;
}

export interface FacilityParam {
  search: string;
  sport: string;
  city: string;
}
