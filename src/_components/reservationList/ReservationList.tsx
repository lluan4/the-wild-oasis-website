'use client';

import { useOptimistic } from 'react';
import ReservationCard from '../reservationCard/ReservationCard';
import { deleteReservation } from '@/_lib/actions';

interface ReservationListProps {
  id: number;
  created_at: string;
  startDate: string | null;
  endDate: string | null;
  numNights: number | null;
  numGuests: number | null;
  totalPrice: number | null;
  guestId: number | null;
  cabinId: number | null;
  status: string | null;
  cabins: {
    name: string | null;
    image: string | null;
  } | null;
}
function ReservationList({ bookings }: { bookings: ReservationListProps[] }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }
  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
