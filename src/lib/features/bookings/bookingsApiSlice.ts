import { apiSlice } from '@/lib/features/api/apiSlice';

export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking', 'Package'],
    }),
    getMyBookings: builder.query({
      query: () => '/bookings/my-bookings',
      providesTags: ['Booking'],
    }),
    getAllBookings: builder.query({
      query: () => '/bookings/all',
      providesTags: ['Booking'],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Booking', 'Package'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetAllBookingsQuery,
  useCancelBookingMutation,
} = bookingsApiSlice;
