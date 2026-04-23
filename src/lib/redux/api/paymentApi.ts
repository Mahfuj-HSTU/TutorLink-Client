import { baseApi } from './baseApi'
import type { ApiResponse } from '@/types'

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initPayment: builder.mutation<ApiResponse<{ gatewayUrl: string }>, { bookingId: string }>({
      query: (body) => ({
        url: '/payment/init',
        method: 'POST',
        body
      })
    })
  })
})

export const { useInitPaymentMutation } = paymentApi
