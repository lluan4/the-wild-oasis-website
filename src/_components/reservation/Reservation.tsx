import React from 'react';
import { getBookedDatesByCabinId, getSettings } from '@/services/data-service';
import DateSelector from '../dateSelector/DateSelector';
import ReservationForm from '../reservationForm/ReservationForm';

import LoginMessage from '../loginMessage/LoginMessage';
import { auth } from '@/_lib/auth';

interface Cabin {
  created_at: string;
  description: string | null;
  discount: number;
  id: number;
  image: string | null;
  maxCapacity: number;
  name: string;
  regularPrice: number;
}

async function Reservation({ cabin }: { cabin: Cabin }) {
  /*O melhor jeito de fazer varias chamadas de api*/
  /*Gerar um compoentente separado*/
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  const session = await auth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border border-primary-800 min-h-[400px] min-w-[360px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} session={session} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Reservation;
