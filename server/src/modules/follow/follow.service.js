import { BadRequestException } from '../../exceptions/index.js';
import prisma from '../prisma/prisma.service.js';
import { getFollowSelectOptions } from '../../helpers.js';
import { ERROR_MESSAGES, FOLLOW_TYPES } from '../../constants.js';

const { CAN_NOT_FOLLOW_YOURSELF, WRONG_FOLLOW_TYPE, CAN_UNFOLLOW_WHEN_FOLLOWING } = ERROR_MESSAGES;

class FollowService {
  async getAllFollowers(userId, loggedUserId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
        followers: {
          select: {
            Follower: {
              select: getFollowSelectOptions(loggedUserId),
            },
          },
        },
      },
    });

    const { followers: followersData, ...rest } = user;

    const data = followersData.map(
      ({
        Follower: {
          _count: { followers },
          followers: followersArr,
          ...followingRest
        },
      }) => ({
        ...followingRest,
        followers,
        amIFollowing: Boolean(followersArr.length),
      }),
    );

    return { ...rest, data };
  }

  async getAllFollowing(userId, loggedUserId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
        following: {
          select: {
            Following: {
              select: getFollowSelectOptions(loggedUserId),
            },
          },
        },
      },
    });

    const { following, ...rest } = user;

    const data = following.map(
      ({
        Following: {
          _count: { followers },
          followers: followersArr,
          ...followingRest
        },
      }) => ({
        ...followingRest,
        followers,
        amIFollowing: Boolean(followersArr.length),
      }),
    );

    return { ...rest, data };
  }

  async handleFollow(followerUserId, followingUserId, type) {
    if (followerUserId === followingUserId) {
      throw new BadRequestException(CAN_NOT_FOLLOW_YOURSELF);
    }

    if (type === FOLLOW_TYPES.FOLLOW) {
      const follower = await this.follow(followerUserId, followingUserId);

      return follower;
    }

    if (type === FOLLOW_TYPES.UNFOLLOW) {
      await this.unfollow(followerUserId, followingUserId);

      return null;
    }

    throw new BadRequestException(WRONG_FOLLOW_TYPE);
  }

  async follow(followerUserId, followingUserId) {
    const follower = await prisma.follow.findFirst({ where: { followerUserId, followingUserId } });

    if (follower) {
      return follower;
    }

    const newFollower = await prisma.follow.create({ data: { followerUserId, followingUserId } });

    return newFollower;
  }

  async unfollow(followerUserId, followingUserId) {
    const follow = await prisma.follow.findFirst({ where: { followerUserId, followingUserId } });

    if (follow) {
      await prisma.follow.delete({ where: { id: follow.id } });

      return;
    }

    throw new BadRequestException(CAN_UNFOLLOW_WHEN_FOLLOWING);
  }
}

export default new FollowService();
