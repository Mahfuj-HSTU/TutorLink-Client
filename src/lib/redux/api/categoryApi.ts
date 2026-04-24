import { baseApi } from './baseApi'
import type { Category, CreateCategoryPayload, ApiResponse } from '@/types'

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //* Public: list all active categories
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => '/categories',
      providesTags: ['Category']
    }),

    getAllCategoriesAdmin: builder.query<ApiResponse<Category[]>, void>({
      query: () => '/categories/all',
      providesTags: ['Category']
    }),

    //* Admin: create a new category
    createCategory: builder.mutation<
      ApiResponse<Category>,
      CreateCategoryPayload
    >({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Category']
    }),

    // Admin: update a category
    updateCategory: builder.mutation<
      ApiResponse<Category>,
      { id: string } & Partial<CreateCategoryPayload>
    >({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Category']
    }),

    //* Admin: delete a category
    deleteCategory: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Category']
    })
  })
})

export const {
  useGetCategoriesQuery,
  useGetAllCategoriesAdminQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi
