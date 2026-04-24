import { baseApi } from './baseApi'
import type {
  Booking,
  CreateBookingPayload,
  ApiResponse,
  BookingStatus
} from '@/types'

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<ApiResponse<Booking>, CreateBookingPayload>(
      {
        query: (body) => ({
          url: '/bookings',
          method: 'POST',
          body
        }),
        invalidatesTags: ['Booking']
      }
    ),

    getMyBookings: builder.query<ApiResponse<Booking[]>, void>({
      query: () => '/bookings/my',
      providesTags: ['Booking']
    }),

    getTutorBookings: builder.query<ApiResponse<Booking[]>, void>({
      query: () => '/bookings/tutor',
      providesTags: ['Booking']
    }),

    updateBookingStatus: builder.mutation<
      ApiResponse<Booking>,
      { id: string; status: BookingStatus }
    >({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: ['Booking']
    })
  })
})

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetTutorBookingsQuery,
  useUpdateBookingStatusMutation
} = bookingApi
