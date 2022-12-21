import followService from "./follow.service.js";

class FollowController {
  async getAllFollowers(req, res, next) {
    try {
      const { userId } = req.params;
      const loggedUserId = req.user.id;
      const followers = await followService.getAllFollowers(+userId, loggedUserId);
      res.json(followers);
    } catch (error) {
      next(error)
    }
  }

  async getAllFollowing(req, res, next) {
    try {
      const { userId } = req.params;
      const loggedUserId = req.user.id;
      const following = await followService.getAllFollowing(+userId, loggedUserId);
      res.json(following);
    } catch (error) {
      next(error)
    }
  }

  async follow(req, res, next) {
    try {
      const { type } = req.query;
      const followerId = req.user.id;
      const followingId = +req.params.userId;
      const data = await followService.handleFollow(followerId, followingId, type);
      
      if (data) {
        return res.json(data);
      }

      res.status(204);
      return res.json();
    } catch (error) {
      next(error)
    }
  }
}

export default new FollowController();