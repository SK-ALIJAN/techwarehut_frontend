'use client';

import { useGetMyBookingsQuery, useCancelBookingMutation } from '@/lib/features/bookings/bookingsApiSlice';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const { data, isLoading } = useGetMyBookingsQuery(undefined);
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id).unwrap();
        toast.success('Booking cancelled successfully');
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to cancel booking');
      }
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading bookings...</div>;

  const bookings = data?.data?.bookings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">You have no bookings yet.</p>
          <Link href="/packages" className="text-primary-600 hover:text-primary-700 font-medium">
            Explore Packages
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking: any) => (
              <li key={booking._id}>
                <div className="px-4 py-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <Link href={`/packages/${booking.packageId?._id}`} className="block hover:bg-gray-50">
                      <p className="text-lg font-semibold text-primary-600 truncate">{booking.packageId?.title || 'Package Unavailable'}</p>
                    </Link>
                    <div className="mt-2 sm:flex sm:justify-between text-sm text-gray-500">
                      <div className="sm:flex">
                        <p className="flex items-center mr-6">
                          Seats: {booking.seats}
                        </p>
                        <p className="flex items-center">
                          Total: ${booking.totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col items-end">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <p className="mt-2 text-sm text-gray-500">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={isCancelling}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
