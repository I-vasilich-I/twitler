const PATHS = {
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  ROOT: "/",
  HOME: "/home",
  EXPLORE: "/explore",
  UNKNOWN: "*",
};

const BASE_API = "http://localhost:4000/api";
const USER_API = `${BASE_API}/user`;

const APIS = {
  SIGN_IN: `${USER_API}/signin`,
  SIGN_UP: `${USER_API}/signup`,
  REFRESH: `${USER_API}/refresh`,
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
};

const PLACEHOLDERS = {
  USERNAME: "Username",
  EMAIL: "Email",
  PASSWORD: "Password",
  CONFIRM_PASSWORD: "Confirm password",
};

export { PATHS, BASE_API, APIS, TWITLER_TOKEN_KEY, ERROR_MESSAGES, PLACEHOLDERS };
