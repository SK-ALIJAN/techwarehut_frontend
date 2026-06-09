'use client';

import { useGetPackagesQuery } from '@/lib/features/packages/packagesApiSlice';
import { getPackageImage } from '@/lib/imageHelper';
import Link from 'next/link';
import {
  Compass,
  DollarSign,
  ShieldCheck,
  Heart,
  MapPin,
  Clock,
  ArrowRight,
  Star,
  Users,
  Sparkles,
  Briefcase
} from 'lucide-react';

export default function Home() {
  const { data, isLoading } = useGetPackagesQuery({ limit: 3 });
  const packages = data?.data?.packages || [];

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs sm:text-sm font-semibold mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Discover Your Next Extraordinary Adventure</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-primary-200">
            Explore the World’s <br />
            <span className="text-primary-400">Most Beautiful</span> Places
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 mb-10 font-normal leading-relaxed">
            Handpicked premium packages, luxury escapes, and cultural journeys tailored for the modern traveler. Simple booking, trusted guides.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/packages"
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-primary-600/30 transition duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition duration-300 flex items-center justify-center"
            >
              Join Wanderlust
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-16 pt-8 border-t border-slate-800 text-slate-300">
            <div>
              <p className="text-2xl sm:text-4xl font-extrabold text-white">15k+</p>
              <p className="text-xs sm:text-sm text-slate-400">Happy Travelers</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-extrabold text-white">500+</p>
              <p className="text-xs sm:text-sm text-slate-400">Destinations</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-extrabold text-white">4.9/5</p>
              <p className="text-xs sm:text-sm text-slate-400">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-primary-600 font-bold tracking-wider text-xs uppercase block mb-2">Curated Escapes</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Featured Packages</h2>
          </div>
          <Link href="/packages" className="mt-4 sm:mt-0 inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group">
            <span>View All Packages</span>
            <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-100 rounded-2xl h-[420px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg: any) => (
              <Link href={`/packages/${pkg._id}`} key={pkg._id} className="group">
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                  <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                    <img
                      src={getPackageImage(pkg.destination, pkg.image)}
                      alt={pkg.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-900 shadow-sm">
                      {pkg.duration} Days
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
                      <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                      <span>{pkg.destination}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-2">
                      {pkg.title}
                    </h3>
                    <p className="text-slate-650 text-sm line-clamp-3 mb-6 flex-grow">
                      {pkg.description}
                    </p>
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">From</span>
                        <span className="text-2xl font-extrabold text-primary-600">${pkg.price}</span>
                      </div>
                      <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl text-sm font-semibold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                        View Details
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-8 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white">Wanderlust</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/packages" className="hover:text-white transition">Explore Packages</Link>
              <Link href="/login" className="hover:text-white transition">Sign In</Link>
              <Link href="/register" className="hover:text-white transition">Create Account</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} Wanderlust. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Crafted for the</span>
              <span className="font-extrabold text-slate-200">Techware Hut</span>
              <span>Developer Assignment.</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
