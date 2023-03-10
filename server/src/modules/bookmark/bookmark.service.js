import prisma from '../prisma/prisma.service.js';
import { getTweetsIncludeOptions } from '../../helpers.js';
import { ORDER_BY_TIMESTAMP } from '../../constants.js';

class BookmarkService {
  async getAllTweets(userId) {
    const tweets = await prisma.tweet.findMany({
      where: {
        bookmarks: {
          some: {
            userId,
          },
        },
      },
      include: getTweetsIncludeOptions(userId),
      orderBy: ORDER_BY_TIMESTAMP.DESC,
    });

    return tweets;
  }

  async getTweetsWithLikes(userId) {
    const tweets = await prisma.tweet.findMany({
      where: {
        AND: [
          {
            bookmarks: {
              some: {
                userId,
              },
            },
          },
          {
            tweetLikes: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: getTweetsIncludeOptions(userId),
      orderBy: ORDER_BY_TIMESTAMP.DESC,
    });

    return tweets;
  }

  async getTweetsWithMedia(userId) {
    const tweets = await prisma.tweet.findMany({
      where: {
        AND: [
          {
            bookmarks: {
              some: {
                userId,
              },
            },
          },
          {
            imageLink: {
              not: null,
            },
          },
        ],
      },
      include: getTweetsIncludeOptions(userId),
      orderBy: ORDER_BY_TIMESTAMP.DESC,
    });

    return tweets;
  }

  async getTweetsWithReplies(userId) {
    const tweets = await prisma.tweet.findMany({
      where: {
        AND: [
          {
            bookmarks: {
              some: {
                userId,
              },
            },
          },
          {
            comments: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: getTweetsIncludeOptions(userId),
      orderBy: ORDER_BY_TIMESTAMP.DESC,
    });

    return tweets;
  }
}

export default new BookmarkService();
