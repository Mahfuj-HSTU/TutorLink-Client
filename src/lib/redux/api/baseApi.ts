import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Central RTK Query base — all feature APIs inject their endpoints here.
// Credentials: "include" ensures the better-auth session cookie is sent
// with every request so the backend can verify the caller's identity.
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : "http://localhost:5000/api",
    credentials: "include",
  }),
  tagTypes: ["Tutor", "Booking", "Category", "Review", "User"],
  endpoints: () => ({}),
});
