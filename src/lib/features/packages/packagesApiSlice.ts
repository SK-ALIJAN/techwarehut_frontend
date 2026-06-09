import { apiSlice } from '@/lib/features/api/apiSlice';

export const packagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: (params) => ({
        url: '/packages',
        params,
      }),
      providesTags: ['Package'],
    }),
    getPackage: builder.query({
      query: (id) => `/packages/${id}`,
      providesTags: (result, error, id) => [{ type: 'Package', id }],
    }),
    createPackage: builder.mutation({
      query: (newPackage) => ({
        url: '/packages',
        method: 'POST',
        body: newPackage,
      }),
      invalidatesTags: ['Package'],
    }),
    updatePackage: builder.mutation({
      query: ({ id, ...updatedPackage }) => ({
        url: `/packages/${id}`,
        method: 'PUT',
        body: updatedPackage,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Package', id }, 'Package'],
    }),
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Package'],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useGetPackageQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packagesApiSlice;
