import { BadRequestException } from "../exceptions/index.js";
import prisma from "../prisma/prisma.service.js";

class CommentService {
  async create(text, userId, tweetId, imageData) {
    if (text === undefined && !imageData) {
      throw new BadRequestException('No data was passed');
    }

    const data = { userId, tweetId };

    if (text !== undefined ) {
      data.text = text;
    }

    if (imageData?.path) {
      data.imageLink = imageData.path;
    }

    const comment = await prisma.comment.create({ data })

    return comment;
  }

  async like(commentId, userId, like) {
    const isLikeValid = like === 'true' || like === 'false';

    if (!isLikeValid) {
      throw new BadRequestException('Wrong query param');
    }

    if (like === 'true') {
      const commentLikeInDb = await prisma.commentLike.findFirst({ where: { commentId, userId } });
      if (commentLikeInDb) {
        return commentLikeInDb;
      }
      
      const commentLike = await prisma.commentLike.create({ data: { commentId, userId } })
      return commentLike;
    }

    const commentLike = await prisma.commentLike.findFirst({ where: { commentId, userId } });

    if (commentLike) {
      await prisma.commentLike.delete({ where:  { id: commentLike.id }});
    }

    return;
  }

  async delete(commentId, userId) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId }});

    if (!comment) {
      throw new BadRequestException(`Comment with id: ${commentId} doesn't exist`)
    }

    if (comment.userId !== userId) {
      throw new BadRequestException();
    }

    await prisma.comment.delete({ where: { id: comment.id }});
  }
}

export default new CommentService();