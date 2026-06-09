'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetPackagesQuery } from '@/lib/features/packages/packagesApiSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { getPackageImage } from '@/lib/imageHelper';
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowUpDown, 
  Users, 
  AlertCircle,
  TrendingUp,
  Inbox
} from 'lucide-react';

export default function PackagesPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useGetPackagesQuery({
    destination: debouncedSearch,
    sort,
    page,
    limit: 8,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1); // Reset to first page on sort change
  };

  const packagesList = data?.data?.packages || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Find Your Next Journey</h1>
          <p className="mt-2 text-slate-300 max-w-xl text-sm md:text-base">
            Explore our curated selection of packages. Filter by destination, pricing, or dates to find your perfect getaway.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search destination, title, or keywords..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto shrink-0">
            <div className="relative w-full md:w-56">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <ArrowUpDown className="h-4 w-4" />
              </span>
              <select
                value={sort}
                onChange={handleSortChange}
                className="pl-9 pr-8 py-3 w-full border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="latest">Sort: Latest Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white border border-slate-100 rounded-2xl h-[400px] animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center text-red-600 max-w-md mx-auto flex flex-col items-center gap-3">
              <AlertCircle className="w-10 h-10 text-red-500" />
              <h3 className="font-bold text-lg">Error Loading Packages</h3>
              <p className="text-sm text-red-500/80">Please check your network connection or try again later.</p>
            </div>
          ) : packagesList.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center text-slate-500 max-w-md mx-auto flex flex-col items-center gap-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">No Packages Found</h3>
              <p className="text-sm text-slate-500">We couldn't find any packages matching "{search}". Try searching for another destination.</p>
              <button 
                onClick={() => setSearch('')}
                className="mt-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {packagesList.map((pkg: any) => {
                  const seatsLeft = pkg.availableSeats;
                  const isLowSeats = seatsLeft > 0 && seatsLeft <= 3;
                  const isSoldOut = seatsLeft === 0;

                  return (
                    <Link href={`/packages/${pkg._id}`} key={pkg._id} className="group">
                      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                        {/* Image area */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-200 shrink-0">
                          <img 
                            src={getPackageImage(pkg.destination, pkg.image)} 
                            alt={pkg.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                            {isSoldOut ? (
                              <span className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-2xs font-bold uppercase tracking-wider shadow-sm">
                                Sold Out
                              </span>
                            ) : isLowSeats ? (
                              <span className="bg-amber-500 text-white px-2.5 py-1 rounded-lg text-2xs font-bold uppercase tracking-wider shadow-sm animate-pulse">
                                Only {seatsLeft} Left!
                              </span>
                            ) : (
                              <span className="bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-2xs font-bold uppercase tracking-wider shadow-sm">
                                {seatsLeft} Seats Left
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary-500" />
                            <span>{pkg.duration} Days</span>
                          </div>
                        </div>

                        {/* Card details */}
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
                            <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                            <span className="truncate">{pkg.destination}</span>
                          </div>
                          
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-2">
                            {pkg.title}
                          </h3>
                          
                          <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-grow">
                            {pkg.description}
                          </p>

                          <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                            <div>
                              <span className="text-3xs text-slate-400 block uppercase tracking-wider font-semibold">Price per person</span>
                              <span className="text-xl font-extrabold text-primary-600">${pkg.price}</span>
                            </div>
                            <span className="text-xs font-semibold text-primary-600 group-hover:underline flex items-center gap-0.5">
                              Book Now &rarr;
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-2xs"
                  >
                    &larr; Previous
                  </button>
                  <span className="text-sm text-slate-500 font-semibold">
                    Page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{pagination.totalPages}</span>
                  </span>
                  <button
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-2xs"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
