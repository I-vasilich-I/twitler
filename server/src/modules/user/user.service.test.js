// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import { hash } from 'bcrypt';
import prisma from '../prisma/prisma.service.js';
import service from './user.service.js';
import tokenService from '../token/token.service.js';
import mailerService from '../mailer/mailer.service.js';
import {
  BadRequestException, ConflictException, UnauthorizedRequestException, NotFoundException,
} from '../../exceptions/index.js';
import { ERROR_MESSAGES } from '../../constants.js';
import UserDto from './dto/user.dto.js';

jest.mock('../prisma/prisma.service.js');
jest.mock('../../helpers.js', () => ({
  deleteFile: Promise.resolve(),
}));
// jest.mock('bcrypt');
// jest.mock('uuid');

describe('UserService', () => {
  const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique');
  const createSpy = jest.spyOn(prisma.user, 'create');
  const updateSpy = jest.spyOn(prisma.user, 'update');
  const deleteSpy = jest.spyOn(prisma.user, 'delete');
  const generateTokensSpy = jest.spyOn(tokenService, 'generateTokens');
  const validateRefreshTokenSpy = jest.spyOn(tokenService, 'validateRefreshToken');
  const sendActivationMailSpy = jest.spyOn(mailerService, 'sendActivationMail');
  const username = 'user';
  const email = 'email';
  const password = 'pass';
  const loggedUserId = 2;
  const user = {
    id: 1,
    activationLink: 'uuid',
    email,
    username,
    password,
    refreshToken: 'rt',
    avatar: 'ava',
  };
  const tokens = {
    accessToken: 'at',
    refreshToken: 'rt',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw ConflictException', async () => {
      findUniqueSpy.mockResolvedValueOnce(user);
      try {
        await service.signUp({ username, email, password });
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(ERROR_MESSAGES.USER_WITH_EMAIL_EXIST(email));
      }
    });

    it('should create user and return it', async () => {
      findUniqueSpy.mockResolvedValueOnce();
      createSpy.mockResolvedValueOnce(user);
      updateSpy.mockResolvedValueOnce();
      sendActivationMailSpy.mockResolvedValueOnce();
      generateTokensSpy.mockReturnValueOnce(tokens);
      const {
        user: createdUser,
        tokens: generatedTokens,
      } = await service.signUp({ username, email, password });
      expect(createSpy).toBeCalled();
      expect(updateSpy).toBeCalledWith({
        where: { email },
        data: { refreshToken: tokens.refreshToken },
      });
      expect(sendActivationMailSpy).toBeCalled();
      expect(generateTokensSpy).toBeCalled();
      expect(generatedTokens).toEqual(tokens);
      expect(createdUser.email).toBe(user.email);
      expect(createdUser.id).toBe(user.id);
      expect(createdUser.username).toBe(user.username);
    });
  });

  describe('signIn', () => {
    it('should throw BadRequestException when wrong email', async () => {
      findUniqueSpy.mockResolvedValueOnce();
      try {
        await service.signIn({ email, password });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERROR_MESSAGES.WRONG_CREDS);
      }
    });

    it('should throw BadRequestException when wrong password', async () => {
      findUniqueSpy.mockResolvedValueOnce(user);
      try {
        await service.signIn({ email, password });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERROR_MESSAGES.WRONG_CREDS);
      }
    });

    it('should update refresh token and return user and tokens', async () => {
      const hashedPassword = await hash(password, 10);
      user.password = hashedPassword;
      const userDto = new UserDto(user);
      findUniqueSpy.mockResolvedValueOnce(user);
      generateTokensSpy.mockReturnValueOnce(tokens);
      updateSpy.mockResolvedValueOnce();
      const result = await service.signIn({ email, password });
      expect(findUniqueSpy).toBeCalledWith({ where: { email } });
      expect(generateTokensSpy).toBeCalledWith(userDto);
      expect(updateSpy).toBeCalledWith({
        where: { email },
        data: { refreshToken: tokens.refreshToken },
      });
      expect(result).toEqual({ user: userDto, tokens });
    });
  });

  describe('logOut', () => {
    it('should set refreshToken null', async () => {
      updateSpy.mockResolvedValueOnce();
      const result = await service.logOut(email);
      expect(updateSpy).toBeCalledWith({ where: { email }, data: { refreshToken: null } });
      expect(result).toBe();
    });
  });

  describe('activate', () => {
    it('should set isActivated to true', async () => {
      const link = 'link';
      updateSpy.mockResolvedValueOnce();
      const result = await service.activate(link);
      expect(updateSpy).toBeCalledWith({
        where: { activationLink: link },
        data: { isActivated: true },
      });
      expect(result).toBe();
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedRequestException when no token passed', async () => {
      try {
        await service.refresh();
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedRequestException);
      }
    });

    it('should throw UnauthorizedRequestException when invalid token', async () => {
      validateRefreshTokenSpy.mockReturnValueOnce();
      try {
        await service.refresh(tokens.refreshToken);
      } catch (error) {
        expect(validateRefreshTokenSpy).toBeCalledWith(tokens.refreshToken);
        expect(error).toBeInstanceOf(UnauthorizedRequestException);
      }
    });

    it('should set refreshToken null and throw UnauthorizedRequestException whe token is not the same as in DB', async () => {
      user.refreshToken = 'rtt';
      validateRefreshTokenSpy.mockReturnValueOnce(user);
      findUniqueSpy.mockResolvedValueOnce(user);
      updateSpy.mockResolvedValueOnce();
      try {
        await service.refresh(tokens.refreshToken);
      } catch (error) {
        expect(validateRefreshTokenSpy).toBeCalledWith(tokens.refreshToken);
        expect(updateSpy).toBeCalledWith({ where: { id: user.id }, data: { refreshToken: null } });
        expect(error).toBeInstanceOf(UnauthorizedRequestException);
      }
    });

    it('should generate new tokens, save it and return it', async () => {
      user.refreshToken = tokens.refreshToken;
      const userDto = new UserDto(user);
      validateRefreshTokenSpy.mockReturnValueOnce(user);
      findUniqueSpy.mockResolvedValueOnce(user);
      generateTokensSpy.mockReturnValueOnce(tokens);
      updateSpy.mockResolvedValueOnce();
      const result = await service.refresh(tokens.refreshToken);
      expect(validateRefreshTokenSpy).toBeCalledWith(tokens.refreshToken);
      expect(findUniqueSpy).toBeCalledWith({ where: { id: user.id } });
      expect(generateTokensSpy).toBeCalledWith(userDto);
      expect(updateSpy).toBeCalledWith({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });
      expect(result).toEqual({ user: userDto, tokens });
    });
  });

  describe('getById', () => {
    it('should throw BadRequestException when no id passed', async () => {
      try {
        await service.getById();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw NotFoundException when user not found', async () => {
      try {
        findUniqueSpy.mockResolvedValueOnce();
        await service.getById(user.id, loggedUserId);
      } catch (error) {
        expect(findUniqueSpy).toBeCalledWith({
          where: {
            id: user.id,
          },
          include: {
            _count: {
              select: {
                followers: true,
                following: true,
              },
            },
            followers: {
              where: {
                followerUserId: loggedUserId,
              },
            },
          },
        });
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(ERROR_MESSAGES.ENTITY_WITH_ID_DOES_NOT_EXIST('User', user.id));
      }
    });

    it('should return user data', async () => {
      const userData = { ...user, _count: {}, followers: [] };
      const userDto = new UserDto(userData);
      findUniqueSpy.mockResolvedValueOnce(userData);
      const result = await service.getById(user.id, loggedUserId);
      expect(findUniqueSpy).toBeCalledWith({
        where: {
          id: user.id,
        },
        include: {
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
          followers: {
            where: {
              followerUserId: loggedUserId,
            },
          },
        },
      });
      expect(result).toEqual({
        ...userDto, _count: {}, amIFollowing: false,
      });
    });
  });

  describe('updateInfo', () => {
    const bio = 'bio';
    it('should throw BadRequestException when no data passed', async () => {
      try {
        await service.updateInfo();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw NotFoundException when user not found', async () => {
      const newData = {};
      try {
        updateSpy.mockResolvedValueOnce();
        await service.updateInfo({}, user.id);
      } catch (error) {
        expect(updateSpy).toBeCalledWith({ where: { id: user.id }, data: newData });
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(ERROR_MESSAGES.ENTITY_WITH_ID_DOES_NOT_EXIST('User', user.id));
      }
    });

    it('should update info', async () => {
      updateSpy.mockResolvedValueOnce(user);
      const newData = { username, email, bio };
      const result = await service.updateInfo({ username, email, bio }, user.id);
      expect(updateSpy).toBeCalledWith({ where: { id: user.id }, data: newData });
      expect(result).toEqual(new UserDto(user));
    });

    it('shuld update info without username', async () => {
      updateSpy.mockResolvedValueOnce(user);
      const newData = { email, bio };
      const result = await service.updateInfo({ email, bio }, user.id);
      expect(updateSpy).toBeCalledWith({ where: { id: user.id }, data: newData });
      expect(result).toEqual(new UserDto(user));
    });

    it('should update info without email', async () => {
      updateSpy.mockResolvedValueOnce(user);
      const newData = { username, bio };
      const result = await service.updateInfo({ username, bio }, user.id);
      expect(updateSpy).toBeCalledWith({ where: { id: user.id }, data: newData });
      expect(result).toEqual(new UserDto(user));
    });
  });

  describe('updateAvatar', () => {
    const path = 'path';
    it('should throw BadRequestException when no avatar passed', async () => {
      try {
        await service.updateAvatar();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw NotFoundException when user not found', async () => {
      try {
        findUniqueSpy.mockResolvedValueOnce();
        await service.updateAvatar(5, { path });
      } catch (error) {
        expect(findUniqueSpy).toBeCalledWith({ where: { id: 5 } });
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(ERROR_MESSAGES.ENTITY_WITH_ID_DOES_NOT_EXIST('User', 5));
      }
    });

    it('should update avatar', async () => {
      const updatedUser = { ...user, avatar: path };
      findUniqueSpy.mockResolvedValueOnce(user);
      updateSpy.mockResolvedValue(updatedUser);
      const result = await service.updateAvatar(user.id, { path });
      expect(findUniqueSpy).toBeCalledWith({ where: { id: user.id } });
      expect(updateSpy).toBeCalledWith({ where: { id: user.id }, data: { avatar: path } });
      expect(result).toEqual(new UserDto(updatedUser));
    });
  });

  describe('removeAvatar', () => {
    it('should throw NotFoundException when user not found', async () => {
      try {
        findUniqueSpy.mockResolvedValueOnce();
        await service.removeAvatar(5);
      } catch (error) {
        expect(findUniqueSpy).toBeCalledWith({ where: { id: 5 } });
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(ERROR_MESSAGES.ENTITY_WITH_ID_DOES_NOT_EXIST('User', 5));
      }
    });

    it('should delete avatar', async () => {
      const updatedUser = { ...user, avatar: null };
      findUniqueSpy.mockResolvedValueOnce(user);
      updateSpy.mockResolvedValue(updatedUser);
      const result = await service.removeAvatar(user.id);
      expect(findUniqueSpy).toBeCalledWith({ where: { id: user.id } });
      expect(updateSpy).toBeCalledWith({ where: { id: user.id }, data: { avatar: null } });
      expect(result).toEqual(new UserDto(updatedUser));
    });
  });

  describe('updatePassword', () => {
    it('should throw NotFoundException when user not found', async () => {
      try {
        findUniqueSpy.mockResolvedValueOnce();
        await service.updatePassword({ id: user.id });
      } catch (error) {
        expect(findUniqueSpy).toBeCalledWith({ where: { id: user.id } });
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(ERROR_MESSAGES.ENTITY_WITH_ID_DOES_NOT_EXIST('User', user.id));
      }
    });

    it('should throw BadRequestException when wrong password', async () => {
      user.password = password;
      findUniqueSpy.mockResolvedValueOnce(user);
      try {
        await service.updatePassword({ id: user.id, oldPassword: password, newPassword: password });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should update password', async () => {
      const hashedPassword = await hash(password, 10);
      user.password = hashedPassword;
      findUniqueSpy.mockResolvedValueOnce(user);
      updateSpy.mockResolvedValue();
      const result = await service.updatePassword({
        id: user.id,
        oldPassword: password,
        newPassword: password,
      });
      expect(findUniqueSpy).toBeCalledWith({ where: { id: user.id } });
      expect(updateSpy).toBeCalled();
      expect(result).toBe();
    });
  });

  describe('delte', () => {
    it('should throw NotFoundException when user not found', async () => {
      try {
        findUniqueSpy.mockResolvedValueOnce();
        await service.delete(5);
      } catch (error) {
        expect(findUniqueSpy).toBeCalledWith({ where: { id: 5 } });
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(ERROR_MESSAGES.ENTITY_WITH_ID_DOES_NOT_EXIST('User', 5));
      }
    });

    it('should delete user', async () => {
      findUniqueSpy.mockResolvedValueOnce(user);
      deleteSpy.mockResolvedValueOnce();
      await service.delete(5);
      expect(findUniqueSpy).toBeCalledWith({ where: { id: 5 } });
      expect(deleteSpy).toBeCalledWith({ where: { id: 5 } });
    });
  });
});
