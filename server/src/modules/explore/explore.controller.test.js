// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import service from './explore.service.js';
import controller from './explore.controller.js';

jest.mock('./explore.service.js');

describe('ExploreController', () => {
  const requestMock = {
    user: {
      id: 1,
    },
    params: {
      tweetId: 2,
      commentId: 3,
      query: 'query',
    },
    file: {},
    body: {
      text: 'text',
    },
    query: {
      like: true,
      filter: 'filter',
    },
  };
  const responseMock = {
    json: jest.fn(),
    status: jest.fn(),
  };
  const nextMock = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defind', () => {
    expect(controller).toBeDefined();
  });

  describe('getbyQueryAndFilter', () => {
    const getDataSpy = jest.spyOn(service, 'getData');
    const {
      user, params, query,
    } = requestMock;

    it('should call getData service and return data', async () => {
      getDataSpy.mockResolvedValueOnce(data);
      await controller.getbyQueryAndFilter(requestMock, responseMock, nextMock);
      expect(getDataSpy).toBeCalledWith(user.id, params.query, query.filter);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(data);
    });

    it('should call getData service and return data when there is no query param', async () => {
      getDataSpy.mockResolvedValueOnce(data);
      const reqMock = { user, query, params: {} };
      await controller.getbyQueryAndFilter(reqMock, responseMock, nextMock);
      expect(getDataSpy).toBeCalledWith(user.id, '', query.filter);
      expect(nextMock).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(data);
    });

    it('should call next on error', async () => {
      getDataSpy.mockRejectedValueOnce(null);
      await controller.getbyQueryAndFilter(requestMock, responseMock, nextMock);
      expect(getDataSpy).toBeCalledWith(user.id, params.query, query.filter);
      expect(responseMock.json).not.toBeCalled();
      expect(nextMock).toBeCalledWith(null);
    });
  });
});
