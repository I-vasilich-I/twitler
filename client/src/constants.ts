const PATHS = {
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  ROOT: "/",
  HOME: "/home",
  EXPLORE: "/explore",
  BOOKMARKS: "/bookmarks",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  UNKNOWN: "*",
};

const SERVER_URL = "http://localhost:4000";
const BASE_API = `${SERVER_URL}/api`;
const USER_API = `${BASE_API}/user`;
const COMMENT_API = `${BASE_API}/comment`;
const TWEETS_API = `${BASE_API}/tweets`;

const APIS = {
  SIGN_IN: `${USER_API}/signin`,
  SIGN_UP: `${USER_API}/signup`,
  REFRESH: `${USER_API}/refresh`,
  LOGOUT: `${USER_API}/logout`,
  COMMENT: `${COMMENT_API}`,
  FOLLOWING_TWEETS: `${BASE_API}/following-tweets`,
  REACT_ON_TWEET: `${TWEETS_API}/react`,
  CREATE_TWEET: TWEETS_API,
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
