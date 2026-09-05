import { useQuery } from '@tanstack/react-query';

import { getAllFacilities } from '@/services/api/facility';
import { FacilityParam } from '@/services/api/types';

export function useFacilitiesQuery(query: FacilityParam | null) {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const response = await getAllFacilities(query)

      return response.data
    }
  });
}
