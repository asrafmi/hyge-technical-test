import { courtly } from '@/services/api/courtly-client';
import type {
  CitiesResponse,
  FacilitiesResponse,
  FacilityParam,
  SportsResponse,
} from '@/services/api/types';

export function getAllFacilities(params?: FacilityParam): Promise<FacilitiesResponse> {
  return courtly.get<FacilitiesResponse>('/v1/facilities', {
    query: {
      search: params?.search,
      sport: params?.sport,
      city: params?.city,
    },
  });
}

export function getSports(): Promise<SportsResponse> {
  return courtly.get<SportsResponse>('/v1/sports');
}

export function getCities(): Promise<CitiesResponse> {
  return courtly.get<CitiesResponse>('/v1/cities');
}
