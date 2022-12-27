import { Router } from 'express';
import { body, check } from 'express-validator';
import { ROUTES } from '../constants.js';
import authMidleware from '../midlewares/auth.midleware.js';
import uploadMidleware from '../midlewares/upload.midleware.js';
import userController from '../modules/user/user.controller.js';
import tweetController from '../modules/tweet/tweet.controller.js';
import commentController from '../modules/comment/comment.controller.js';
import followController from '../modules/follow/follow.controller.js';
import exploreController from '../modules/explore/explore.controller.js';
import bookmarkController from '../modules/bookmark/bookmark.controller.js';

const {
  SIGN_UP,
  SIGN_IN,
  LOG_OUT,
  ACTIVATE,
  REFRESH,
  GET_USER,
  UPDATE_INFO,
  UPDATE_AVATAR,
  UPDATE_PASSWORD,
  REMOVE_AVATAR,
  DELETE_USER,
  CREATE_TWEET,
  DELETE_TWEET,
  REACT_ON_TWEET,
  GET_TWEETS_BY_USER,
  GET_TWEETS_WITH_LIKES_BY_USER,
  GET_TWEETS_WITH_MEDIA_BY_USER,
  GET_TWEETS_WITH_REPLIES_BY_USER,
  GET_FOLLOWING_TWEETS,
  GET_ALL_COMMENTS,
  CREATE_COMMENT,
  LIKE_COMMENT,
  DELETE_COMMENT,
  GET_ALL_FOLLOWERS,
  GET_ALL_FOLLOWING,
  FOLLOW,
  EXPLORE,
  EXPLORE_QUERY,
  GET_ALL_SAVED_TWEETS,
  GET_SAVED_TWEETS_WITH_REPLIES,
  GET_SAVED_TWEETS_WITH_MEDIA,
  GET_SAVED_TWEETS_WITH_LIKES,
} = ROUTES;

const router = new Router();

// ----USER ENDPOINTS---------------------------------------------------
router.post(
  SIGN_UP,
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  userController.signUp,
);
router.post(
  SIGN_IN,
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  userController.signIn,
);
router.post(LOG_OUT, authMidleware, userController.logOut);
router.get(ACTIVATE, userController.activate);
router.get(REFRESH, userController.refresh);
router.get(GET_USER, authMidleware, userController.getById);
router.patch(
  UPDATE_INFO,
  authMidleware,
  check('email').isEmail().optional(),
  check('userName').notEmpty().optional(),
  userController.updateInfo,
);
router.patch(UPDATE_AVATAR, authMidleware, uploadMidleware.single('avatar'), userController.updateAvatar);
router.patch(REMOVE_AVATAR, authMidleware, userController.removeAvatar);
router.patch(
  UPDATE_PASSWORD,
  authMidleware,
  body('oldPassword').isLength({ min: 8 }),
  body('newPassword').isLength({ min: 8 }),
  userController.updatePassword,
);
router.delete(DELETE_USER, authMidleware, userController.delete);
//---------------------------------------------------------------------

// ----TWEETS ENDPOINTS-------------------------------------------------
router.post(CREATE_TWEET, authMidleware, uploadMidleware.single('image'), tweetController.create);
router.delete(DELETE_TWEET, authMidleware, tweetController.delete);
router.put(REACT_ON_TWEET, authMidleware, tweetController.react);
router.get(GET_TWEETS_BY_USER, authMidleware, tweetController.getAllByUserId);
router.get(GET_TWEETS_WITH_LIKES_BY_USER, authMidleware, tweetController.getAllWithLikesByUserId);
router.get(GET_TWEETS_WITH_MEDIA_BY_USER, authMidleware, tweetController.getAllWithMediaByUserId);
router.get(
  GET_TWEETS_WITH_REPLIES_BY_USER,
  authMidleware,
  tweetController.getAllWithRepliesByUserId,
);
router.get(GET_FOLLOWING_TWEETS, authMidleware, tweetController.getAllFollowingTweets);
//---------------------------------------------------------------------

// ----COMMENTS ENDPOINTS-----------------------------------------------
router.get(GET_ALL_COMMENTS, authMidleware, commentController.getAll);
router.post(CREATE_COMMENT, authMidleware, uploadMidleware.single('image'), commentController.create);
router.put(LIKE_COMMENT, authMidleware, commentController.like);
router.delete(DELETE_COMMENT, authMidleware, commentController.delete);
//---------------------------------------------------------------------

// ----FOLLOW ENDPOINTS-------------------------------------------------
router.get(GET_ALL_FOLLOWERS, authMidleware, followController.getAllFollowers);
router.get(GET_ALL_FOLLOWING, authMidleware, followController.getAllFollowing);
router.put(FOLLOW, authMidleware, followController.follow);
//---------------------------------------------------------------------

// ----EXPLORE ENDPOINTS------------------------------------------------
router.get(EXPLORE, authMidleware, exploreController.getbyQueryAndFilter);
router.get(EXPLORE_QUERY, authMidleware, exploreController.getbyQueryAndFilter);
//---------------------------------------------------------------------

// ----BOOKMARK ENDPOINTS-----------------------------------------------
router.get(GET_ALL_SAVED_TWEETS, authMidleware, bookmarkController.getAllTweets);
router.get(GET_SAVED_TWEETS_WITH_LIKES, authMidleware, bookmarkController.getTweetsWithLikes);
router.get(GET_SAVED_TWEETS_WITH_MEDIA, authMidleware, bookmarkController.getTweetsWithMedia);
router.get(GET_SAVED_TWEETS_WITH_REPLIES, authMidleware, bookmarkController.getTweetsWithReplies);
//---------------------------------------------------------------------

export default router;
