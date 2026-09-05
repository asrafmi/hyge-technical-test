import { useQuery } from '@tanstack/react-query';

import {
  getAllFacilities,
  getCities,
  getFacilityAvailability,
  getFacilityById,
  getSports,
} from '@/services/api/facility';
import type { FacilityParam } from '@/services/api/types';

export function useFacilitiesQuery(params?: FacilityParam) {
  return useQuery({
    queryKey: ['facilities', params ?? {}],
    queryFn: () => getAllFacilities(params),
  });
}

export function useAllFacilitiesQuery() {
  return useQuery({
    queryKey: ['facilities', 'all'],
    queryFn: () => getAllFacilities({ limit: 50 }),
    staleTime: 60_000,
  });
}

export function useSportsQuery() {
  return useQuery({
    queryKey: ['sports'],
    queryFn: getSports,
    staleTime: 5 * 60_000,
  });
}

export function useCitiesQuery() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
    staleTime: 5 * 60_000,
  });
}

export function useFacilityDetailQuery(facilityId: string) {
  return useQuery({
    queryKey: ['facilities', facilityId],
    queryFn: () => getFacilityById(facilityId),
    enabled: Boolean(facilityId),
  });
}

export function useFacilityAvailabilityQuery(facilityId: string, date: string) {
  return useQuery({
    queryKey: ['facilities', facilityId, 'availability', date],
    queryFn: () => getFacilityAvailability(facilityId, date),
    enabled: Boolean(facilityId) && Boolean(date),
  });
}
