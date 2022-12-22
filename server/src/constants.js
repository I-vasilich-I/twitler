const MAX_AGE_REFRESH_TOKEN_COOKIE = 30 * 24 * 60 * 60 * 1000;
const BASE_URL = 'http://localhost/api'

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
  UPDATE_PASSWORD: '/user/password',
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
}

export { ROUTES, MAX_AGE_REFRESH_TOKEN_COOKIE, BASE_URL }
