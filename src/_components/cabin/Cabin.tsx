import Image from 'next/image';
import TextExpander from '../textExpander/TextExpander';
import { EyeSlashIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/solid';

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

async function Cabin({ cabin }: { cabin: Cabin }) {
  const { name, maxCapacity, image, description } = cabin;
  return (
    <div className="grid grid-cols-1 md:grid-cols-[3fr_4fr] gap-10 md:gap-20 border border-primary-800 py-3 px-6 sm:px-10 mb-24">
      <div className="relative md:scale-[1.15] md:-translate-x-3 h-[300px] md:h-auto">
        <Image
          src={image ?? ''}
          fill
          className="object-cover"
          alt={`Cabin ${name}`}
        />
      </div>

      <div>
        <h3 className="text-accent-100 font-black text-4xl md:text-7xl mb-5 bg-primary-950 p-4 md:p-6 md:pb-1 md:translate-x-[-254px] md:w-[150%]">
          Cabin {name}
        </h3>

        <p className="text-lg text-primary-300 mb-10">
          <TextExpander>{description ?? ''}</TextExpander>
        </p>

        <ul className="flex flex-col gap-4 mb-7">
          <li className="flex gap-3 items-center">
            <UsersIcon className="h-5 w-5 text-primary-600" />
            <span className="text-lg">
              For up to <span className="font-bold">{maxCapacity}</span> guests
            </span>
          </li>
          <li className="flex gap-3 items-center">
            <MapPinIcon className="h-5 w-5 text-primary-600" />
            <span className="text-lg">
              Located in the heart of the{' '}
              <span className="font-bold">Dolomites</span> (Italy)
            </span>
          </li>
          <li className="flex gap-3 items-center">
            <EyeSlashIcon className="h-5 w-5 text-primary-600" />
            <span className="text-lg">
              Privacy <span className="font-bold">100%</span> guaranteed
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Cabin;
