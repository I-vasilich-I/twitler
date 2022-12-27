import { validationResult } from 'express-validator';
import { BadRequestException } from '../../exceptions/index.js';
import {
  MAX_AGE_REFRESH_TOKEN_COOKIE, ERROR_MESSAGES, COOKIES, STATUS_CODES,
} from '../../constants.js';
import CreateUserDto from './dto/create-user.dto.js';
import userService from './user.service.js';

const cookieOptions = { maxAge: MAX_AGE_REFRESH_TOKEN_COOKIE, httpOnly: true };

class UserController {
  async signUp(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        next(new BadRequestException(ERROR_MESSAGES.VALIDATION_ERROR, errors.array()));
      }

      const createUserDto = new CreateUserDto(req.body);
      const userData = await userService.signUp(createUserDto);
      res.cookie(COOKIES.REFRESH_TOKEN, userData.tokens.refreshToken, cookieOptions);
      res.status(STATUS_CODES.CREATED);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        next(new BadRequestException(ERROR_MESSAGES.VALIDATION_ERROR, errors.array()));
      }

      const { email, password } = req.body;
      const userData = await userService.signIn({ email, password });
      res.cookie(COOKIES.REFRESH_TOKEN, userData.tokens.refreshToken, cookieOptions);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logOut(req, res, next) {
    try {
      await userService.logOut(req.user.email);
      res.clearCookie(COOKIES.REFRESH_TOKEN);
      res.status(STATUS_CODES.NO_CONTENT);
      res.json();
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      await userService.activate(req.params.link);
      res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie(COOKIES.REFRESH_TOKEN, userData.tokens.refreshToken, cookieOptions);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const loggedUserId = req.user.id;
      const userData = await userService.getById(Number(id), loggedUserId);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async updateInfo(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(new BadRequestException(ERROR_MESSAGES.VALIDATION_ERROR, errors.array()));
    }

    try {
      const { body, user } = req;
      const userData = await userService.updateInfo(body, user.id);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req, res, next) {
    try {
      const { user, file } = req;
      const userData = await userService.updateAvatar(user.id, file);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async removeAvatar(req, res, next) {
    try {
      const userData = await userService.removeAvatar(req.user.id);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(new BadRequestException(ERROR_MESSAGES.VALIDATION_ERROR, errors.array()));
    }

    try {
      const { user, body } = req;
      await userService.updatePassword({ id: user.id, ...body });
      res.status(STATUS_CODES.NO_CONTENT);
      res.json();
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await userService.delete(req.user.id);
      res.status(STATUS_CODES.NO_CONTENT);
      res.json();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
