// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import service from './tweet.service.js';
import controller from './tweet.controller.js';
import { STATUS_CODES } from '../../constants';

jest.mock('./tweet.service.js');

describe('TweetController', () => {
  const requestMock = {
    user: {
      id: 1,
    },
    params: {
      userId: 4,
      tweetId: 2,
      commentId: 3,
    },
    file: {},
    body: {
      text: 'text',
    },
    query: {
      like: true,
    },
  };
  const responseMock = {
    json: jest.fn(),
    status: jest.fn(),
  };
  const nextMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defind', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createSpy = jest.spyOn(service, 'create');
    const { file, user, body } = requestMock;
    const tweet = 'tweet';

    it('should call create service and return tweet', async () => {
      createSpy.mockResolvedValueOnce(tweet);
      await controller.create(requestMock, responseMock, nextMock);
      expect(createSpy).toBeCalledWith(body, user.id, file);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.CREATED);
      expect(responseMock.json).toBeCalledWith(tweet);
    });

    it('should call next on error', async () => {
      createSpy.mockRejectedValueOnce(null);
      await controller.create(requestMock, responseMock, nextMock);
      expect(createSpy).toBeCalledWith(body, user.id, file);
      expect(responseMock.status).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('delete', () => {
    const deleteSpy = jest.spyOn(service, 'delete');
    const { user, params } = requestMock;

    it('should call delete service', async () => {
      deleteSpy.mockResolvedValueOnce();
      await controller.delete(requestMock, responseMock, nextMock);
      expect(deleteSpy).toBeCalledWith(user.id, params.tweetId);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.NO_CONTENT);
      expect(responseMock.json).toBeCalledWith();
    });

    it('should call next on error', async () => {
      deleteSpy.mockRejectedValueOnce(null);
      await controller.delete(requestMock, responseMock, nextMock);
      expect(deleteSpy).toBeCalledWith(user.id, params.tweetId);
      expect(responseMock.status).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('react', () => {
    const reactSpy = jest.spyOn(service, 'react');
    const { user, params, query } = requestMock;

    it('should call react service', async () => {
      reactSpy.mockResolvedValueOnce();
      await controller.react(requestMock, responseMock, nextMock);
      expect(reactSpy).toBeCalledWith(user.id, params.tweetId, query);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.NO_CONTENT);
      expect(responseMock.json).toBeCalledWith();
    });

    it('should call next on error', async () => {
      reactSpy.mockRejectedValueOnce(null);
      await controller.react(requestMock, responseMock, nextMock);
      expect(reactSpy).toBeCalledWith(user.id, params.tweetId, query);
      expect(responseMock.status).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('getAllByUserId', () => {
    const getAllByUserIdSpy = jest.spyOn(service, 'getAllByUserId');
    const { user, params } = requestMock;
    const tweets = ['tweet'];

    it('should call getAllByUserId service and return tweets', async () => {
      getAllByUserIdSpy.mockResolvedValueOnce(tweets);
      await controller.getAllByUserId(requestMock, responseMock, nextMock);
      expect(getAllByUserIdSpy).toBeCalledWith(params.userId, user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(tweets);
    });

    it('should call next on error', async () => {
      getAllByUserIdSpy.mockRejectedValueOnce(null);
      await controller.getAllByUserId(requestMock, responseMock, nextMock);
      expect(getAllByUserIdSpy).toBeCalledWith(params.userId, user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('getAllWithLikesByUserId', () => {
    const getAllWithLikesByUserIdSpy = jest.spyOn(service, 'getAllWithLikesByUserId');
    const { user, params } = requestMock;
    const tweets = ['tweet'];

    it('should call getAllWithLikesByUserId service and return tweets', async () => {
      getAllWithLikesByUserIdSpy.mockResolvedValueOnce(tweets);
      await controller.getAllWithLikesByUserId(requestMock, responseMock, nextMock);
      expect(getAllWithLikesByUserIdSpy).toBeCalledWith(params.userId, user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(tweets);
    });

    it('should call next on error', async () => {
      getAllWithLikesByUserIdSpy.mockRejectedValueOnce(null);
      await controller.getAllWithLikesByUserId(requestMock, responseMock, nextMock);
      expect(getAllWithLikesByUserIdSpy).toBeCalledWith(params.userId, user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('getAllWithMediaByUserId', () => {
    const getAllWithMediaByUserIdSpy = jest.spyOn(service, 'getAllWithMediaByUserId');
    const { user, params } = requestMock;
    const tweets = ['tweet'];

    it('should call getAllWithMediaByUserId service and return tweets', async () => {
      getAllWithMediaByUserIdSpy.mockResolvedValueOnce(tweets);
      await controller.getAllWithMediaByUserId(requestMock, responseMock, nextMock);
      expect(getAllWithMediaByUserIdSpy).toBeCalledWith(params.userId, user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(tweets);
    });

    it('should call next on error', async () => {
      getAllWithMediaByUserIdSpy.mockRejectedValueOnce(null);
      await controller.getAllWithMediaByUserId(requestMock, responseMock, nextMock);
      expect(getAllWithMediaByUserIdSpy).toBeCalledWith(params.userId, user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('getAllWithRepliesByUserId', () => {
    const getAllWithRepliesByUserIdSpy = jest.spyOn(service, 'getAllWithRepliesByUserId');
    const { user, params } = requestMock;
    const tweets = ['tweet'];

    it('should call getAllWithRepliesByUserId service and return tweets', async () => {
      getAllWithRepliesByUserIdSpy.mockResolvedValueOnce(tweets);
      await controller.getAllWithRepliesByUserId(requestMock, responseMock, nextMock);
      expect(getAllWithRepliesByUserIdSpy).toBeCalledWith(params.userId, user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(tweets);
    });

    it('should call next on error', async () => {
      getAllWithRepliesByUserIdSpy.mockRejectedValueOnce(null);
      await controller.getAllWithRepliesByUserId(requestMock, responseMock, nextMock);
      expect(getAllWithRepliesByUserIdSpy).toBeCalledWith(params.userId, user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('getAllFollowingTweets', () => {
    const getAllFollowingTweetsSpy = jest.spyOn(service, 'getAllFollowingTweets');
    const { user } = requestMock;
    const tweets = ['tweet'];

    it('should call getAllFollowingTweets service and return tweets', async () => {
      getAllFollowingTweetsSpy.mockResolvedValueOnce(tweets);
      await controller.getAllFollowingTweets(requestMock, responseMock, nextMock);
      expect(getAllFollowingTweetsSpy).toBeCalledWith(user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(tweets);
    });

    it('should call next on error', async () => {
      getAllFollowingTweetsSpy.mockRejectedValueOnce(null);
      await controller.getAllFollowingTweets(requestMock, responseMock, nextMock);
      expect(getAllFollowingTweetsSpy).toBeCalledWith(user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });
});
