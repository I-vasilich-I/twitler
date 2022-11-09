import { Router } from "express";
import { body, check } from 'express-validator';
import multer from 'multer';
import mime from 'mime-types';
import { PrismaClient } from '@prisma/client';
import authMidleware from "../midlewares/auth.midleware.js";
import userController from "../user/user.controller.js";
import { ROUTES } from "../constants.js";

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
  DELETE_USER
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

export { router };