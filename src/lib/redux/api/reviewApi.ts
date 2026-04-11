import { baseApi } from "./baseApi";
import type { Review, CreateReviewPayload, ApiResponse } from "@/types";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Student: submit a review for a completed booking
    createReview: builder.mutation<ApiResponse<Review>, CreateReviewPayload>({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Review", "Tutor", "Booking"],
    }),

    // Public: fetch all reviews for a tutor
    getReviewsByTutor: builder.query<ApiResponse<Review[]>, string>({
      query: (tutorId) => `/reviews/tutor/${tutorId}`,
      providesTags: (_result, _error, tutorId) => [{ type: "Review", id: tutorId }],
    }),
  }),
});

export const { useCreateReviewMutation, useGetReviewsByTutorQuery } = reviewApi;
