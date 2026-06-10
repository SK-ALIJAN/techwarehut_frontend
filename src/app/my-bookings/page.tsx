'use client';

import { useGetMyBookingsQuery, useCancelBookingMutation } from '@/lib/features/bookings/bookingsApiSlice';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getPackageImage } from '@/lib/imageHelper';
import { 
  Calendar, 
  MapPin, 
  User, 
  Ticket, 
  DollarSign, 
  Clock, 
  XCircle, 
  Briefcase,
  AlertCircle,
  Compass
} from 'lucide-react';

export default function MyBookings() {
  const { data, isLoading, refetch } = useGetMyBookingsQuery(undefined);
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        await cancelBooking(id).unwrap();
        toast.success('Booking cancelled successfully');
        refetch(); // Refetch the bookings list
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to cancel booking');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-650 animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  const bookings = data?.data?.bookings || [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-12 relative overflow-hidden mb-10">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">My Bookings</h1>
          <p className="mt-2 text-slate-300 max-w-xl text-sm md:text-base">
            Track and manage your scheduled travel packages, status confirmations, and booking details.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {bookings.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center text-slate-500 max-w-md mx-auto flex flex-col items-center gap-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Compass className="w-8 h-8 text-primary-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">No Bookings Found</h3>
              <p className="text-sm text-slate-500 mt-1">You haven't reserved any travel packages yet. Let's find your first getaway!</p>
            </div>
            <Link 
              href="/packages" 
              className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-md shadow-primary-600/10"
            >
              Explore Travel Packages
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: any) => {
              const isCancelled = booking.status === 'cancelled';
              const pkg = booking.packageId;

              return (
                <div 
                  key={booking._id} 
                  className={`bg-white rounded-3xl border border-slate-205 overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col sm:flex-row ${
                    isCancelled ? 'opacity-80' : ''
                  }`}
                >
                  {/* Destination Mini Thumbnail */}
                  <div className="relative w-full sm:w-48 h-40 sm:h-auto overflow-hidden bg-slate-100 shrink-0">
                    {pkg ? (
                      <img 
                        src={getPackageImage(pkg.destination, pkg.image)} 
                        alt={pkg.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 text-2xs font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                        isCancelled 
                          ? 'bg-red-50 text-red-605 border border-red-100' 
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      {pkg ? (
                        <Link 
                          href={`/packages/${pkg._id}`} 
                          className="text-lg font-bold text-slate-900 hover:text-primary-600 transition"
                        >
                          {pkg.title}
                        </Link>
                      ) : (
                        <span className="text-lg font-bold text-slate-400 italic">Package Unavailable</span>
                      )}

                      <div className="mt-4 grid grid-cols-1 min-[450px]:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Ticket className="w-4 h-4 text-slate-400" />
                          <span>Seats Reserved: <strong className="text-slate-700">{booking.seats}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span>Total Cost: <strong className="text-slate-900">${booking.totalPrice}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 min-[450px]:col-span-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Booked on {new Date(booking.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-slate-50 flex flex-col min-[450px]:flex-row min-[450px]:items-center justify-between gap-3">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        Booking ID: {booking._id.substring(booking._id.length - 8)}
                      </span>
                      
                      {!isCancelled && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={isCancelling}
                          className="text-xs font-bold text-red-600 hover:text-red-750 flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-red-50 transition w-fit"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cancel Booking</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
