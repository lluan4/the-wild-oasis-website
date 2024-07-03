import { auth } from '@/_lib/auth';
import { supabase } from '@/_lib/supabaseClient';
import { eachDayOfInterval } from 'date-fns';
import { notFound } from 'next/navigation';

/////////////
// GET

export async function getCabin(id: number) {
  const { data, error } = await supabase
    .from('cabins')
    .select('*')
    .eq('id', id);

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    console.error(`Error fetching cabin with id ${id}:`, error);
    notFound();
  }

  return data[0];
}

export async function getCabinPrice(id: number) {
  const { data, error } = await supabase
    .from('cabins')
    .select('regularPrice, discount')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from('cabins')
    .select('id, name, maxCapacity, regularPrice, discount, image')
    .order('name');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string | null | undefined) {
  const { data } = await supabase
    .from('guests')
    .select('*')
    .eq('email', email ?? '')
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id: number) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not get loaded');
  }

  return data[0];
}

export async function getBookings(guestId: number) {
  const { data, error } = await supabase
    .from('bookings')
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, status, cabins(name, image)'
    )
    .eq('guestId', guestId)
    .order('startDate');

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId: number) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayString = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('cabinId', cabinId)
    .or(`startDate.gte.${todayString},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      if (!booking.startDate || !booking.endDate)
        throw new Error('Booking does not have a start or end date');

      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*').single();

  if (error) {
    console.error(error);
    throw new Error('Settings could not be loaded');
  }

  return data;
}

interface IFetchCountries {
  name: string;
  flag: string;
  independent: boolean;
}

export async function getCountries(): Promise<IFetchCountries[]> {
  try {
    const res = await fetch(
      'https://restcountries.com/v2/all?fields=name,flag'
    );
    const countries: IFetchCountries[] = await res.json();
    return countries;
  } catch {
    throw new Error('Could not fetch countries');
  }
}

/////////////
// CREATE

export interface Guest {
  //TODO: Define the Guest type
}

export async function createGuest(newGuest: Guest) {
  const { data, error } = await supabase.from('guests').insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error('Guest could not be created');
  }

  return data;
}

export interface Booking {
  //TODO: Define the Guest type
}

export async function createBooking(newBooking: Booking) {
  const { error } = await supabase.from('bookings').insert([newBooking]);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be created');
  }
}

/////////////
// UPDATE

interface UpdateGuest {
  nationality?: string;
  countryFlag?: string;
  nationalID?: string;
}

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id: number, updatedFields: UpdateGuest) {
  const { data, error } = await supabase
    .from('guests')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Guest could not be updated');
  }
  return data;
}

interface UpdateBooking {}

export async function updateBooking(id: number, updatedFields: UpdateBooking) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id: number) {
  const session = await auth();
  if (!session) throw new Error('Not authenticated');

  const guestBooking = await getBookings(Number(session.user!.id));
  const guestBookingId = guestBooking.map((booking) => booking.id);

  if (!guestBookingId.includes(id))
    throw new Error('Booking does not belong to the user');

  const { data, error } = await supabase.from('bookings').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  return data;
}
