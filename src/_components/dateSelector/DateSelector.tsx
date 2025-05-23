'use client';

import { useReservation } from '@/context/reservationContext/ReservationContext';
import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from 'date-fns';

import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

function isAlreadyBooked(range: DateRange | undefined, datesArr: Date[]) {
  return (
    range?.from &&
    range?.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from ?? '', end: range.to ?? '' })
    )
  );
}

type Cabin = {
  created_at: string;
  description: string | null;
  discount: number;
  id: number;
  image: string | null;
  maxCapacity: number;
  name: string;
  regularPrice: number;
};

type Settings = {
  breakfastPrice: number | null;
  created_at: string;
  id: number;
  maxBookingLenght: number | null;
  maxGuestsPerBooking: number | null;
  minBookingLenght: number | null;
};

function DateSelector({
  bookedDates,
  cabin,
}: {
  settings: Settings;
  bookedDates: Date[];
  cabin: Cabin;
}) {
  const { range, setRange, resetRange } = useReservation();

  const displayRange =
    range && (isAlreadyBooked(range, bookedDates) ? ({} as DateRange) : range);

  const { regularPrice, discount } = cabin;
  const numNights =
    range?.to && range?.from
      ? differenceInDays(displayRange?.to ?? '', displayRange?.from ?? '')
      : 0;
  const cabinPrice = (numNights * (regularPrice - discount)).toFixed(2);

  // SETTINGS
  const minBookingLength = 5;
  const maxBookingLength = 23;

  return (
    <div className="flex flex-col justify-between  gap-y-6 md:gap-0">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={setRange}
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        classNames={{
          months: 'grid grid-cols-1 sm:grid-cols-2 gap-4 justify-start',
          month: 'w-full text-left',
        }}
        numberOfMonths={2}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{' '}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
