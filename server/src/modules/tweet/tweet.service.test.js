// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import prisma from '../prisma/prisma.service.js';
import service from './tweet.service.js';
import { BadRequestException, NotFoundException } from '../../exceptions/index.js';
import { BOOLEAN_REQ_PARAMS, ERROR_MESSAGES, ORDER_BY_TIMESTAMP } from '../../constants.js';
import { getTweetsIncludeOptions } from '../../helpers.js';

jest.mock('../prisma/prisma.service.js');

describe('TweetService', () => {
  const findUniqueSpy = jest.spyOn(prisma.tweet, 'findUnique');
  const findManySpy = jest.spyOn(prisma.tweet, 'findMany');
  const userId = 1;
  const loggedUserId = 5;
  const tweetId = 2;
  const tweet = 'tweet';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createSpy = jest.spyOn(prisma.tweet, 'create');
    const isPublic = BOOLEAN_REQ_PARAMS.TRUE;
    const text = 'text';
    const path = 'path';

    it('should throw when no data passed', async () => {
      try {
        await service.create({});
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERROR_MESSAGES.NO_DATA_PASSED);
      }
    });

    it('should create tweet and return it', async () => {
      createSpy.mockResolvedValueOnce(tweet);
      const result = await service.create({ text, isPublic }, userId, { path });
      const data = {
        userId,
        isPublic: true,
        text,
        imageLink: path,
      };

      expect(createSpy).toBeCalledWith({ data });
      expect(result).toEqual(tweet);
    });

    it('should create tweet without text and return it', async () => {
      createSpy.mockResolvedValueOnce(tweet);
      const result = await service.create({ isPublic }, userId, { path });
      const data = {
        userId,
        isPublic: true,
        imageLink: path,
      };

      expect(createSpy).toBeCalledWith({ data });
      expect(result).toEqual(tweet);
    });

    it('should create tweet without image and return it', async () => {
      createSpy.mockResolvedValueOnce(tweet);
      const result = await service.create({ text, isPublic }, userId, {});
      const data = {
        userId,
        isPublic: true,
        text,
      };

      expect(createSpy).toBeCalledWith({ data });
      expect(result).toEqual(tweet);
    });
  });

  describe('delete', () => {
    const deleteSpy = jest.spyOn(prisma.tweet, 'delete');

    it('should throw NotFoundException', async () => {
      findUniqueSpy.mockResolvedValueOnce();
      try {
        await service.delete(userId, tweetId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(ERROR_MESSAGES.ENTITY_WITH_ID_DOES_NOT_EXIST('Tweet', tweetId));
      }
    });

    it('should throw BadRequestException', async () => {
      findUniqueSpy.mockResolvedValueOnce({ userId: userId + 1 });
      try {
        await service.delete(userId, tweetId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should delete tweet', async () => {
      findUniqueSpy.mockResolvedValueOnce({ userId });
      deleteSpy.mockResolvedValueOnce();
      await service.delete(userId, tweetId);
      expect(findUniqueSpy).toBeCalledWith({ where: { id: tweetId } });
      expect(deleteSpy).toBeCalledWith({ where: { id: tweetId } });
    });
  });

  describe('react', () => {
    it('should throw NotFoundException', async () => {
      findUniqueSpy.mockResolvedValueOnce();
      try {
        await service.react(userId, tweetId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(ERROR_MESSAGES.ENTITY_WITH_ID_DOES_NOT_EXIST('Tweet', tweetId));
      }
    });

    it('should throw BadRequestException', async () => {
      findUniqueSpy.mockResolvedValueOnce(tweet);
      try {
        await service.react(userId, tweetId, { like: 'likeee' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERROR_MESSAGES.WRONG_QUERY);
      }
    });

    it('should call handleRetweet', async () => {
      findUniqueSpy.mockResolvedValueOnce(tweet);
      const handleRetweetSpy = jest.spyOn(service, 'handleRetweet');
      handleRetweetSpy.mockResolvedValueOnce();
      await service.react(userId, tweetId, { retweet: BOOLEAN_REQ_PARAMS.TRUE });
      expect(handleRetweetSpy).toBeCalledWith(userId, tweetId, true);
    });

    it('should call handleLike', async () => {
      findUniqueSpy.mockResolvedValueOnce(tweet);
      const handleLikeSpy = jest.spyOn(service, 'handleLike');
      handleLikeSpy.mockResolvedValueOnce();
      await service.react(userId, tweetId, { like: BOOLEAN_REQ_PARAMS.TRUE });
      expect(handleLikeSpy).toBeCalledWith(userId, tweetId, true);
    });

    it('should call handleSave', async () => {
      findUniqueSpy.mockResolvedValueOnce(tweet);
      const handleSaveSpy = jest.spyOn(service, 'handleSave');
      handleSaveSpy.mockResolvedValueOnce();
      await service.react(userId, tweetId, { save: BOOLEAN_REQ_PARAMS.TRUE });
      expect(handleSaveSpy).toBeCalledWith(userId, tweetId, true);
    });
  });

  describe('handleRetweet', () => {
    const findFirstSpy = jest.spyOn(prisma.retweet, 'findFirst');
    const createSpy = jest.spyOn(prisma.retweet, 'create');
    const deleteSpy = jest.spyOn(prisma.retweet, 'delete');
    const retweet = 'retweet';

    describe('reaction is true', () => {
      it('should not create retweet when it already exist in DB', async () => {
        findFirstSpy.mockResolvedValueOnce(retweet);
        await service.handleRetweet(userId, tweetId, true);
        expect(findFirstSpy).toBeCalledWith({ where: { userId, tweetId } });
        expect(createSpy).not.toBeCalled();
        expect(deleteSpy).not.toBeCalled();
      });

      it('should create retweet', async () => {
        findFirstSpy.mockResolvedValueOnce();
        createSpy.mockResolvedValueOnce(retweet);
        await service.handleRetweet(userId, tweetId, true);
        expect(findFirstSpy).toBeCalledWith({ where: { userId, tweetId } });
        expect(createSpy).toBeCalledWith({ data: { userId, tweetId } });
        expect(deleteSpy).not.toBeCalled();
      });
    });

    describe('reaction is false', () => {
      it('should delete retweet when it exist in DB', async () => {
        const retweet1 = {
          id: 1,
        };

        findFirstSpy.mockResolvedValueOnce(retweet1);
        deleteSpy.mockResolvedValueOnce();
        await service.handleRetweet(userId, tweetId, false);
        expect(deleteSpy).toBeCalledWith({ where: { id: retweet1.id } });
        expect(createSpy).not.toBeCalled();
      });

      it('should not create nor delete if retweet is not in DB', async () => {
        findFirstSpy.mockResolvedValueOnce();
        await service.handleRetweet(userId, tweetId, false);
        expect(createSpy).not.toBeCalled();
        expect(deleteSpy).not.toBeCalled();
      });
    });
  });

  describe('handleLike', () => {
    const findFirstSpy = jest.spyOn(prisma.tweetLike, 'findFirst');
    const createSpy = jest.spyOn(prisma.tweetLike, 'create');
    const deleteSpy = jest.spyOn(prisma.tweetLike, 'delete');
    const tweetLike = 'tweetLike';

    describe('reaction is true', () => {
      it('should not create tweet like when it already exist in DB', async () => {
        findFirstSpy.mockResolvedValueOnce(tweetLike);
        await service.handleLike(userId, tweetId, true);
        expect(findFirstSpy).toBeCalledWith({ where: { userId, tweetId } });
        expect(createSpy).not.toBeCalled();
        expect(deleteSpy).not.toBeCalled();
      });

      it('should create tweet like', async () => {
        findFirstSpy.mockResolvedValueOnce();
        createSpy.mockResolvedValueOnce(tweetLike);
        await service.handleLike(userId, tweetId, true);
        expect(findFirstSpy).toBeCalledWith({ where: { userId, tweetId } });
        expect(createSpy).toBeCalledWith({ data: { userId, tweetId } });
        expect(deleteSpy).not.toBeCalled();
      });
    });

    describe('reaction is false', () => {
      it('should delete tweet like when it exist in DB', async () => {
        const tweetLike1 = {
          id: 1,
        };

        findFirstSpy.mockResolvedValueOnce(tweetLike1);
        deleteSpy.mockResolvedValueOnce();
        await service.handleLike(userId, tweetId, false);
        expect(deleteSpy).toBeCalledWith({ where: { id: tweetLike1.id } });
        expect(createSpy).not.toBeCalled();
      });

      it('should not create nor delete if tweet like is not in DB', async () => {
        findFirstSpy.mockResolvedValueOnce();
        await service.handleLike(userId, tweetId, false);
        expect(createSpy).not.toBeCalled();
        expect(deleteSpy).not.toBeCalled();
      });
    });
  });

  describe('handleSave', () => {
    const findFirstSpy = jest.spyOn(prisma.bookmark, 'findFirst');
    const createSpy = jest.spyOn(prisma.bookmark, 'create');
    const deleteSpy = jest.spyOn(prisma.bookmark, 'delete');
    const save = 'save';

    describe('reaction is true', () => {
      it('should not create bookmark when it already exist in DB', async () => {
        findFirstSpy.mockResolvedValueOnce(save);
        await service.handleSave(userId, tweetId, true);
        expect(findFirstSpy).toBeCalledWith({ where: { userId, tweetId } });
        expect(createSpy).not.toBeCalled();
        expect(deleteSpy).not.toBeCalled();
      });

      it('should create bookmark', async () => {
        findFirstSpy.mockResolvedValueOnce();
        createSpy.mockResolvedValueOnce(save);
        await service.handleSave(userId, tweetId, true);
        expect(findFirstSpy).toBeCalledWith({ where: { userId, tweetId } });
        expect(createSpy).toBeCalledWith({ data: { userId, tweetId } });
        expect(deleteSpy).not.toBeCalled();
      });
    });

    describe('reaction is false', () => {
      it('should delete bookmark when it exist in DB', async () => {
        const save1 = {
          id: 1,
        };

        findFirstSpy.mockResolvedValueOnce(save1);
        deleteSpy.mockResolvedValueOnce();
        await service.handleSave(userId, tweetId, false);
        expect(deleteSpy).toBeCalledWith({ where: { id: save1.id } });
        expect(createSpy).not.toBeCalled();
      });

      it('should not create nor delete if bookmark is not in DB', async () => {
        findFirstSpy.mockResolvedValueOnce();
        await service.handleSave(userId, tweetId, false);
        expect(createSpy).not.toBeCalled();
        expect(deleteSpy).not.toBeCalled();
      });
    });
  });

  describe('getAllByUserId', () => {
    it('should return all user tweets an retweets', async () => {
      findManySpy.mockResolvedValueOnce([tweet]);
      const result = await service.getAllByUserId(userId, loggedUserId);
      expect(findManySpy).toBeCalledWith({
        where: {
          OR: [
            { userId },
            {
              retweets: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
        include: getTweetsIncludeOptions(loggedUserId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      });
      expect(result).toEqual([tweet]);
    });
  });

  describe('getAllWithLikesByUserId', () => {
    it('should return all tweets with user likes', async () => {
      findManySpy.mockResolvedValueOnce([tweet]);
      const result = await service.getAllWithLikesByUserId(userId, loggedUserId);
      expect(findManySpy).toBeCalledWith({
        where: {
          tweetLikes: {
            some: {
              userId,
            },
          },
        },
        include: getTweetsIncludeOptions(loggedUserId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      });
      expect(result).toEqual([tweet]);
    });
  });

  describe('getAllWithMediaByUserId', () => {
    it('should return all user tweets with media', async () => {
      findManySpy.mockResolvedValueOnce([tweet]);
      const result = await service.getAllWithMediaByUserId(userId, loggedUserId);
      expect(findManySpy).toBeCalledWith({
        where: {
          userId,
          imageLink: {
            not: null,
          },
        },
        include: getTweetsIncludeOptions(loggedUserId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      });
      expect(result).toEqual([tweet]);
    });
  });

  describe('getAllWithRepliesByUserId', () => {
    it('should return all tweets with user replies', async () => {
      findManySpy.mockResolvedValueOnce([tweet]);
      const result = await service.getAllWithRepliesByUserId(userId, loggedUserId);
      expect(findManySpy).toBeCalledWith({
        where: {
          comments: {
            some: {
              userId,
            },
          },
        },
        include: getTweetsIncludeOptions(loggedUserId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      });
      expect(result).toEqual([tweet]);
    });
  });

  describe('getAllFollowingTweets', () => {
    it('should return all user tweets and tweets of people user follows', async () => {
      findManySpy.mockResolvedValueOnce([tweet]);
      const result = await service.getAllFollowingTweets(userId, loggedUserId);
      expect(findManySpy).toBeCalledWith({
        where: {
          OR: [
            { userId },
            {
              User: {
                followers: {
                  some: {
                    followerUserId: userId,
                  },
                },
              },
            },
          ],
        },
        include: getTweetsIncludeOptions(userId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      });
      expect(result).toEqual([tweet]);
    });
  });
});
