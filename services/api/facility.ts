import { courtly } from '@/services/api/courtly-client';
import type { FacilityParam, FacilitiesResponse } from '@/services/api/types';

export function getAllFacilities(query?: FacilityParam | null): Promise<FacilitiesResponse> {
  return courtly.get<FacilitiesResponse>('/v1/facilities', {
    query: {
      search: query?.search,
      sport: query?.sport,
      city: query?.city,
    }
  });
}
