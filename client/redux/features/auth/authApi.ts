import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userRegisteration } from "./authSlice";

type RegisterationResponse = {
  message: string;
  activationToken: string;
};

type RegisterationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // registeration
    register: builder.mutation<RegisterationResponse, RegisterationData>({
      query: (data) => ({
        url: "registeration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegisteration({
              token: result.data.activationToken,
            }),
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    // activation
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),
    // login
    login:builder.mutation({
      query:({email,password})=>({
        url:"login",
        method:"POST",
        body:{
          email,
          password
        }
      }),
      async onQueryStarted(arg,{queryFulfilled,dispatch}){
        try {
          const result = await queryFulfilled
          dispatch(
            userLoggedIn({
              accessToken:result.data.accessToken,
              user:result.data.user
            })
          )
        } catch (error:any) {
          console.log(error)
        }
      }
    }),
    // social auth
    socialAuth:builder.mutation({
      query:({email,name,avatar})=>({
        url:"social-auth",
        method:"POST",
        body:{
          email,
          name,
          avatar
        }
      }),
      async onQueryStarted(arg,{queryFulfilled,dispatch}){
        try {
          const result = await queryFulfilled
          dispatch(
            userLoggedIn({
              accessToken:result.data.accessToken,
              user:result.data.user
            })
          )
        } catch (error:any) {
          console.log(error)
        }
      }
    })
  }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation, useSocialAuthMutation } = authApi;
