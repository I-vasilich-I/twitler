// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import service from './follow.service.js';
import controller from './follow.controller.js';
import { STATUS_CODES } from '../../constants';

jest.mock('./follow.service.js');

describe('FollowController', () => {
  const requestMock = {
    user: {
      id: 1,
    },
    params: {
      userId: 4,
    },
    query: {
      type: 'follow',
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

  describe('getAllFollowers', () => {
    const getAllFollowersSpy = jest.spyOn(service, 'getAllFollowers');
    const { params, user } = requestMock;
    const followers = ['follower'];

    it('should call getAllFollowers service and return followers', async () => {
      getAllFollowersSpy.mockResolvedValueOnce(followers);
      await controller.getAllFollowers(requestMock, responseMock, nextMock);
      expect(getAllFollowersSpy).toBeCalledWith(+params.userId, user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(followers);
    });

    it('should call next on error', async () => {
      getAllFollowersSpy.mockRejectedValueOnce(null);
      await controller.getAllFollowers(requestMock, responseMock, nextMock);
      expect(getAllFollowersSpy).toBeCalledWith(+params.userId, user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('getAllFollowing', () => {
    const getAllFollowingSpy = jest.spyOn(service, 'getAllFollowing');
    const { params, user } = requestMock;
    const following = ['following'];

    it('should call getAllFollowing service and return following', async () => {
      getAllFollowingSpy.mockResolvedValueOnce(following);
      await controller.getAllFollowing(requestMock, responseMock, nextMock);
      expect(getAllFollowingSpy).toBeCalledWith(+params.userId, user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(following);
    });

    it('should call next on error', async () => {
      getAllFollowingSpy.mockRejectedValueOnce(null);
      await controller.getAllFollowing(requestMock, responseMock, nextMock);
      expect(getAllFollowingSpy).toBeCalledWith(+params.userId, user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('follow', () => {
    const followSpy = jest.spyOn(service, 'handleFollow');
    const { params, user, query } = requestMock;
    const data = 'data';

    it('should call handleFollow service and return follow data when type = follow', async () => {
      followSpy.mockResolvedValueOnce(data);
      await controller.follow(requestMock, responseMock, nextMock);
      expect(followSpy).toBeCalledWith(user.id, +params.userId, query.type);
      expect(responseMock.status).not.toBeCalled();
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(data);
    });

    it('should call handleFollow service and return no content when type = unfollow', async () => {
      followSpy.mockResolvedValueOnce(null);
      await controller.follow(requestMock, responseMock, nextMock);
      expect(followSpy).toBeCalledWith(user.id, +params.userId, query.type);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.NO_CONTENT);
      expect(responseMock.json).toBeCalledWith();
    });

    it('should call next on error', async () => {
      followSpy.mockRejectedValueOnce(null);
      await controller.follow(requestMock, responseMock, nextMock);
      expect(followSpy).toBeCalledWith(user.id, +params.userId, query.type);
      expect(responseMock.status).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalled();
    });
  });
});
