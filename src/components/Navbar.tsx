'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { logout } from '@/lib/features/auth/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import { Compass, CalendarDays, LogOut, LayoutDashboard, KeyRound, UserPlus, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50" onClick={() => setIsOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm shadow-primary-600/20 group-hover:rotate-12 transition-transform duration-300">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            Wanderlust
          </span>
        </Link>

        {/* Desktop Action Links */}
        <div className="hidden md:flex gap-2 sm:gap-4 items-center">
          <Link 
            href="/packages" 
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
              isActive('/packages') 
                ? 'text-primary-600 bg-primary-50' 
                : 'text-slate-655 hover:text-primary-600 hover:bg-slate-50'
            }`}
          >
            Packages
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link 
                  href="/admin/packages" 
                  className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition ${
                    isActive('/admin/packages') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-slate-655 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}
              {user?.role !== 'admin' && (
                <Link 
                  href="/my-bookings" 
                  className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition ${
                    isActive('/my-bookings') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-slate-655 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>My Bookings</span>
                </Link>
              )}

              <div className="h-4 w-px bg-slate-200 mx-1" />

              <button
                onClick={handleLogout}
                className="bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 border border-slate-200 shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition ${
                  isActive('/login') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-slate-655 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary-600/10 hover:shadow-lg transition duration-200 flex items-center gap-1.5"
              >
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-600 hover:text-slate-900 focus:outline-none p-1.5 rounded-lg hover:bg-slate-100 transition"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-200 space-y-2 pb-2 transition-all duration-300 ease-in-out">
          <Link 
            href="/packages" 
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              isActive('/packages') 
                ? 'text-primary-600 bg-primary-50' 
                : 'text-slate-655 hover:text-primary-600 hover:bg-slate-50'
            }`}
          >
            Packages
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link 
                  href="/admin/packages" 
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                    isActive('/admin/packages') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-slate-655 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard</span>
                </Link>
              )}
              {user?.role !== 'admin' && (
                <Link 
                  href="/my-bookings" 
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                    isActive('/my-bookings') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-slate-655 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  <span>My Bookings</span>
                </Link>
              )}

              <div className="border-t border-slate-100 my-2" />

              <button
                onClick={handleLogout}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 border border-slate-200 shadow-sm"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-slate-100 my-2" />
              <div className="grid grid-cols-2 gap-2 px-2">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition ${
                    isActive('/login') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-slate-655 hover:text-primary-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary-600/10 hover:shadow-lg transition duration-200 flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
