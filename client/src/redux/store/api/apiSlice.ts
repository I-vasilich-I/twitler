import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API, APIS, TWITLER_TOKEN_KEY } from "../../../constants";
import { IAuthData, IAuthResponseData } from "../../../types";
import { resetUser, setUser } from "../user/userSlice";

const { REFRESH, LOGOUT } = APIS;

type AuthArgs = {
  data: IAuthData;
  url: string;
};

export const apiSlice = createApi({
  reducerPath: "API",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(TWITLER_TOKEN_KEY);

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    auth: builder.mutation<IAuthResponseData, AuthArgs>({
      query: ({ data, url }) => ({
        url,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            localStorage.setItem(TWITLER_TOKEN_KEY, data.tokens.accessToken);
            dispatch(setUser(data.user));
          }
        } catch (error) {
          //
        }
      },
    }),
    checkAuth: builder.query({
      query: () => ({
        url: REFRESH,
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            localStorage.setItem(TWITLER_TOKEN_KEY, data.tokens.accessToken);
            dispatch(setUser(data.user));
          }
        } catch (error) {
          //
        }
      },
    }),
    logout: builder.query({
      query: () => ({
        url: LOGOUT,
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem(TWITLER_TOKEN_KEY);
          dispatch(resetUser());
        } catch (error) {
          //
        }
      },
    }),
  }),
});

export const { useAuthMutation, useCheckAuthQuery, useLazyCheckAuthQuery, useLazyLogoutQuery } = apiSlice;
