// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import service from './comment.service.js';
import controller from './comment.controller.js';
import { STATUS_CODES } from '../../constants.js';

jest.mock('./comment.service.js');

describe('CommentController', () => {
  const requestMock = {
    user: {
      id: 1,
    },
    params: {
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
  const comments = ['comment'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defind', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    const getAllSpy = jest.spyOn(service, 'getAll');

    it('should call getAll service and return comments', async () => {
      getAllSpy.mockResolvedValueOnce(comments);
      await controller.getAll(requestMock, responseMock, nextMock);
      expect(getAllSpy).toBeCalledWith(+requestMock.params.tweetId, requestMock.user.id);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(comments);
    });

    it('should call next on error', async () => {
      getAllSpy.mockRejectedValueOnce(null);
      await controller.getAll(requestMock, responseMock, nextMock);
      expect(getAllSpy).toBeCalledWith(+requestMock.params.tweetId, requestMock.user.id);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('create', () => {
    const createSpy = jest.spyOn(service, 'create');
    const comment = 'comment';
    const {
      body, user, params, file,
    } = requestMock;

    it('should call create service and return comment', async () => {
      createSpy.mockResolvedValueOnce(comment);
      await controller.create(requestMock, responseMock, nextMock);
      expect(createSpy).toBeCalledWith(body.text, user.id, params.tweetId, file);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(comment);
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.CREATED);
    });

    it('should call next on error', async () => {
      createSpy.mockRejectedValueOnce(null);
      await controller.create(requestMock, responseMock, nextMock);
      expect(createSpy).toBeCalledWith(body.text, user.id, params.tweetId, file);
      expect(responseMock.json).not.toBeCalled();
      expect(responseMock.status).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('like', () => {
    const likeSpy = jest.spyOn(service, 'like');
    const like = 'like';
    const {
      user, params, query,
    } = requestMock;

    it('should call like service and return like', async () => {
      likeSpy.mockResolvedValueOnce(like);
      await controller.like(requestMock, responseMock, nextMock);
      expect(likeSpy).toBeCalledWith(params.commentId, user.id, query.like);
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.OK);
      expect(responseMock.json).toBeCalledWith(like);
      expect(nextMock).not.toBeCalled();
    });

    it('should call like service and return null on unlike request', async () => {
      likeSpy.mockResolvedValueOnce(null);
      await controller.like(requestMock, responseMock, nextMock);
      expect(likeSpy).toBeCalledWith(params.commentId, user.id, query.like);
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.NO_CONTENT);
      expect(responseMock.json).toBeCalledWith(null);
      expect(nextMock).not.toBeCalled();
    });

    it('should call next on error', async () => {
      likeSpy.mockRejectedValueOnce(null);
      await controller.like(requestMock, responseMock, nextMock);
      expect(likeSpy).toBeCalledWith(params.commentId, user.id, query.like);
      expect(responseMock.status).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });

  describe('delete', () => {
    const deleteSpy = jest.spyOn(service, 'delete');
    const {
      user, params,
    } = requestMock;

    it('should call delete service', async () => {
      deleteSpy.mockResolvedValueOnce();
      await controller.delete(requestMock, responseMock, nextMock);
      expect(deleteSpy).toBeCalledWith(params.commentId, user.id);
      expect(responseMock.status).toBeCalledWith(STATUS_CODES.NO_CONTENT);
      expect(responseMock.json).toBeCalled();
      expect(nextMock).not.toBeCalled();
    });

    it('should call next on error', async () => {
      deleteSpy.mockRejectedValueOnce(null);
      await controller.delete(requestMock, responseMock, nextMock);
      expect(deleteSpy).toBeCalledWith(params.commentId, user.id);
      expect(responseMock.status).not.toBeCalled();
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });
});
