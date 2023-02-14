// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import prisma from '../prisma/prisma.service.js';
import service from './follow.service.js';
import { getFollowSelectOptions } from '../../helpers.js';
import { BadRequestException } from '../../exceptions/index.js';
import { ERROR_MESSAGES, FOLLOW_TYPES } from '../../constants.js';

jest.mock('../prisma/prisma.service.js');

describe('FollowService', () => {
  const userId = 1;
  const loggedUserId = 2;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllFollowers', () => {
    it('should return all followers', async () => {
      const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique');
      const user = {
        followers: [
          {
            Follower: {
              _count: {
                followers: 5,
              },
              followers: [],
            },
          },
        ],
      };
      const data = [
        {
          followers: 5,
          amIFollowing: false,
        },
      ];
      findUniqueSpy.mockResolvedValueOnce(user);
      const result = await service.getAllFollowers(userId, loggedUserId);
      expect(findUniqueSpy).toBeCalledWith({
        where: {
          id: userId,
        },
        select: {
          username: true,
          followers: {
            select: {
              Follower: {
                select: getFollowSelectOptions(loggedUserId),
              },
            },
          },
        },
      });
      expect(result).toEqual({ data });
    });
  });

  describe('getAllFollowing', () => {
    it('should return all following', async () => {
      const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique');
      const user = {
        following: [
          {
            Following: {
              _count: {
                followers: 5,
              },
              followers: [],
            },
          },
        ],
      };
      const data = [
        {
          followers: 5,
          amIFollowing: false,
        },
      ];
      findUniqueSpy.mockResolvedValueOnce(user);
      const result = await service.getAllFollowing(userId, loggedUserId);
      expect(findUniqueSpy).toBeCalledWith({
        where: {
          id: userId,
        },
        select: {
          username: true,
          following: {
            select: {
              Following: {
                select: getFollowSelectOptions(loggedUserId),
              },
            },
          },
        },
      });
      expect(result).toEqual({ data });
    });
  });

  describe('handleFollow', () => {
    const followSpy = jest.spyOn(service, 'follow');
    const unfollowSpy = jest.spyOn(service, 'unfollow');
    const user = 'user';

    it('should throw BadRequestException when followerId = followingId', async () => {
      try {
        await service.handleFollow(1, 1);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERROR_MESSAGES.CAN_NOT_FOLLOW_YOURSELF);
      }
    });

    it('should call follow method when type is follow', async () => {
      followSpy.mockResolvedValueOnce(user);
      const result = await service.handleFollow(1, 2, FOLLOW_TYPES.FOLLOW);
      expect(unfollowSpy).not.toBeCalled();
      expect(followSpy).toBeCalledWith(1, 2);
      expect(result).toEqual(user);
    });

    it('should call unfollow method when type is unfollow', async () => {
      unfollowSpy.mockResolvedValueOnce();
      const result = await service.handleFollow(1, 2, FOLLOW_TYPES.UNFOLLOW);
      expect(followSpy).not.toBeCalled();
      expect(unfollowSpy).toBeCalledWith(1, 2);
      expect(result).toEqual(null);
    });

    it('should throw BadRequestException on wrong follow type', async () => {
      try {
        await service.handleFollow(1, 2);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERROR_MESSAGES.WRONG_FOLLOW_TYPE);
      }
    });
  });

  describe('follow', () => {
    const findFirstSpy = jest.spyOn(prisma.follow, 'findFirst');
    const createSpy = jest.spyOn(prisma.follow, 'create');
    const user = 'user';
    const followerUserId = 1;
    const followingUserId = 2;

    it('should return follower from DB when it already exist', async () => {
      findFirstSpy.mockResolvedValueOnce(user);
      const result = await service.follow(followerUserId, followingUserId);
      expect(findFirstSpy).toBeCalledWith({ where: { followerUserId, followingUserId } });
      expect(createSpy).not.toBeCalled();
      expect(result).toEqual(user);
    });

    it('should create follower when it does not exist in DB', async () => {
      findFirstSpy.mockResolvedValueOnce();
      createSpy.mockResolvedValueOnce(user);
      const result = await service.follow(followerUserId, followingUserId);
      expect(findFirstSpy).toBeCalledWith({ where: { followerUserId, followingUserId } });
      expect(createSpy).toBeCalledWith({ data: { followerUserId, followingUserId } });
      expect(result).toEqual(user);
    });
  });

  describe('unfollow', () => {
    const findFirstSpy = jest.spyOn(prisma.follow, 'findFirst');
    const deleteSpy = jest.spyOn(prisma.follow, 'delete');
    const user = {
      id: 3,
    };
    const followerUserId = 1;
    const followingUserId = 2;

    it('should delete follower from DB', async () => {
      findFirstSpy.mockResolvedValueOnce(user);
      deleteSpy.mockResolvedValueOnce();
      const result = await service.unfollow(followerUserId, followingUserId);
      expect(findFirstSpy).toBeCalledWith({ where: { followerUserId, followingUserId } });
      expect(deleteSpy).toBeCalledWith({ where: { id: user.id } });
      expect(result).toBe();
    });

    it('should throw BadRequestException when not following', async () => {
      findFirstSpy.mockResolvedValueOnce();
      try {
        await service.unfollow(followerUserId, followingUserId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERROR_MESSAGES.CAN_UNFOLLOW_WHEN_FOLLOWING);
      }
    });
  });
});
