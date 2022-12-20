import tweetService from "./tweet.service.js";

class TweetController {
  async create(req, res, next) {
    try {
      const { file, user, body } = req;
      const tweet = await tweetService.create(body, user.id, file);
      return res.json(tweet);
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const tweetId = +req.params.tweetId;
      const userId = req.user.id;
      await tweetService.delete(userId, tweetId);
      return res.json();
    } catch (error) {
      next(error)
    }
  }

  async react(req, res, next) {
    try {
      const tweetId = +req.params.tweetId;
      const userId = req.user.id;
      await tweetService.react(userId, tweetId, req.query);
      return res.json();
    } catch (error) {
      next(error)
    }
  }

  async getAllByUserId(req, res, next) {
    try {
      const userId = +req.params.userId;
      const loggedUserId = req.user.id;
      const tweets = await tweetService.getAllByUserId(userId, loggedUserId)
      return res.json(tweets);
    } catch (error) {
      next(error)
    }
  }

  async getAllWithLikesByUserId(req, res, next) {
    try {
      const userId = +req.params.userId;
      const loggedUserId = req.user.id;
      const tweets = await tweetService.getAllWithLikesByUserId(userId, loggedUserId);
      return res.json(tweets); 
    } catch (error) {
      next(error)
    }
  }

  async getAllWithMediaByUserId(req, res, next) {
    try {
      const userId = +req.params.userId;
      const loggedUserId = req.user.id;
      const tweets = await tweetService.getAllWithMediaByUserId(userId, loggedUserId);
      return res.json(tweets); 
    } catch (error) {
      next(error)
    }
  }

  async getAllWithRepliesByUserId(req, res, next) {
    try {
      const userId = +req.params.userId;
      const loggedUserId = req.user.id;
      const tweets = await tweetService.getAllWithRepliesByUserId(userId, loggedUserId);
      return res.json(tweets);
    } catch (error) {
      next(error)
    }
  }

  async getAllFollowingTweets(req, res, next) {
    try {
      const userId = req.user.id;
      const tweets = await tweetService.getAllFollowingTweets(userId);
      return res.json(tweets)
    } catch (error) {
      next(error)
    }
  }
}

export default new TweetController();
