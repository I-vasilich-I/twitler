import bookmarkService from './bookmark.service.js';

class BookmarkController {
  async getAllTweets(req, res, next) {
    try {
      const tweets = await bookmarkService.getAllTweets(req.user.id);
      res.json(tweets);
    } catch (error) {
      next(error);
    }
  }

  async getTweetsWithLikes(req, res, next) {
    try {
      const tweets = await bookmarkService.getTweetsWithLikes(req.user.id);
      res.json(tweets);
    } catch (error) {
      next(error);
    }
  }

  async getTweetsWithMedia(req, res, next) {
    try {
      const tweets = await bookmarkService.getTweetsWithMedia(req.user.id);
      res.json(tweets);
    } catch (error) {
      next(error);
    }
  }

  async getTweetsWithReplies(req, res, next) {
    try {
      const tweets = await bookmarkService.getTweetsWithReplies(req.user.id);
      res.json(tweets);
    } catch (error) {
      next(error);
    }
  }
}

export default new BookmarkController();
