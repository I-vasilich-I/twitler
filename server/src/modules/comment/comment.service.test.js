// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import prisma from '../prisma/prisma.service.js';
import service from './comment.service.js';
import { BadRequestException, NotFoundException } from '../../exceptions/index.js';
import { BOOLEAN_REQ_PARAMS, ERROR_MESSAGES } from '../../constants.js';

jest.mock('../prisma/prisma.service.js');

describe('CommentService', () => {
  const comment = 'comment';
  const comments = [comment];
  const tweetId = 1;
  const userId = 2;
  const commentId = 3;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    const findManySpy = jest.spyOn(prisma.comment, 'findMany');

    it('should return comments', async () => {
      findManySpy.mockResolvedValueOnce(comments);
      const result = await service.getAll(tweetId, userId);
      expect(findManySpy).toBeCalledWith({
        where: {
          tweetId,
        },
        include: {
          User: {
            select: {
              avatar: true,
              username: true,
            },
          },
          commentLikes: {
            where: {
              userId,
            },
          },
          _count: {
            select: {
              commentLikes: true,
            },
          },
        },
      });
      expect(result).toEqual(comments);
    });
  });

  describe('create', () => {
    it('should throw when no data passed', async () => {
      try {
        await service.create();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERROR_MESSAGES.NO_DATA_PASSED);
      }
    });

    it('should create comment and return it', async () => {
      const createSpy = jest.spyOn(prisma.comment, 'create');
      const text = 'text';
      const path = 'path';
      createSpy.mockResolvedValueOnce(comment);
      const result = await service.create(text, userId, tweetId, { path });
      expect(createSpy).toBeCalledWith({
        data: {
          userId, tweetId, text, imageLink: path,
        },
      });
      expect(result).toEqual(comment);
    });

    it('should create comment without text and return it', async () => {
      const createSpy = jest.spyOn(prisma.comment, 'create');
      const text = undefined;
      const path = 'path';
      createSpy.mockResolvedValueOnce(comment);
      const result = await service.create(text, userId, tweetId, { path });
      expect(createSpy).toBeCalledWith({
        data: {
          userId, tweetId, imageLink: path,
        },
      });
      expect(result).toEqual(comment);
    });

    it('should create comment without image and return it', async () => {
      const createSpy = jest.spyOn(prisma.comment, 'create');
      const text = 'text';
      const path = undefined;
      createSpy.mockResolvedValueOnce(comment);
      const result = await service.create(text, userId, tweetId, { path });
      expect(createSpy).toBeCalledWith({
        data: {
          userId, tweetId, text,
        },
      });
      expect(result).toEqual(comment);
    });
  });

  describe('like', () => {
    const findFirstSpy = jest.spyOn(prisma.commentLike, 'findFirst');
    const createSpy = jest.spyOn(prisma.commentLike, 'create');
    const deleteSpy = jest.spyOn(prisma.commentLike, 'delete');
    const commentLike = {
      id: commentId,
    };

    it('should throw on wrong query', async () => {
      try {
        await service.like(commentId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERROR_MESSAGES.WRONG_QUERY);
      }
    });

    describe('like is true', () => {
      it('should return comment like from DB when it already exist', async () => {
        findFirstSpy.mockResolvedValueOnce(commentLike);
        const result = await service.like(commentId, userId, BOOLEAN_REQ_PARAMS.TRUE);
        expect(createSpy).not.toBeCalled();
        expect(deleteSpy).not.toBeCalled();
        expect(findFirstSpy).toBeCalledWith({ where: { commentId, userId } });
        expect(result).toEqual(commentLike);
      });

      it('should create comment like when it does not exist in DB', async () => {
        findFirstSpy.mockResolvedValueOnce();
        createSpy.mockResolvedValueOnce(commentLike);
        const result = await service.like(commentId, userId, BOOLEAN_REQ_PARAMS.TRUE);
        expect(deleteSpy).not.toBeCalled();
        expect(findFirstSpy).toBeCalledWith({ where: { commentId, userId } });
        expect(createSpy).toBeCalledWith({ data: { commentId, userId } });
        expect(result).toEqual(commentLike);
      });
    });

    describe('like is false', () => {
      it('should delete comment like when it exist in DB and return null', async () => {
        findFirstSpy.mockResolvedValueOnce(commentLike);
        deleteSpy.mockResolvedValue();
        const result = await service.like(commentId, userId, BOOLEAN_REQ_PARAMS.FALSE);
        expect(createSpy).not.toBeCalled();
        expect(findFirstSpy).toBeCalledWith({ where: { commentId, userId } });
        expect(deleteSpy).toBeCalledWith({ where: { id: commentLike.id } });
        expect(result).toBe(null);
      });

      it('should not call delete and should just return null when comment like does not exist in DB without', async () => {
        findFirstSpy.mockResolvedValueOnce();
        const result = await service.like(commentId, userId, BOOLEAN_REQ_PARAMS.FALSE);
        expect(createSpy).not.toBeCalled();
        expect(deleteSpy).not.toBeCalled();
        expect(findFirstSpy).toBeCalledWith({ where: { commentId, userId } });
        expect(result).toBe(null);
      });
    });
  });

  describe('delete', () => {
    const findUniqueSpy = jest.spyOn(prisma.comment, 'findUnique');
    const deleteSpy = jest.spyOn(prisma.comment, 'delete');

    it('should throw NotFoundException', async () => {
      findUniqueSpy.mockResolvedValueOnce();
      try {
        await service.delete(commentId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(ERROR_MESSAGES.ENTITY_WITH_ID_DOES_NOT_EXIST('Comment', commentId));
      }
    });

    it('should throw BadRequestException', async () => {
      findUniqueSpy.mockResolvedValueOnce({ userId: userId + 1 });
      try {
        await service.delete(commentId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should delete comment', async () => {
      findUniqueSpy.mockResolvedValueOnce({ userId, id: commentId });
      deleteSpy.mockResolvedValueOnce();
      await service.delete(commentId, userId);
      expect(findUniqueSpy).toBeCalledWith({ where: { id: commentId } });
      expect(deleteSpy).toBeCalledWith({ where: { id: commentId } });
    });
  });
});
