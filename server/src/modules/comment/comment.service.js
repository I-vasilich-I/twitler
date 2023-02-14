import { BOOLEAN_REQ_PARAMS, ERROR_MESSAGES } from '../../constants.js';
import { BadRequestException, NotFoundException } from '../../exceptions/index.js';
import prisma from '../prisma/prisma.service.js';

const { TRUE, FALSE } = BOOLEAN_REQ_PARAMS;
const { NO_DATA_PASSED, WRONG_QUERY, ENTITY_WITH_ID_DOES_NOT_EXIST } = ERROR_MESSAGES;

class CommentService {
  async getAll(tweetId, userId) {
    const comments = await prisma.comment.findMany({
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

    return comments;
  }

  async create(text, userId, tweetId, imageData) {
    if (text === undefined && !imageData) {
      throw new BadRequestException(NO_DATA_PASSED);
    }

    const data = { userId, tweetId };

    if (text !== undefined) {
      data.text = text;
    }

    if (imageData?.path) {
      data.imageLink = imageData.path;
    }

    const comment = await prisma.comment.create({ data });

    return comment;
  }

  async like(commentId, userId, like) {
    const isLikeValid = like === TRUE || like === FALSE;

    if (!isLikeValid) {
      throw new BadRequestException(WRONG_QUERY);
    }

    const commentLikeInDb = await prisma.commentLike.findFirst({ where: { commentId, userId } });

    if (like === TRUE) {
      if (commentLikeInDb) {
        return commentLikeInDb;
      }

      const commentLike = await prisma.commentLike.create({ data: { commentId, userId } });

      return commentLike;
    }

    if (commentLikeInDb) {
      await prisma.commentLike.delete({ where: { id: commentLikeInDb.id } });
    }

    return null;
  }

  async delete(commentId, userId) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException(ENTITY_WITH_ID_DOES_NOT_EXIST('Comment', commentId));
    }

    if (comment.userId !== userId) {
      throw new BadRequestException();
    }

    await prisma.comment.delete({ where: { id: comment.id } });
  }
}

export default new CommentService();
