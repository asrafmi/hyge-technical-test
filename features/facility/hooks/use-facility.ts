import { useState } from 'react';
import { FacilityParam } from '@/services/api/types';
import { useFacilitiesQuery } from './use-facility-query';

export function useFacility() {
  const [params, setParams] = useState<FacilityParam | null>(null)
  const { data, isLoading, isError } = useFacilitiesQuery(params)


  return {
    facilities: data,
    isLoadingFacilities: isLoading,
    isErrorFacilities: isError,
    params,
    setParams,
  }
}
