import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API, APIS, TWITLER_TOKEN_KEY } from "../../../constants";
import { getImageUrl } from "../../../helpers";
import {
  IAuthData,
  IAuthResponseData,
  IComment,
  ICommentsResponseData,
  IFollowResponseData,
  ITweetResponseData,
  IUserResponseData,
} from "../../../types";
import { resetUser, setUser } from "../user/userSlice";

const { REFRESH, LOGOUT, COMMENT, REACT_ON_TWEET, CREATE_TWEET, GET_USER } = APIS;

type AuthArgs = {
  data: IAuthData;
  url: string;
};

type ReactOnTweetArgs = {
  tweetId: number;
  retweet?: boolean;
  like?: boolean;
  save?: boolean;
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
  tagTypes: ["Comments", "User", "Tweets"],
  endpoints: (builder) => ({
    auth: builder.mutation<IAuthResponseData, AuthArgs>({
      query: ({ data, url }) => ({
        url,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Tweets", "Comments"],
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
    logout: builder.mutation({
      query: () => ({
        url: LOGOUT,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Comments", "Tweets"],
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
    createComment: builder.mutation({
      query: ({ data, tweetId }) => ({
        url: `${COMMENT}/${tweetId}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Comments", "Tweets"],
    }),
    likeComment: builder.mutation({
      query: ({ like = true, commentId }) => ({
        url: `${COMMENT}/${commentId}?like=${like}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Comments"],
    }),
    getComments: builder.query<IComment[], number>({
      query: (tweetId) => ({
        url: `${COMMENT}/${tweetId}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response: ICommentsResponseData[]) =>
        response.map(
          ({ User: { avatar, username }, commentLikes, imageLink, _count: { commentLikes: likes }, ...rest }) => ({
            avatar: getImageUrl(avatar),
            username,
            imageLink: getImageUrl(imageLink),
            hasMyLike: Boolean(commentLikes.length),
            likes,
            ...rest,
          })
        ),
      providesTags: ["Comments"],
    }),
    reactOnTweet: builder.mutation<void, ReactOnTweetArgs>({
      query: ({ like, retweet, save, tweetId }) => {
        const queryParams = [];

        if (like !== undefined) {
          queryParams.push(`like=${like}`);
        }

        if (retweet !== undefined) {
          queryParams.push(`retweet=${retweet}`);
        }

        if (save !== undefined) {
          queryParams.push(`save=${save}`);
        }

        return {
          url: `${REACT_ON_TWEET}/${tweetId}?${queryParams.join("&")}`,
          method: "PUT",
          credentials: "include",
        };
      },
      invalidatesTags: ["Tweets"],
    }),
    createTweet: builder.mutation({
      query: (data) => ({
        url: CREATE_TWEET,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Tweets"],
    }),
    getTweets: builder.query({
      query: (url) => ({
        url,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Tweets"],
      transformResponse: (response: ITweetResponseData[]) =>
        response.map(({ User: { avatar, username }, retweets, tweetLikes, bookmarks, imageLink, _count, ...rest }) => ({
          ...rest,
          avatar: getImageUrl(avatar),
          username,
          imageLink: getImageUrl(imageLink),
          hasMyRetweet: Boolean(retweets.length),
          hasMyLike: Boolean(tweetLikes.length),
          hasMyBookmark: Boolean(bookmarks.length),
          counters: {
            retweets: _count.retweets,
            tweetLikes: _count.tweetLikes,
            bookmarks: _count.bookmarks,
            comments: _count.comments,
          },
        })),
    }),
    getUserInfo: builder.query({
      query: (userId) => ({
        url: GET_USER(userId),
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
      transformResponse: ({ _count: { followers, following }, avatar, ...rest }: IUserResponseData) => ({
        ...rest,
        avatar: getImageUrl(avatar),
        followers,
        following,
      }),
    }),
    follow: builder.mutation({
      query: (url) => ({
        url,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Tweets", "User"],
    }),
    getFollowData: builder.query({
      query: (url) => ({
        url,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
      transformResponse: ({ data: followData, ...rest }: IFollowResponseData) => {
        const data = followData.map(({ avatar, ...followersRest }) => ({
          ...followersRest,
          avatar: getImageUrl(avatar),
        }));

        return { ...rest, data };
      },
    }),
  }),
});

export const {
  useAuthMutation,
  useCheckAuthQuery,
  useLazyCheckAuthQuery,
  useLogoutMutation,
  useCreateCommentMutation,
  useGetCommentsQuery,
  useLikeCommentMutation,
  useReactOnTweetMutation,
  useCreateTweetMutation,
  useGetTweetsQuery,
  useGetUserInfoQuery,
  useFollowMutation,
  useGetFollowDataQuery,
} = apiSlice;
