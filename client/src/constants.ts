const PATHS = {
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  ROOT: "/",
  HOME: "/home",
  EXPLORE: "/explore",
  BOOKMARKS: "/bookmarks/*",
  PROFILE: "/profile/*",
  PROFILE_TWEETS: "/profile/tweets",
  PROFILE_TWEETS_WITH_REPLIES: "/profile/tweets/with-replies",
  PROFILE_TWEETS_WITH_MEDIA: "/profile/tweets/with-media",
  PROFILE_TWEETS_WITH_LIKES: "/profile/tweets/with-likes",
  BOOKMARKS_TWEETS: "/bookmarks/tweets",
  BOOKMARKS_TWEETS_WITH_REPLIES: "/bookmarks/tweets/with-replies",
  BOOKMARKS_TWEETS_WITH_MEDIA: "/bookmarks/tweets/with-media",
  BOOKMARKS_TWEETS_WITH_LIKES: "/bookmarks/tweets/with-likes",
  SETTINGS: "/settings",
  UNKNOWN: "*",
};

const SERVER_URL = "http://localhost:4000";
const BASE_API = `${SERVER_URL}/api`;
const USER_API = `${BASE_API}/user`;
const COMMENT_API = `${BASE_API}/comment`;
const TWEETS_API = `${BASE_API}/tweets`;
const EXPLORE = `${BASE_API}/search`;
const BOOKMARK_API = `${BASE_API}/bookmark`;

const APIS = {
  SIGN_IN: `${USER_API}/signin`,
  SIGN_UP: `${USER_API}/signup`,
  REFRESH: `${USER_API}/refresh`,
  LOGOUT: `${USER_API}/logout`,
  GET_USER: (userId: number) => `${USER_API}/${userId}`,
  COMMENT: `${COMMENT_API}`,
  FOLLOWING_TWEETS: `${BASE_API}/following-tweets`,
  REACT_ON_TWEET: `${TWEETS_API}/react`,
  CREATE_TWEET: TWEETS_API,
  GET_TWEETS_BY_USER_ID: (userId: number) => `${TWEETS_API}/${userId}`,
  GET_TWEETS_WITH_REPLIES_BY_USER_ID: (userId: number) => `${TWEETS_API}/with_replies/${userId}`,
  GET_TWEETS_WITH_MEDIA_BY_USER_ID: (userId: number) => `${TWEETS_API}/media/${userId}`,
  GET_TWEETS_WITH_LIKES_BY_USER_ID: (userId: number) => `${TWEETS_API}/likes/${userId}`,
  EXPLORE,
  GET_ALL_SAVED_TWEETS: `${BOOKMARK_API}`,
  GET_SAVED_TWEETS_WITH_REPLIES: `${BOOKMARK_API}/with_replies`,
  GET_SAVED_TWEETS_WITH_MEDIA: `${BOOKMARK_API}/media`,
  GET_SAVED_TWEETS_WITH_LIKES: `${BOOKMARK_API}/likes`,
};

const TWITLER_TOKEN_KEY = "twitler_access_token";

const ERROR_MESSAGES = {
  SOMETHING_WENT_WRONG: "Something went wrong",
  INVALID_EMAIL: "The input is not valid E-mail!",
  EMAIL_REQUIRED: "Please input your E-mail!",
  PASSWORD_REQUIRED: "Please input your password!",
  USERNAME_REQUIRED: "Please input your username!",
  CONFIRM_PASSWORD: "Please confirm your password!",
  PASSWORDS_NOT_MATCH: "The two passwords that you entered do not match!",
  EMPTY_COMMENT: "You can't send an empty comment",
};

const PLACEHOLDERS = {
  USERNAME: "Username",
  EMAIL: "Email",
  PASSWORD: "Password",
  CONFIRM_PASSWORD: "Confirm password",
};

export { PATHS, SERVER_URL, BASE_API, APIS, TWITLER_TOKEN_KEY, ERROR_MESSAGES, PLACEHOLDERS };
