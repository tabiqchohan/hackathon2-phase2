import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/providers';
import Header from '@/components/navigation/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple todo application with authentication',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}