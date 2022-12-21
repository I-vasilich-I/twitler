import { validationResult } from 'express-validator';
import { BadRequestException } from '../exceptions/index.js';
import CreateUserDto from './dto/create-user.dto.js';
import userService from "./user.service.js";
import { MAX_AGE_REFRESH_TOKEN_COOKIE } from '../constants.js';

class UserController {
  async signUp(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new BadRequestException('Validation error', errors.array()));
      }

      const createUserDto = new CreateUserDto(req.body);
      const userData = await userService.signUp(createUserDto)
      res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: MAX_AGE_REFRESH_TOKEN_COOKIE, httpOnly: true })
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  async signIn(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new BadRequestException('Validation error', errors.array()));
      }

      const { email, password } = req.body;
      const userData = await userService.signIn({ email, password });
      res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: MAX_AGE_REFRESH_TOKEN_COOKIE, httpOnly: true });
      return res.json(userData);
    } catch (error) {
      next(error)
    }
  }

  async logOut(req, res, next) {
    try {
      await userService.logOut(req.user.email);
      res.clearCookie('refreshToken');
      return res.json();
    } catch (error) {
      next(error)
    }
  }

  async activate(req, res, next) {
    try {
      await userService.activate(req.params.link);
      return res.redirect(process.env.CLIENT_URL)
    } catch (error) {
      next(error)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: MAX_AGE_REFRESH_TOKEN_COOKIE, httpOnly: true });
      return res.json(userData);
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const loggedUserId = req.user.id;
      const userData = await userService.getById(+id, loggedUserId);
      return res.json(userData);
    } catch (error) {
      next(error)
    }
  }

  async updateInfo(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new BadRequestException('Validation error', errors.array()));
    }

    try {
      const { body, user, file } = req;
      const userData = await userService.updateInfo(body, user.id, file)
      return res.json(userData);
    } catch (error) {
      next(error)
    }
  }

  async updatePassword(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new BadRequestException('Validation error', errors.array()));
    }

    try {
      await userService.updatePassword({ id: req.user.id, ...req.body });
      return res.json();
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      await userService.delete(req.user.id);
      return res.json();
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController();
