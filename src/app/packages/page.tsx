'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetPackagesQuery } from '@/lib/features/packages/packagesApiSlice';
import { useDebounce } from '@/hooks/useDebounce';

export default function PackagesPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useGetPackagesQuery({
    destination: debouncedSearch,
    sort,
    page,
    limit: 10,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Explore Packages</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search destination or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : isError ? (
        <div className="text-center text-red-600 py-12">Failed to load packages</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.packages?.map((pkg: any) => (
              <Link href={`/packages/${pkg._id}`} key={pkg._id}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                     {/* Image placeholder */}
                     <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                       Image
                     </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{pkg.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{pkg.destination}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-primary-600 font-bold">${pkg.price}</span>
                      <span className="text-sm text-gray-500">{pkg.duration} Days</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {data.pagination.totalPages}
              </span>
              <button
                disabled={page === data.pagination.totalPages}
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
