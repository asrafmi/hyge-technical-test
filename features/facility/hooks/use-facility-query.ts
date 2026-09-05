import { useQuery } from '@tanstack/react-query';

import { getAllFacilities, getCities, getSports } from '@/services/api/facility';
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
