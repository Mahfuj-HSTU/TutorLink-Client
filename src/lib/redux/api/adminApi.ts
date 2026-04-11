import { baseApi } from "./baseApi";
import type { User, ApiResponse } from "@/types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: list all platform users
    getAllUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => "/admin/users",
      providesTags: ["User"],
    }),

    // Admin: ban or unban a user
    updateUserStatus: builder.mutation<
      ApiResponse<User>,
      { id: string; isBanned: boolean }
    >({
      query: ({ id, isBanned }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        body: { isBanned },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserStatusMutation } = adminApi;
