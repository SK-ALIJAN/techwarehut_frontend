'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { logout } from '@/lib/features/auth/authSlice';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary-600">
          Wanderlust
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/packages" className="text-gray-600 hover:text-primary-600">
            Packages
          </Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link href="/admin/packages" className="text-gray-600 hover:text-primary-600">
                  Manage
                </Link>
              )}
              {user?.role !== 'admin' && (
                <Link href="/my-bookings" className="text-gray-600 hover:text-primary-600">
                  My Bookings
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-primary-600">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
