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
import { getPackageImage } from '@/lib/imageHelper';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Check, 
  ChevronLeft,
  ShieldCheck, 
  Users, 
  Info,
  Phone,
  Mail,
  User,
  Ticket
} from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="text-sm font-semibold text-slate-500">Loading travel package...</span>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="bg-white border border-slate-100 p-8 rounded-2xl text-center max-w-md mx-auto flex flex-col items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-105 flex items-center justify-center text-slate-400">
            <Info className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Package Not Found</h3>
          <p className="text-sm text-slate-500">The package you are looking for does not exist or has been removed.</p>
          <Link href="/packages" className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition">
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  // Highlights mock data for visual enrichment
  const highlights = [
    'Premium selected 4-Star or 5-Star Accommodations',
    'Daily Gourmet Breakfast and Selected Dinners Included',
    'Private English-speaking local expert guides',
    'Comfortable Airport transfers and local transit included',
    'Handpicked sightseeing entrance fees pre-paid'
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/packages" className="inline-flex items-center text-slate-500 hover:text-primary-600 text-sm font-semibold gap-1 transition">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Explore Packages</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Banner Image */}
            <div className="h-[400px] w-full rounded-3xl overflow-hidden relative shadow-md bg-slate-200">
              <img 
                src={getPackageImage(pkg.destination, pkg.image)} 
                alt={pkg.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/35 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                  Featured Escape
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
                  {pkg.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-200 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary-400" />
                    <span>{pkg.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary-400" />
                    <span>{pkg.duration} Days / {pkg.duration - 1} Nights</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    <span>Starts: {new Date(pkg.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4">About the Experience</h2>
              <p className="text-slate-650 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                {pkg.description}
              </p>
            </div>

            {/* Package Highlights */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-slate-600 text-sm font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* General Itinerary (visual enhancement) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6">Planned Itinerary</h2>
              <div className="space-y-6">
                {[
                  { day: 'Day 1', title: 'Arrival & Welcome Dinner', desc: 'Arrive at the destination airport. Meet your professional guide and transfer to your luxury hotel. Experience an exclusive welcome dinner with local dishes.' },
                  { day: 'Day 2', title: 'Guided Historic & City Tour', desc: 'A full-day guided excursion to the top monuments and hidden spots of the city. Includes lunch at a traditional local boutique eatery.' },
                  { day: `Day 3 - ${pkg.duration - 1}`, title: 'Scenic Travel & Leisure Time', desc: 'Travel through scenic vistas, explore at your own pace, or join optional activities arranged by your dedicated coordinator.' },
                  { day: `Day ${pkg.duration}`, title: 'Farewell & Departures', desc: 'Breakfast at hotel, souvenir shopping, and scheduled transfer back to the airport for return flight.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-705 font-extrabold text-xs flex items-center justify-center border border-primary-100 shrink-0">
                        {item.day}
                      </div>
                      {idx !== 3 && <div className="w-0.5 bg-slate-100 h-full mt-2" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Side Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24 space-y-6">
              <div>
                <span className="text-xs text-slate-450 block font-bold uppercase tracking-wider mb-1">Pricing From</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-950">${pkg.price}</span>
                  <span className="text-slate-500 text-sm">/ person</span>
                </div>
              </div>

              {/* Status details */}
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Availability</span>
                </span>
                {pkg.availableSeats === 0 ? (
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-lg">
                    Sold Out
                  </span>
                ) : pkg.availableSeats <= 3 ? (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg animate-pulse">
                    Only {pkg.availableSeats} Seats Left
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                    {pkg.availableSeats} Seats Left
                  </span>
                )}
              </div>

              {user?.role === 'admin' ? (
                <div className="text-center py-6 text-slate-550 space-y-4">
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-105">
                    <p className="font-bold text-sm text-amber-800">Admin Account</p>
                    <p className="text-xs text-amber-700 mt-1">
                      You are logged in as an administrator. To test or complete bookings, please log in with a regular customer account.
                    </p>
                  </div>
                  <Link 
                    href="/admin/packages" 
                    className="w-full block text-center bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-4 rounded-xl font-bold transition-colors text-sm shadow-sm"
                  >
                    Manage Packages
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        {...register('customerName')}
                        placeholder="John Doe"
                        className="pl-9 pr-3 py-2.5 block w-full rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                      />
                    </div>
                    {errors.customerName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.customerName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="john@example.com"
                        className="pl-9 pr-3 py-2.5 block w-full rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        {...register('phoneNumber')}
                        placeholder="+1 (555) 000-0000"
                        className="pl-9 pr-3 py-2.5 block w-full rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phoneNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Number of Seats
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Ticket className="w-4 h-4" />
                      </span>
                      <input
                        type="number"
                        {...register('seats', { valueAsNumber: true })}
                        min="1"
                        max={pkg.availableSeats}
                        className="pl-9 pr-3 py-2.5 block w-full rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                      />
                    </div>
                    {errors.seats && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.seats.message}</p>}
                  </div>

                  {/* Calculations breakdown */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                      <span>Subtotal ({seats || 1} guest)</span>
                      <span>${pkg.price} &times; {seats || 1}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                      <span>Booking fee</span>
                      <span className="text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-950 pt-2 border-t border-slate-50">
                      <span>Total Price</span>
                      <span className="text-primary-600">${pkg.price * (seats || 1)}</span>
                    </div>
                  </div>

                  {/* Booking buttons */}
                  <button
                    type="submit"
                    disabled={isBooking || pkg.availableSeats === 0}
                    className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all disabled:bg-slate-300 disabled:cursor-not-allowed text-sm shadow-md shadow-primary-600/10 mt-2 flex items-center justify-center gap-2"
                  >
                    {pkg.availableSeats === 0 ? 'Sold Out' : isBooking ? 'Processing Booking...' : 'Request Booking'}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-2 font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Secure Booking with Instant Confirmation</span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
