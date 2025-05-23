import { Josefin_Sans } from 'next/font/google';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
});

import '@/_styles/globals.css';
import { Header } from '@/_components';
import { ReservationProvider } from '@/context/reservationContext/ReservationContext';

export const metadata = {
  title: {
    template: '%s / The Wild Oasis',
    default: 'Welcome / The Wild Oasis',
  },
  description: 'Cabins hotel, loacted in the the heart of the forest.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} bg-primary-950 text-primary-100 min-h-screen flex flex-col antialiased`}
      >
        <Header />

        <main className="flex-1 px-8 py-12 grid w-full min-w-[425px]">
          <ReservationProvider>{children}</ReservationProvider>
        </main>
      </body>
    </html>
  );
}
