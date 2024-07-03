'use server';
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
  updateGuest,
} from '@/services/data-service';
import { auth, signIn, signOut } from './auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface BookingData {
  startDate: Date | undefined;
  endDate: Date | undefined;
  numNights: number;
  cabinPrice: number;
  cabinId: number;
}

export async function createBookingAction(
  bookingData: BookingData,
  formData: FormData
) {
  const session = await auth();
  if (!session) throw new Error('Not authenticated');

  const newBooking = {
    ...bookingData,
    guestId: Number(session.user?.id),
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations')?.slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed',
  };
  await createBooking(newBooking);
  revalidatePath('/cabins/[cabinId]');

  redirect('/cabins/thankyou');
}

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Not authenticated');

  const nationalID = formData.get('nationalID') as string;

  const [nationality, countryFlag] = (
    formData.get('nationality') as string
  ).split('%');

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error('Invalid national ID');

  const updateData = { nationality, countryFlag, nationalID };
  updateGuest(Number(session.user?.id), updateData);
  revalidatePath('/account/profile');
}

export async function updateBookingAction(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Not authenticated');

  const guestBookings = await getBookings(Number(session.user?.id));
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(Number(formData.get('bookingId'))))
    throw new Error('Unauthorized');

  const numGuests = Number(formData.get('numGuests'));
  const observations = formData.get('observations')?.slice(0, 1000) as string;
  const id = Number(formData.get('bookingId'));

  const updateData = { numGuests, observations };

  updateBooking(id, updateData);
  revalidatePath('/account/reservations/[reservationId]');
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}
export async function deleteReservation(bookingId: number) {
  const session = await auth();
  if (!session) throw new Error('Not authenticated');

  deleteBooking(bookingId);
  revalidatePath('/account/reservations');
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
