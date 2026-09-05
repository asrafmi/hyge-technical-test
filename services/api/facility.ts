import { courtly } from '@/services/api/courtly-client';
import type {
  AvailabilityResponse,
  CitiesResponse,
  FacilitiesResponse,
  FacilityDetail,
  FacilityParam,
  SportsResponse,
} from '@/services/api/types';

export function getAllFacilities(params?: FacilityParam): Promise<FacilitiesResponse> {
  return courtly.get<FacilitiesResponse>('/v1/facilities', {
    query: {
      search: params?.search,
      sport: params?.sport,
      city: params?.city,
      limit: params?.limit,
    },
  });
}

export function getFacilityById(facilityId: string): Promise<FacilityDetail> {
  return courtly.get<FacilityDetail>(`/v1/facilities/${facilityId}`);
}

export function getFacilityAvailability(facilityId: string, date: string): Promise<AvailabilityResponse> {
  return courtly.get<AvailabilityResponse>(`/v1/facilities/${facilityId}/availability`, {
    query: { date },
  });
}

export function getSports(): Promise<SportsResponse> {
  return courtly.get<SportsResponse>('/v1/sports');
}

export function getCities(): Promise<CitiesResponse> {
  return courtly.get<CitiesResponse>('/v1/cities');
}
