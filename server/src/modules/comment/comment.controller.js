import { STATUS_CODES } from '../../constants.js';
import commentService from './comment.service.js';

class CommentController {
  async getAll(req, res, next) {
    try {
      const tweetId = Number(req.params.tweetId);
      const userId = req.user.id;
      const comments = await commentService.getAll(tweetId, userId);
      res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { file, user, body } = req;
      const tweetId = Number(req.params.tweetId);
      const comment = await commentService.create(body.text, user.id, tweetId, file);
      res.status(STATUS_CODES.CREATED);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async like(req, res, next) {
    try {
      const commentId = Number(req.params.commentId);
      const { like } = req.query;
      const userId = req.user.id;
      const data = await commentService.like(commentId, userId, like);
      res.status(data ? STATUS_CODES.OK : STATUS_CODES.NO_CONTENT);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const commentId = Number(req.params.commentId);
      const userId = req.user.id;
      await commentService.delete(commentId, userId);
      res.status(STATUS_CODES.NO_CONTENT);
      res.json();
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();
