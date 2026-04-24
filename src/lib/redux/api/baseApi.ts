import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : 'http://localhost:5000/api',
    credentials: 'include'
  }),
  tagTypes: ['Tutor', 'Booking', 'Category', 'Review', 'User'],
  endpoints: () => ({})
})
