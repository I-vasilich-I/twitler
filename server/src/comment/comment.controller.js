import commentService from "./comment.service.js";

class CommentController {
  async create(req, res, next) {
    try {
      const { file, user, body } = req;
      const tweetId = +req.params.tweetId;
      const comment = await commentService.create(body.text, user.id, tweetId, file);
      res.status(201);
      return res.json(comment)
    } catch (error) {
      next(error)
    }
  }

  async like(req, res, next) {
    try {
      const commentId = +req.params.commentId;
      const { like } = req.query;
      const userId = req.user.id;
      const data = await commentService.like(commentId, userId, like);
      res.status(data ? 200 : 204)
      return res.json(data);
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const commentId = +req.params.commentId;
      const userId = req.user.id;
      await commentService.delete(commentId, userId);
      res.status(204);
      return res.json();
    } catch (error) {
      next(error)
    }
  }
}

export default new CommentController();