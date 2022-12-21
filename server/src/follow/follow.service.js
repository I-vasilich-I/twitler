import { BadRequestException } from '../exceptions/index.js';
import prisma from '../prisma/prisma.service.js'
import { getFollowSelectOptions } from "../helpers.js"

class FollowService {
  async getAllFollowers(userId, loggedUserId) {
    const user= await prisma.user.findUnique({ 
      where: { 
        id: userId 
      }, 
      select: { 
        username: true,
        followers: { 
          select: { 
            Follower: {
              select: getFollowSelectOptions(loggedUserId),
            } 
          } 
        } 
      },
    });

    const { followers, ...rest } = user;

    const data = followers.map(
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
      })
    )

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
            }
          }
        }
      }
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
      }))

    return { ...rest, data };
  }

  async handleFollow(followerUserId, followingUserId, type) {
    if (followerUserId === followingUserId) {
      throw new BadRequestException(`You can not follow|unfollow yourself`)
    }

    if (type === 'follow') {
      const follower = await this.follow(followerUserId, followingUserId);
      return follower;
    }

    if (type === 'unfollow') {
      await this.unfollow(followerUserId, followingUserId);
      return;
    }

    throw new BadRequestException('Endpoint accepts only follow|unfollow types of operations')
  }

  async follow(followerUserId, followingUserId) {
    const follower = await prisma.follow.findFirst({ where: { followerUserId, followingUserId }})

    if (follower) {
      return follower;
    }

    const newFollower = await prisma.follow.create({ data: { followerUserId, followingUserId }});
    return newFollower;
  }

  async unfollow(followerUserId, followingUserId) {
    const follow = await prisma.follow.findFirst({ where: { followerUserId, followingUserId }});

    if (follow) {
      await prisma.follow.delete({ where: { id: follow.id }})
      return;
    }

    throw new BadRequestException(`You can unfollow only the user you are following`)
  }
}

export default new FollowService();