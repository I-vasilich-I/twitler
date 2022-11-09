const MAX_AGE_REFRESH_TOKEN_COOKIE = 30 * 24 * 60 * 60 * 1000;
const BASE_URL = 'http://localhost/api'

const ROUTES = {
  BASE: '/',
  SIGN_UP: '/user/signup',
  SIGN_IN: '/user/signin',
  LOG_OUT: '/user/logout',
  ACTIVATE: '/user/activate/:link',
  REFRESH: '/user/refresh',
  GET_USER: '/user/:id',
  UPDATE_INFO: '/user',
  UPDATE_PASSWORD: '/user/password',
  DELETE_USER: '/user',
}

export { ROUTES, MAX_AGE_REFRESH_TOKEN_COOKIE, BASE_URL }
