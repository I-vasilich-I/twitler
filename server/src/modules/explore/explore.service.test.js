// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import prisma from '../prisma/prisma.service.js';
import service from './explore.service.js';
import { getTweetsIncludeOptions } from '../../helpers.js';
import { EXPLORE_FILTERS, ORDER_BY_TIMESTAMP } from '../../constants.js';

jest.mock('../prisma/prisma.service.js');

describe('ExploreService', () => {
  const findManyTweetsSpy = jest.spyOn(prisma.tweet, 'findMany');
  const findManyUserSpy = jest.spyOn(prisma.user, 'findMany');
  const tweets = ['tweet'];
  const loggedUserId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    it('should return tweets when there is no query', async () => {
      findManyTweetsSpy.mockResolvedValueOnce(tweets);
      const options = {
        where: {},
        include: getTweetsIncludeOptions(loggedUserId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      };
      const result = await service.getData(loggedUserId);
      expect(findManyTweetsSpy).toBeCalledWith(options);
      expect(result).toEqual(tweets);
      expect(findManyUserSpy).not.toBeCalled();
    });

    it('should return users when filter is people', async () => {
      const user = {
        followers: [],
        _count: {
          followers: 5,
        },
      };
      const data = [{
        // eslint-disable-next-line dot-notation
        followers: user['_count'].followers,
        amIFollowing: Boolean(user.followers.length),
      }];
      const query = ' ';

      const options = {
        where: {
          username: {
            contains: query,
          },
        },
        select: {
          id: true,
          username: true,
          bio: true,
          avatar: true,
          followers: {
            where: {
              followerUserId: loggedUserId,
            },
          },
          _count: {
            select: {
              followers: true,
            },
          },
        },
      };

      findManyUserSpy.mockResolvedValueOnce([user]);
      const result = await service.getData(loggedUserId, query, EXPLORE_FILTERS.PEOPLE);
      expect(findManyTweetsSpy).not.toBeCalled();
      expect(findManyUserSpy).toBeCalledWith(options);
      expect(result).toEqual(data);
    });

    it('should return top tweets when filter is top', async () => {
      findManyTweetsSpy.mockResolvedValueOnce(tweets);
      const query = ' ';
      const options = {
        where: {
          text: {
            contains: query,
          },
        },
        include: getTweetsIncludeOptions(loggedUserId),
        orderBy: [
          {
            tweetLikes: {
              _count: 'desc',
            },
          },
          ORDER_BY_TIMESTAMP.DESC,
        ],
      };
      const result = await service.getData(loggedUserId, query, EXPLORE_FILTERS.TOP);
      expect(findManyUserSpy).not.toBeCalled();
      expect(findManyTweetsSpy).toBeCalledWith(options);
      expect(result).toEqual(tweets);
    });

    it('should return tweets with media when filter is media', async () => {
      findManyTweetsSpy.mockResolvedValueOnce(tweets);
      const query = ' ';
      const options = {
        where: {
          text: {
            contains: query,
          },
          imageLink: {
            not: null,
          },
        },
        include: getTweetsIncludeOptions(loggedUserId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      };
      const result = await service.getData(loggedUserId, query, EXPLORE_FILTERS.MEDIA);
      expect(findManyUserSpy).not.toBeCalled();
      expect(findManyTweetsSpy).toBeCalledWith(options);
      expect(result).toEqual(tweets);
    });

    it('should return latest tweets when filter is latest', async () => {
      findManyTweetsSpy.mockResolvedValueOnce(tweets);
      const query = ' ';
      const options = {
        where: {
          text: {
            contains: query,
          },
        },
        include: getTweetsIncludeOptions(loggedUserId),
        orderBy: ORDER_BY_TIMESTAMP.DESC,
      };
      const result = await service.getData(loggedUserId, query, EXPLORE_FILTERS.LATEST);
      expect(findManyUserSpy).not.toBeCalled();
      expect(findManyTweetsSpy).toBeCalledWith(options);
      expect(result).toEqual(tweets);
    });
  });
});
