import { getBookedDatesByCabinId, getCabin } from '@/services/data-service';

import { NextRequest } from 'next/server';

const headers = {
  'Content-Type': 'application/json',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const cabinId = Number(params.cabinId);

  try {
    if (!cabinId) {
      return new Response(JSON.stringify({ message: 'Cabin ID is required' }), {
        status: 400,
        headers,
      });
    }

    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);

    if (!cabin || !bookedDates) {
      return new Response(JSON.stringify({ message: 'Cabin not found' }), {
        status: 400,
        headers,
      });
    }

    return new Response(JSON.stringify({ cabin, bookedDates }), {
      status: 200,
      headers,
    });
  } catch (error) {
    const typedError = error as Error;
    return new Response(
      JSON.stringify({ message: typedError.message || 'An error occurred' }),
      {
        status: 500,
        headers,
      }
    );
  }
}

// export async function POST() {

// }
