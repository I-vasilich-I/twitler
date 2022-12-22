import prisma from "../prisma/prisma.service.js";
import { getTweetsIncludeOptions } from "../helpers.js";

class ExploreService {
  async getData(loggedUserId, query, filter) {
    const options = {
      where: {
        text: {
          contains: query,
        },
      },
      include: getTweetsIncludeOptions(loggedUserId),
      orderBy: { 
        timestamp: 'desc'
      }
    };

    if (!query) {
      const data = await prisma.tweet.findMany(options);

      return data;
    }

    if (filter === "people") {
      const data = await prisma.user.findMany({
        where: {
          username: {
            contains: query
          }
        },
        select: {
          id: true,
          username: true,
          bio: true,
          avatar: true,
          followers: { 
            where: {
              followerUserId: loggedUserId
            },
          },
          _count: {
            select: {
              followers: true,
            }
          }
        },
      });

      return data.map(({ followers, _count, ...rest }) => ({ ...rest, followers: _count.followers, amIFollowing: Boolean(followers.length) }));
    }

    if (filter === "top") {
      options.orderBy = [
        {
          tweetLikes: {
            _count: 'desc'
          },
        },
        {
          timestamp: 'desc'
        }
      ]
    }

    if (filter === "media") {
      options.where = {
        ...options.where,
        imageLink: { 
          not: null 
        }
      }
    }

    const data = await prisma.tweet.findMany(options)

    return data;
  }
}

export default new ExploreService()