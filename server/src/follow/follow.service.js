import { BadRequestException } from '../exceptions/index.js';
import prisma from '../prisma/prisma.service.js'
import UserDto from '../user/dto/user.dto.js';

class FollowService {
  async getAllFollowers(userId) {
    const { followers } = await prisma.user.findUnique({ 
      where: { 
        id: userId 
      }, 
      select: { 
        followers: { 
          select: { 
            Follower: true 
          } 
        } 
      }
    });
    return followers.map(({ Follower }) => {
      const user = new UserDto(Follower);
      return { ...user }
    });
  }

  async getAllFollowing(userId) {
    const { following } = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        following: {
          select: {
            Following: true,
          }
        }
      }
    });
    return following.map(({ Following }) => {
      const user = new UserDto(Following);
      return { ...user }
    });
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