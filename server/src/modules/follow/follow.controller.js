import { STATUS_CODES } from '../../constants.js';
import followService from './follow.service.js';

class FollowController {
  async getAllFollowers(req, res, next) {
    try {
      const { userId } = req.params;
      const loggedUserId = req.user.id;
      const followers = await followService.getAllFollowers(Number(userId), loggedUserId);
      res.json(followers);
    } catch (error) {
      next(error);
    }
  }

  async getAllFollowing(req, res, next) {
    try {
      const { userId } = req.params;
      const loggedUserId = req.user.id;
      const following = await followService.getAllFollowing(Number(userId), loggedUserId);
      res.json(following);
    } catch (error) {
      next(error);
    }
  }

  async follow(req, res, next) {
    try {
      const { type } = req.query;
      const followerId = req.user.id;
      const followingId = Number(req.params.userId);
      const data = await followService.handleFollow(followerId, followingId, type);

      if (data) {
        res.json(data);
        return;
      }

      res.status(STATUS_CODES.NO_CONTENT);
      res.json();
    } catch (error) {
      next(error);
    }
  }
}

export default new FollowController();
