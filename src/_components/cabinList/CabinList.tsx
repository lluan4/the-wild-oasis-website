import { getCabins } from '@/services/data-service';
import CabinCard from '../cabinCard/CabinCard';
import { unstable_noStore } from 'next/cache';

type Cabin = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string | null;
};

async function CabinList({ filter }: { filter: string }) {
  unstable_noStore();

  const cabins = await getCabins();

  if (!cabins) throw new Error('No cabins found');

  let displayedCabins: Cabin[];
  switch (filter) {
    case 'small':
      displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
      break;
    case 'medium':
      displayedCabins = cabins.filter(
        (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
      );
      break;
    case 'large':
      displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);
      break;
    default:
      displayedCabins = cabins;
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
