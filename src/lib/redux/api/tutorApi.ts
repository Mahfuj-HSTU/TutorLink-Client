import { baseApi } from "./baseApi";
import type {
  TutorProfile,
  CreateTutorProfilePayload,
  TutorQueryParams,
  ApiResponse,
} from "@/types";

export const tutorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Public ─────────────────────────────────────────────────────────────
    getTutors: builder.query<ApiResponse<TutorProfile[]>, TutorQueryParams>({
      query: (params) => ({
        url: "/tutors",
        params,
      }),
      providesTags: ["Tutor"],
    }),

    getTutorById: builder.query<ApiResponse<TutorProfile>, string>({
      query: (id) => `/tutors/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Tutor", id }],
    }),

    // ── Tutor-protected ────────────────────────────────────────────────────
    createTutorProfile: builder.mutation<
      ApiResponse<TutorProfile>,
      CreateTutorProfilePayload
    >({
      query: (body) => ({
        url: "/tutors/profile",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tutor"],
    }),

    updateTutorProfile: builder.mutation<
      ApiResponse<TutorProfile>,
      CreateTutorProfilePayload
    >({
      query: (body) => ({
        url: "/tutors/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tutor"],
    }),

    updateTutorCategories: builder.mutation<
      ApiResponse<TutorProfile>,
      { categoryIds: string[] }
    >({
      query: (body) => ({
        url: "/tutors/categories",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tutor"],
    }),

    updateTutorAvailability: builder.mutation<
      ApiResponse<TutorProfile>,
      { isAvailable: boolean }
    >({
      query: (body) => ({
        url: "/tutors/availability",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tutor"],
    }),
  }),
});

export const {
  useGetTutorsQuery,
  useGetTutorByIdQuery,
  useCreateTutorProfileMutation,
  useUpdateTutorProfileMutation,
  useUpdateTutorCategoriesMutation,
  useUpdateTutorAvailabilityMutation,
} = tutorApi;
