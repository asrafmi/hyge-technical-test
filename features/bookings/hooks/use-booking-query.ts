import { useQuery } from '@tanstack/react-query';

import { getBookingById, getBookings } from '@/services/api/bookings';
import type { BookingsParam } from '@/services/api/types';

export function useBookingsQuery(params?: BookingsParam) {
  return useQuery({
    queryKey: ['bookings', params ?? {}],
    queryFn: () => getBookings(params),
  });
}

export function useBookingDetailQuery(bookingId: string) {
  return useQuery({
    queryKey: ['bookings', 'detail', bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: Boolean(bookingId),
  });
}
