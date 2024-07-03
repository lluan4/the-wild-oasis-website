'use server';

import { SubmitButton } from '@/_components';
import { updateBookingAction } from '@/_lib/actions';
import { getBooking, getCabin } from '@/services/data-service';
import { useFormStatus } from 'react-dom';

interface ReservationParams {
  reservationId: string;
}

export default async function Page({ params }: { params: ReservationParams }) {
  const { reservationId } = params;

  const { numGuests, observations, cabinId } = await getBooking(
    Number(reservationId)
  );

  const { maxCapacity } = await getCabin(Number(cabinId));

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{reservationId}
      </h2>

      <form
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
        action={updateBookingAction}
      >
        <input
          type="hidden"
          name="bookingId"
          defaultValue={params.reservationId}
        />
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
            defaultValue={String(numGuests)}
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>

          <textarea
            name="observations"
            defaultValue={String(observations)}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <SubmitButton>Update reservation</SubmitButton>
        </div>
      </form>
    </div>
  );
}