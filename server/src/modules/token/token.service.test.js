// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import jwt from 'jsonwebtoken';
import { TOKEN_TYPES } from '../../constants';
import service from './token.service.js';

const env = {
  JWT_SECRET_KEY: 'access-secret',
  JWT_SECRET_REFRESH_KEY: 'refresh-secret',
  TOKEN_EXPIRE_TIME: '1d',
  TOKEN_REFRESH_EXPIRE_TIME: '30d',
};

describe('TokenService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...process.env, ...env };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokens', () => {
    const signSpy = jest.spyOn(jwt, 'sign');
    const payload = { id: 1, email: 'email', isActivated: false };

    it('should generate pair of tokens', () => {
      signSpy.mockReturnValueOnce('at').mockReturnValueOnce('rt');
      const result = service.generateTokens(payload);
      expect(signSpy).toBeCalledWith(
        payload,
        env.JWT_SECRET_KEY,
        { expiresIn: env.TOKEN_EXPIRE_TIME },
      );
      expect(signSpy).toHaveBeenLastCalledWith(
        payload,
        env.JWT_SECRET_REFRESH_KEY,
        { expiresIn: env.TOKEN_REFRESH_EXPIRE_TIME },
      );
      expect(result).toEqual({ accessToken: 'at', refreshToken: 'rt' });
    });
  });

  describe('validateToken', () => {
    const verifySpy = jest.spyOn(jwt, 'verify');

    it('should return data when token valid', () => {
      verifySpy.mockReturnValueOnce('data');
      const result = service.validateToken('token');
      expect(verifySpy).toBeCalledWith('token', env.JWT_SECRET_KEY);
      expect(result).toBe('data');
    });

    it('should return null when token invalid', () => {
      verifySpy.mockImplementation(() => { throw new Error(); });
      const result = service.validateToken('token', TOKEN_TYPES.REFRESH);
      expect(verifySpy).toBeCalledWith('token', env.JWT_SECRET_REFRESH_KEY);
      expect(result).toBe(null);
    });
  });

  describe('validateAccessToken', () => {
    const validateTokenSpy = jest.spyOn(service, 'validateToken');

    it('should return call to validateToken method with one argument - token', () => {
      validateTokenSpy.mockReturnValueOnce('data');
      const result = service.validateAccessToken('token');
      expect(validateTokenSpy).toBeCalledWith('token');
      expect(result).toBe('data');
    });
  });

  describe('validateRefreshToken', () => {
    const validateTokenSpy = jest.spyOn(service, 'validateToken');

    it('should return call to validateToken method with two arguments - token, token type', () => {
      validateTokenSpy.mockReturnValueOnce('data');
      const result = service.validateRefreshToken('token');
      expect(validateTokenSpy).toBeCalledWith('token', TOKEN_TYPES.REFRESH);
      expect(result).toBe('data');
    });
  });
});
