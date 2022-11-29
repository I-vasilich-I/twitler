import { Router } from "express";
import { body, check } from 'express-validator';
import multer from 'multer';
import mime from 'mime-types';
import authMidleware from "../midlewares/auth.midleware.js";
import userController from "../user/user.controller.js";
import tweetController from '../tweet/tweet.controller.js';
import { ROUTES } from "../constants.js";
import commentController from "../comment/comment.controller.js";
import followController from "../follow/follow.controller.js";

const storage = multer.diskStorage({
  destination: 'public/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = mime.extension(file.mimetype);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
})
const upload = multer({ storage })

const { 
  BASE,
  SIGN_UP,
  SIGN_IN,
  LOG_OUT,
  ACTIVATE,
  REFRESH,
  GET_USER,
  UPDATE_INFO,
  UPDATE_PASSWORD,
  DELETE_USER,
  CREATE_TWEET,
  DELETE_TWEET,
  REACT_ON_TWEET,
  GET_TWEETS_BY_USER,
  GET_TWEETS_WITH_LIKES_BY_USER,
  GET_TWEETS_WITH_MEDIA_BY_USER,
  CREATE_COMMENT,
  LIKE_COMMENT,
  DELETE_COMMENT,
  GET_ALL_FOLLOWERS,
  GET_ALL_FOLLOWING,
  FOLLOW
} = ROUTES;

const router = new Router();

//----USER ENDPOINTS---------------------------------------------------
router.post(
  SIGN_UP,
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  userController.signUp
  );
router.post(
  SIGN_IN,
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  userController.signIn
  );
router.post(LOG_OUT, authMidleware, userController.logOut);
router.get(ACTIVATE, userController.activate);
router.get(REFRESH, userController.refresh);
router.get(GET_USER, authMidleware, userController.getById)
router.put(
  UPDATE_INFO,
  authMidleware,
  upload.single('avatar'),
  check('email').isEmail().optional({ checkFalsy: true }),
  check('userName').notEmpty().optional(),
  userController.updateInfo
  );
router.put(
  UPDATE_PASSWORD, 
  authMidleware, 
  body('oldPassword').isLength({ min: 8 }),
  body('newPassword').isLength({ min: 8 }),
  userController.updatePassword
  )
router.delete(DELETE_USER, authMidleware, userController.delete);
//---------------------------------------------------------------------

//----TWEETS ENDPOINTS-------------------------------------------------
router.post(CREATE_TWEET, authMidleware, upload.single('image'), tweetController.create);
router.delete(DELETE_TWEET, authMidleware, tweetController.delete);
router.put(REACT_ON_TWEET, authMidleware, tweetController.react);
router.get(GET_TWEETS_BY_USER, authMidleware, tweetController.getAllByUserId);
router.get(GET_TWEETS_WITH_LIKES_BY_USER, authMidleware, tweetController.getAllWithLikesByUserId)
router.get(GET_TWEETS_WITH_MEDIA_BY_USER, authMidleware, tweetController.getAllWithMediaByUserId)
//---------------------------------------------------------------------

//----COMMENTS ENDPOINTS-----------------------------------------------
router.post(CREATE_COMMENT, authMidleware, upload.single('image'), commentController.create)
router.put(LIKE_COMMENT, authMidleware, commentController.like)
router.delete(DELETE_COMMENT, authMidleware, commentController.delete)
//---------------------------------------------------------------------

//----FOLLOW ENDPOINTS-------------------------------------------------
router.get(GET_ALL_FOLLOWERS, authMidleware, followController.getAllFollowers)
router.get(GET_ALL_FOLLOWING, authMidleware, followController.getAllFollowing)
router.put(FOLLOW, authMidleware, followController.follow)
//---------------------------------------------------------------------

export { router };