// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import service from './bookmark.service.js';
import controller from './bookmark.controller.js';

jest.mock('./bookmark.service.js');

describe('BookmarkController', () => {
  const requestMock = {
    user: {
      id: 1,
    },
  };
  const tweets = ['tweet'];
  const responseMock = {
    json: jest.fn(),
  };
  const nextMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllTweets', () => {
    const getAllTweetsSpy = jest.spyOn(service, 'getAllTweets');

    it('should call getAllTweets service and return tweets', async () => {
      getAllTweetsSpy.mockResolvedValueOnce(tweets);
      await controller.getAllTweets(requestMock, responseMock, nextMock);
      expect(getAllTweetsSpy).toBeCalledWith(requestMock.user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(tweets);
    });

    it('should call next on error', async () => {
      getAllTweetsSpy.mockRejectedValueOnce(null);
      await controller.getAllTweets(requestMock, responseMock, nextMock);
      expect(getAllTweetsSpy).toBeCalledWith(requestMock.user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('getTweetsWithLikes', () => {
    const getTweetsWithLikesSpy = jest.spyOn(service, 'getTweetsWithLikes');

    it('should call getTweetsWithLikes service and return tweets', async () => {
      getTweetsWithLikesSpy.mockResolvedValueOnce(tweets);
      await controller.getTweetsWithLikes(requestMock, responseMock, nextMock);
      expect(getTweetsWithLikesSpy).toBeCalledWith(requestMock.user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(tweets);
    });

    it('should call next on error', async () => {
      getTweetsWithLikesSpy.mockRejectedValueOnce(null);
      await controller.getTweetsWithLikes(requestMock, responseMock, nextMock);
      expect(getTweetsWithLikesSpy).toBeCalledWith(requestMock.user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('getTweetsWithMedia', () => {
    const getTweetsWithMediaSpy = jest.spyOn(service, 'getTweetsWithMedia');

    it('should call getTweetsWithMedia service and return tweets', async () => {
      getTweetsWithMediaSpy.mockResolvedValueOnce(tweets);
      await controller.getTweetsWithMedia(requestMock, responseMock, nextMock);
      expect(getTweetsWithMediaSpy).toBeCalledWith(requestMock.user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(tweets);
    });

    it('should call next on error', async () => {
      getTweetsWithMediaSpy.mockRejectedValueOnce(null);
      await controller.getTweetsWithMedia(requestMock, responseMock, nextMock);
      expect(getTweetsWithMediaSpy).toBeCalledWith(requestMock.user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('getTweetsWithReplies', () => {
    const getTweetsWithRepliesSpy = jest.spyOn(service, 'getTweetsWithReplies');

    it('should call getTweetsWithReplies service and return tweets', async () => {
      getTweetsWithRepliesSpy.mockResolvedValueOnce(tweets);
      await controller.getTweetsWithReplies(requestMock, responseMock, nextMock);
      expect(getTweetsWithRepliesSpy).toBeCalledWith(requestMock.user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(tweets);
    });

    it('should call next on error', async () => {
      getTweetsWithRepliesSpy.mockRejectedValueOnce(null);
      await controller.getTweetsWithReplies(requestMock, responseMock, nextMock);
      expect(getTweetsWithRepliesSpy).toBeCalledWith(requestMock.user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });
});
