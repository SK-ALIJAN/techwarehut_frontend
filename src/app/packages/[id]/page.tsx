'use client';

import { useGetPackageQuery } from '@/lib/features/packages/packagesApiSlice';
import { useCreateBookingMutation } from '@/lib/features/bookings/bookingsApiSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';
import Link from 'next/link';

const schema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  seats: z.number().min(1, 'At least 1 seat required'),
});

type FormData = z.infer<typeof schema>;

export default function PackageDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, isLoading } = useGetPackageQuery(id);
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      seats: 1,
    }
  });

  const seats = watch('seats');
  const pkg = data?.data?.package;

  useEffect(() => {
    if (user) {
      reset({
        customerName: user.name,
        email: user.email,
        seats: 1,
      });
    }
  }, [user, reset]);

  const onSubmit = async (formData: FormData) => {
    if (!isAuthenticated) {
      toast.error('Please login to book a package');
      router.push('/login');
      return;
    }

    try {
      await createBooking({ ...formData, packageId: id }).unwrap();
      toast.success('Booking successful!');
      router.push('/my-bookings');
    } catch (err: any) {
      toast.error(err.data?.message || 'Booking failed');
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (!pkg) return <div className="text-center py-20">Package not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="h-96 bg-gray-200 rounded-xl mb-8 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl">
                 Image
              </div>
           </div>
           <h1 className="text-4xl font-bold text-gray-900 mb-4">{pkg.title}</h1>
           <div className="flex gap-4 text-sm text-gray-600 mb-8">
             <span>📍 {pkg.destination}</span>
             <span>⏱️ {pkg.duration} Days</span>
             <span>📅 Starts: {new Date(pkg.startDate).toLocaleDateString()}</span>
           </div>
           
           <div className="prose max-w-none">
             <h2 className="text-2xl font-semibold mb-4">Description</h2>
             <p className="text-gray-700 whitespace-pre-wrap">{pkg.description}</p>
           </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">${pkg.price} <span className="text-sm font-normal text-gray-500">per person</span></h3>
            <p className="text-sm text-gray-500 mb-6">{pkg.availableSeats} seats available</p>

            {user?.role === 'admin' ? (
              <div className="text-center py-6 text-gray-500 space-y-4">
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="font-semibold text-sm text-gray-700">Logged in as Admin</p>
                  <p className="text-xs text-gray-500 mt-2">Booking packages is only available for regular user accounts.</p>
                </div>
                <Link href="/admin/packages" className="w-full block text-center bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors">
                  Manage All Packages
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    {...register('customerName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    {...register('phoneNumber')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Seats</label>
                  <input
                    type="number"
                    {...register('seats', { valueAsNumber: true })}
                    min="1"
                    max={pkg.availableSeats}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                  {errors.seats && <p className="text-red-500 text-xs mt-1">{errors.seats.message}</p>}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${pkg.price * (seats || 1)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isBooking || pkg.availableSeats === 0}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                >
                  {pkg.availableSeats === 0 ? 'Sold Out' : isBooking ? 'Processing...' : 'Book Now'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
