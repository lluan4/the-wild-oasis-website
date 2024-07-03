'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  function handleFilter(filter: string) {
    params.set('capacity', filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filterName = params.get('capacity');

  return (
    <div className=" border border-primary-800 flex">
      <button
        className={`px-5 py-2 hover:bg-primary-700 ${filterName === 'all' && 'bg-primary-700 text-white'}`}
        onClick={() => handleFilter('all')}
      >
        All cabins
      </button>
      <button
        className={`px-5 py-2 hover:bg-primary-700 ${filterName === 'small' && 'bg-primary-700 text-white'}`}
        onClick={() => handleFilter('small')}
      >
        1&mdash;3 guests
      </button>
      <button
        className={`px-5 py-2 hover:bg-primary-700 ${filterName === 'medium' && 'bg-primary-700 text-white'}`}
        onClick={() => handleFilter('medium')}
      >
        4&mdash;7 guests
      </button>
      <button
        className={`px-5 py-2 hover:bg-primary-700 ${filterName === 'large' && 'bg-primary-700 text-white'}`}
        onClick={() => handleFilter('large')}
      >
        8&mdash;12 guests
      </button>
    </div>
  );
}

export default Filter;
