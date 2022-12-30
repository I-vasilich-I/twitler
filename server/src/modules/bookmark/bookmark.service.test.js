// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import prisma from '../prisma/prisma.service.js';
import service from './bookmark.service.js';
import { getTweetsIncludeOptions } from '../../helpers';
import { ORDER_BY_TIMESTAMP } from '../../constants';

jest.mock('../prisma/prisma.service.js');

describe('BookmarkService', () => {
  const tweets = ['tweet'];
  const userId = 1;
  const findManySpy = jest.spyOn(prisma.tweet, 'findMany');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTweets', () => {
    it('should retern tweets', async () => {
      findManySpy.mockResolvedValueOnce(tweets);
      const result = await service.getAllTweets(userId);
      expect(findManySpy).toBeCalledWith({
        where: {
          bookmarks: {
            some: {
              userId,
            },
          },
        },
        include: getTweetsIncludeOptions(userId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      });
      expect(result).toEqual(tweets);
    });
  });

  describe('getTweetsWithLikes', () => {
    it('should retern tweets with likes', async () => {
      findManySpy.mockResolvedValueOnce(tweets);
      const result = await service.getTweetsWithLikes(userId);
      expect(findManySpy).toBeCalledWith({
        where: {
          AND: [
            {
              bookmarks: {
                some: {
                  userId,
                },
              },
            },
            {
              tweetLikes: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
        include: getTweetsIncludeOptions(userId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      });
      expect(result).toEqual(tweets);
    });
  });

  describe('getTweetsWithMedia', () => {
    it('should retern tweets with media', async () => {
      findManySpy.mockResolvedValueOnce(tweets);
      const result = await service.getTweetsWithMedia(userId);
      expect(findManySpy).toBeCalledWith({
        where: {
          AND: [
            {
              bookmarks: {
                some: {
                  userId,
                },
              },
            },
            {
              imageLink: {
                not: null,
              },
            },
          ],
        },
        include: getTweetsIncludeOptions(userId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      });
      expect(result).toEqual(tweets);
    });
  });

  describe('getTweetsWithReplies', () => {
    it('should retern tweets with media', async () => {
      findManySpy.mockResolvedValueOnce(tweets);
      const result = await service.getTweetsWithReplies(userId);
      expect(findManySpy).toBeCalledWith({
        where: {
          AND: [
            {
              bookmarks: {
                some: {
                  userId,
                },
              },
            },
            {
              comments: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
        include: getTweetsIncludeOptions(userId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      });
      expect(result).toEqual(tweets);
    });
  });
});
