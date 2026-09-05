import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBooking } from '@/services/api/bookings';
import { getErrorMessage } from '@/shared/utils/error';
import type { CreateBookingPayload } from '@/services/api/types';

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

export interface CreateBookingsBatchResult {
  succeeded: CreateBookingPayload[];
  failed: { slot: CreateBookingPayload; message: string }[];
}

interface CreateBookingsBatchInput {
  facilityId: string;
  payloads: CreateBookingPayload[];
}

export function useCreateBookingsBatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payloads }: CreateBookingsBatchInput): Promise<CreateBookingsBatchResult> => {
      const succeeded: CreateBookingPayload[] = [];
      const failed: { slot: CreateBookingPayload; message: string }[] = [];

      for (const payload of payloads) {
        try {
          await createBooking(payload);
          succeeded.push(payload);
        } catch (error) {
          failed.push({ slot: payload, message: getErrorMessage(error) });
        }
      }

      return { succeeded, failed };
    },
    onSuccess: (_result, { facilityId }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['facilities', facilityId, 'availability'] });
    },
  });
}
