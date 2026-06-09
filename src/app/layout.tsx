import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from './StoreProvider';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import AuthProvider from '../components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wanderlust | Travel Packages',
  description: 'Book your next amazing travel experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
