// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import service from './user.service.js';
import controller from './user.controller.js';
import CreateUserDto from './dto/create-user.dto.js';
import { COOKIES, MAX_AGE_REFRESH_TOKEN_COOKIE, STATUS_CODES } from '../../constants';

jest.mock('express-validator');
jest.mock('./user.service.js');

describe('UserController', () => {
  const requestMock = {
    user: {
      id: 1,
      email: 'email',
    },
    params: {
      userId: 4,
      tweetId: 2,
      commentId: 3,
      link: 'link',
    },
    file: {},
    body: {
      text: 'text',
    },
    query: {
      like: true,
    },
    cookies: {
      refreshToken: 'rt',
    },
  };
  const userData = {
    tokens: {
      accessToken: 'at',
      refreshToken: 'rt',
    },
    user: 'user',
  };
  const responseMock = {
    json: jest.fn(),
    status: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    redirect: jest.fn(),
  };
  const nextMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defind', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    const signUpSpy = jest.spyOn(service, 'signUp');
    const userDto = new CreateUserDto(requestMock.body);
    const cookieOptions = { maxAge: MAX_AGE_REFRESH_TOKEN_COOKIE, httpOnly: true };

    it('should call signUp service and return user data', async () => {
      signUpSpy.mockResolvedValueOnce(userData);
      await controller.signUp(requestMock, responseMock, nextMock);
      expect(signUpSpy).toBeCalledWith(userDto);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.cookie).toBeCalledWith(
        COOKIES.REFRESH_TOKEN,
        userData.tokens.refreshToken,
        cookieOptions,
      );
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.CREATED);
      expect(responseMock.json).toBeCalledWith(userData);
    });

    it('should call next on error', async () => {
      signUpSpy.mockRejectedValueOnce(null);
      await controller.signUp(requestMock, responseMock, nextMock);
      expect(signUpSpy).toBeCalledWith(userDto);
      expect(responseMock.cookie).not.toBeCalled();
      expect(responseMock.status).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('signIn', () => {
    const signInSpy = jest.spyOn(service, 'signIn');
    const userDto = new CreateUserDto(requestMock.body);
    const cookieOptions = { maxAge: MAX_AGE_REFRESH_TOKEN_COOKIE, httpOnly: true };

    it('should call signIn service and return user data', async () => {
      signInSpy.mockResolvedValueOnce(userData);
      await controller.signIn(requestMock, responseMock, nextMock);
      expect(signInSpy).toBeCalledWith(userDto);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.cookie).toBeCalledWith(
        COOKIES.REFRESH_TOKEN,
        userData.tokens.refreshToken,
        cookieOptions,
      );
      expect(responseMock.json).toBeCalledWith(userData);
    });

    it('should call next on error', async () => {
      signInSpy.mockRejectedValueOnce(null);
      await controller.signIn(requestMock, responseMock, nextMock);
      expect(signInSpy).toBeCalledWith(userDto);
      expect(responseMock.cookie).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('logOut', () => {
    const logOutSpy = jest.spyOn(service, 'logOut');
    const { user: { email } } = requestMock;

    it('should call logOut service', async () => {
      logOutSpy.mockResolvedValueOnce();
      await controller.logOut(requestMock, responseMock, nextMock);
      expect(logOutSpy).toBeCalledWith(email);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.clearCookie).toBeCalledWith(COOKIES.REFRESH_TOKEN);
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.NO_CONTENT);
      expect(responseMock.json).toBeCalledWith();
    });

    it('should call next on error', async () => {
      logOutSpy.mockRejectedValueOnce(null);
      await controller.logOut(requestMock, responseMock, nextMock);
      expect(logOutSpy).toBeCalledWith(email);
      expect(responseMock.clearCookie).not.toBeCalled();
      expect(responseMock.status).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('activate', () => {
    const activateSpy = jest.spyOn(service, 'activate');
    const { params: { link } } = requestMock;

    it('should call activate service and redirect', async () => {
      activateSpy.mockResolvedValueOnce();
      await controller.activate(requestMock, responseMock, nextMock);
      expect(activateSpy).toBeCalledWith(link);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.redirect).toBeCalled();
    });

    it('should call next on error', async () => {
      activateSpy.mockRejectedValueOnce(null);
      await controller.activate(requestMock, responseMock, nextMock);
      expect(activateSpy).toBeCalledWith(link);
      expect(responseMock.redirect).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('refresh', () => {
    const refreshSpy = jest.spyOn(service, 'refresh');
    const { cookies: { refreshToken } } = requestMock;
    const cookieOptions = { maxAge: MAX_AGE_REFRESH_TOKEN_COOKIE, httpOnly: true };

    it('should call refresh service and return user data', async () => {
      refreshSpy.mockResolvedValueOnce(userData);
      await controller.refresh(requestMock, responseMock, nextMock);
      expect(refreshSpy).toBeCalledWith(refreshToken);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.cookie).toBeCalledWith(
        COOKIES.REFRESH_TOKEN,
        userData.tokens.refreshToken,
        cookieOptions,
      );
      expect(responseMock.json).toBeCalledWith(userData);
    });

    it('should call next on error', async () => {
      refreshSpy.mockRejectedValueOnce(null);
      await controller.refresh(requestMock, responseMock, nextMock);
      expect(refreshSpy).toBeCalledWith(refreshToken);
      expect(responseMock.cookie).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('getById', () => {
    const getByIdSpy = jest.spyOn(service, 'getById');
    const { params: { id }, user: { id: loggedUserId } } = requestMock;

    it('should call getById service and return user data', async () => {
      getByIdSpy.mockResolvedValueOnce(userData);
      await controller.getById(requestMock, responseMock, nextMock);
      expect(getByIdSpy).toBeCalledWith(Number(id), loggedUserId);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(userData);
    });

    it('should call next on error', async () => {
      getByIdSpy.mockRejectedValueOnce(null);
      await controller.getById(requestMock, responseMock, nextMock);
      expect(getByIdSpy).toBeCalledWith(Number(id), loggedUserId);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('updateInfo', () => {
    const updateInfoSpy = jest.spyOn(service, 'updateInfo');
    const { body, user: { id } } = requestMock;

    it('should call updateInfo service and return user data', async () => {
      updateInfoSpy.mockResolvedValueOnce(userData);
      await controller.updateInfo(requestMock, responseMock, nextMock);
      expect(updateInfoSpy).toBeCalledWith(body, id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(userData);
    });

    it('should call next on error', async () => {
      updateInfoSpy.mockRejectedValueOnce(null);
      await controller.updateInfo(requestMock, responseMock, nextMock);
      expect(updateInfoSpy).toBeCalledWith(body, id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('updateAvatar', () => {
    const updateAvatarSpy = jest.spyOn(service, 'updateAvatar');
    const { user: { id }, file } = requestMock;

    it('should call updateAvatar service and return user data', async () => {
      updateAvatarSpy.mockResolvedValueOnce(userData);
      await controller.updateAvatar(requestMock, responseMock, nextMock);
      expect(updateAvatarSpy).toBeCalledWith(id, file);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(userData);
    });

    it('should call next on error', async () => {
      updateAvatarSpy.mockRejectedValueOnce(null);
      await controller.updateAvatar(requestMock, responseMock, nextMock);
      expect(updateAvatarSpy).toBeCalledWith(id, file);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('removeAvatar', () => {
    const removeAvatarSpy = jest.spyOn(service, 'removeAvatar');
    const { user: { id } } = requestMock;

    it('should call removeAvatar service and return user data', async () => {
      removeAvatarSpy.mockResolvedValueOnce(userData);
      await controller.removeAvatar(requestMock, responseMock, nextMock);
      expect(removeAvatarSpy).toBeCalledWith(id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(userData);
    });

    it('should call next on error', async () => {
      removeAvatarSpy.mockRejectedValueOnce(null);
      await controller.removeAvatar(requestMock, responseMock, nextMock);
      expect(removeAvatarSpy).toBeCalledWith(id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('updatePassword', () => {
    const updatePasswordSpy = jest.spyOn(service, 'updatePassword');
    const { user: { id }, body } = requestMock;

    it('should call updatePassword service', async () => {
      updatePasswordSpy.mockResolvedValueOnce();
      await controller.updatePassword(requestMock, responseMock, nextMock);
      expect(updatePasswordSpy).toBeCalledWith({ id, ...body });
      expect(nextMock).not.toBeCalled();
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.NO_CONTENT);
      expect(responseMock.json).toBeCalledWith();
    });

    it('should call next on error', async () => {
      updatePasswordSpy.mockRejectedValueOnce(null);
      await controller.updatePassword(requestMock, responseMock, nextMock);
      expect(updatePasswordSpy).toBeCalledWith({ id, ...body });
      expect(responseMock.status).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('delete', () => {
    const deleteSpy = jest.spyOn(service, 'delete');
    const { user: { id } } = requestMock;

    it('should call delete service', async () => {
      deleteSpy.mockResolvedValueOnce();
      await controller.delete(requestMock, responseMock, nextMock);
      expect(deleteSpy).toBeCalledWith(id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.NO_CONTENT);
      expect(responseMock.json).toBeCalledWith();
    });

    it('should call next on error', async () => {
      deleteSpy.mockRejectedValueOnce(null);
      await controller.delete(requestMock, responseMock, nextMock);
      expect(deleteSpy).toBeCalledWith(id);
      expect(responseMock.status).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });
});
