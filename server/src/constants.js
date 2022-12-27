const MAX_AGE_REFRESH_TOKEN_COOKIE = 30 * 24 * 60 * 60 * 1000;
const BASE_URL = 'http://localhost/api';

const ROUTES = {
  BASE: '/',
  // USER
  SIGN_UP: '/user/signup',
  SIGN_IN: '/user/signin',
  LOG_OUT: '/user/logout',
  ACTIVATE: '/user/activate/:link',
  REFRESH: '/user/refresh',
  GET_USER: '/user/:id',
  UPDATE_INFO: '/user',
  UPDATE_AVATAR: '/user/avatar',
  UPDATE_PASSWORD: '/user/password',
  REMOVE_AVATAR: '/user/remove-avatar',
  DELETE_USER: '/user',
  // TWEET
  CREATE_TWEET: '/tweets',
  REACT_ON_TWEET: '/tweets/react/:tweetId',
  DELETE_TWEET: '/tweets/:tweetId',
  GET_TWEETS_BY_USER: '/tweets/:userId',
  GET_TWEETS_WITH_REPLIES_BY_USER: '/tweets/with_replies/:userId',
  GET_TWEETS_WITH_MEDIA_BY_USER: '/tweets/media/:userId',
  GET_TWEETS_WITH_LIKES_BY_USER: '/tweets/likes/:userId',
  GET_FOLLOWING_TWEETS: '/following-tweets',
  // COMMENT
  GET_ALL_COMMENTS: '/comment/:tweetId',
  CREATE_COMMENT: '/comment/:tweetId',
  LIKE_COMMENT: '/comment/:commentId',
  DELETE_COMMENT: '/comment/:commentId',
  // FOLLOW
  GET_ALL_FOLLOWERS: '/followers/:userId',
  GET_ALL_FOLLOWING: '/following/:userId',
  FOLLOW: '/follow/:userId',
  // EXPLORE
  EXPLORE: '/search',
  EXPLORE_QUERY: '/search/:query',
  // BOOKMARK
  GET_ALL_SAVED_TWEETS: '/bookmark',
  GET_SAVED_TWEETS_WITH_REPLIES: '/bookmark/with_replies',
  GET_SAVED_TWEETS_WITH_MEDIA: '/bookmark/media',
  GET_SAVED_TWEETS_WITH_LIKES: '/bookmark/likes',
};

const FOLLOW_TYPES = {
  FOLLOW: 'follow',
  UNFOLLOW: 'unfollow',
};

const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  USER_WITH_EMAIL_EXIST: (email) => `User with email: ${email} already exist`,
  USER_WITH_ID_DOES_NOT_EXIST: (id) => `User with id: ${id} doesn't exist`,
  WRONG_CREDS: 'Wrong credentials',
  NO_DATA_PASSED: 'No data was passed',
  ENTITY_WITH_ID_DOES_NOT_EXIST: (entity, id) => `${entity} with id: ${id} doesn't exist`,
  WRONG_QUERY: 'Wrong query',
  CAN_NOT_FOLLOW_YOURSELF: 'You can\'t follow|unfollow yourself',
  CAN_UNFOLLOW_WHEN_FOLLOWING: 'You can unfollow only the user you are following',
  WRONG_FOLLOW_TYPE: `Endpoint accepts only ${FOLLOW_TYPES.FOLLOW} | ${FOLLOW_TYPES.UNFOLLOW} types of operations`,
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'User unauthorized',
  NOT_FOUND: 'Not found',
  CONFLICT: 'Conflict',
};

const COOKIES = {
  REFRESH_TOKEN: 'refreshToken',
};

const STATUS_CODES = {
  OK: 200,
  NO_CONTENT: 204,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFILCT: 409,
};

const BOOLEAN_REQ_PARAMS = {
  TRUE: 'true',
  FALSE: 'false',
};

const ORDER_BY_TIMESTAMP = {
  DESC: {
    timestamp: 'desc',
  },
  ASC: {
    timestamp: 'asc',
  },
};

const EXPLORE_FILTERS = {
  PEOPLE: 'people',
  TOP: 'top',
  MEDIA: 'media',
  LATEST: 'latest',
};

const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
};

export {
  ROUTES,
  MAX_AGE_REFRESH_TOKEN_COOKIE,
  BASE_URL,
  ERROR_MESSAGES,
  COOKIES,
  STATUS_CODES,
  BOOLEAN_REQ_PARAMS,
  ORDER_BY_TIMESTAMP,
  FOLLOW_TYPES,
  EXPLORE_FILTERS,
  TOKEN_TYPES,
};
