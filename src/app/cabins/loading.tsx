import { Spinner } from '@/_components';

export default function Loading() {
  return (
    <div className="grid items-center justify-center">
      <Spinner />
      <p className="text-center text-xl text-primary-200">
        Loading Cabin data...
      </p>
    </div>
  );
}
