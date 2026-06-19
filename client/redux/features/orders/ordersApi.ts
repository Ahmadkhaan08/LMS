import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get all orders
    getAllOrders: builder.query({
      query: () => ({
        url: "get-all-orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    // get stripe publishable key
    getStripePublishableKey: builder.query({
      query: () => ({
        url: "payment/stripepublishablekey",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    // create payment
    createPayment: builder.mutation({
      query: (amount) => ({
        url: "payment",
        method: "POST",
        body: { amount },
        credentials: "include" as const,
      }),
    }),
    // create order
    createOrder: builder.mutation({
      query: ({ courseId, payment_Info }) => ({
        url: "create-order",
        method: "POST",
        body: {
          courseId,
          payment_Info,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetStripePublishableKeyQuery,
  useCreatePaymentMutation,
  useCreateOrderMutation,
} = ordersApi;
