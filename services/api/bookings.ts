import { courtly } from '@/services/api/courtly-client';
import type { Booking, BookingsParam, CreateBookingPayload } from '@/services/api/types';

export function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  return courtly.post<Booking>('/v1/bookings', payload, { auth: true });
}

export function getBookings(params?: BookingsParam): Promise<Booking[]> {
  return courtly.get<Booking[]>('/v1/bookings', {
    query: { status: params?.status },
    auth: true,
  });
}

export function getBookingById(bookingId: string): Promise<Booking> {
  return courtly.get<Booking>(`/v1/bookings/${bookingId}`, { auth: true });
}

export function cancelBooking(bookingId: string): Promise<Booking> {
  return courtly.del<Booking>(`/v1/bookings/${bookingId}`, { auth: true });
}
