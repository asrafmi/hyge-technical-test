import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBooking } from '@/services/api/bookings';

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({
        queryKey: ['facilities', booking.facility.id, 'availability'],
      });
    },
  });
}
