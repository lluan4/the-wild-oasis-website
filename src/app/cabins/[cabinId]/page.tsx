import { Cabin, Reservation, Spinner } from '@/_components';
import { getCabin, getCabins } from '@/services/data-service';
import { Suspense } from 'react';

interface CabinParams {
  cabinId: string;
}

export async function generateMetadata({ params }: { params: CabinParams }) {
  const cabin = await getCabin(Number(params.cabinId));
  const { name } = cabin;
  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  return cabins.map((cabin) => ({ cabinId: cabin.id.toString() }));
}

export default async function Page({ params }: { params: CabinParams }) {
  const cabin = await getCabin(Number(params.cabinId));

  // const settings = await getSettings();
  // const bookedDates = await getBookedDatesByCabinId(Number(params.cabinId));

  /*Jeito melhor do que fazer varias chamadas */
  // const [cabin, settings, bookedDates] = await Promise.all([
  //   getCabin(Number(params.cabinId)),
  //   getSettings(),
  //   getBookedDatesByCabinId(Number(params.cabinId)),
  // ]);

  return (
    <div className="w-full box-border max-w-full overflow-hidden min-w-[360px] mr-3">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="mb-10 text-accent-400 text-5xl font-semibold text-center">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
