import { BadRequestException, NotFoundException } from '../../exceptions/index.js';
import prisma from '../prisma/prisma.service.js';
import { getTweetsIncludeOptions } from '../../helpers.js';
import { ERROR_MESSAGES, BOOLEAN_REQ_PARAMS, ORDER_BY_TIMESTAMP } from '../../constants.js';

const { NO_DATA_PASSED, ENTITY_WITH_ID_DOES_NOT_EXIST, WRONG_QUERY } = ERROR_MESSAGES;
const { TRUE, FALSE } = BOOLEAN_REQ_PARAMS;

class TweetService {
  async create({ text, isPublic }, userId, imageData) {
    if (text === undefined && !imageData) {
      throw new BadRequestException(NO_DATA_PASSED);
    }

    const data = { userId, isPublic: isPublic === TRUE };

    if (text !== undefined) {
      data.text = text;
    }

    if (imageData?.path) {
      data.imageLink = imageData.path;
    }

    const tweet = await prisma.tweet.create({ data });

    return tweet;
  }

  async delete(userId, tweetId) {
    const tweet = await prisma.tweet.findUnique({ where: { id: tweetId } });

    if (!tweet) {
      throw new NotFoundException(ENTITY_WITH_ID_DOES_NOT_EXIST('Tweet', tweetId));
    }

    if (tweet.userId !== userId) {
      throw new BadRequestException();
    }

    await prisma.tweet.delete({ where: { id: tweetId } });
  }

  async react(userId, tweetId, { retweet, like, save } = {}) {
    const tweet = await prisma.tweet.findUnique({ where: { id: tweetId } });

    if (!tweet) {
      throw new NotFoundException(ENTITY_WITH_ID_DOES_NOT_EXIST('Tweet', tweetId));
    }

    const isRetweet = retweet === TRUE || retweet === FALSE;
    const isLike = like === TRUE || like === FALSE;
    const isSave = save === TRUE || save === FALSE;

    if (!isRetweet && !isLike && !isSave) {
      throw new BadRequestException(WRONG_QUERY);
    }

    if (isRetweet) {
      await this.handleRetweet(userId, tweetId, retweet === TRUE);
    }

    if (isLike) {
      await this.handleLike(userId, tweetId, like === TRUE);
    }

    if (isSave) {
      await this.handleSave(userId, tweetId, save === TRUE);
    }
  }

  async handleRetweet(userId, tweetId, reaction) {
    const retweetInDb = await prisma.retweet.findFirst({ where: { userId, tweetId } });

    if (reaction) {
      if (retweetInDb) {
        return;
      }

      await prisma.retweet.create({ data: { userId, tweetId } });

      return;
    }

    if (retweetInDb) {
      await prisma.retweet.delete({ where: { id: retweetInDb.id } });
    }
  }

  async handleLike(userId, tweetId, reaction) {
    const likeInDb = await prisma.tweetLike.findFirst({ where: { userId, tweetId } });

    if (reaction) {
      if (likeInDb) {
        return;
      }

      await prisma.tweetLike.create({ data: { userId, tweetId } });

      return;
    }

    if (likeInDb) {
      await prisma.tweetLike.delete({ where: { id: likeInDb.id } });
    }
  }

  async handleSave(userId, tweetId, reaction) {
    const bookmarkInDb = await prisma.bookmark.findFirst({ where: { userId, tweetId } });

    if (reaction) {
      if (bookmarkInDb) {
        return;
      }

      await prisma.bookmark.create({ data: { userId, tweetId } });

      return;
    }

    if (bookmarkInDb) {
      await prisma.bookmark.delete({ where: { id: bookmarkInDb.id } });
    }
  }

  async getAllByUserId(userId, loggedUserId) {
    const tweets = await prisma.tweet.findMany({
      where: {
        OR: [
          { userId },
          {
            retweets: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: getTweetsIncludeOptions(loggedUserId),
      orderBy: ORDER_BY_TIMESTAMP.DESC,
    });

    return tweets;
  }

  async getAllWithLikesByUserId(userId, loggedUserId) {
    const tweets = await prisma.tweet.findMany({
      where: {
        tweetLikes: {
          some: {
            userId,
          },
        },
      },
      include: getTweetsIncludeOptions(loggedUserId),
      orderBy: ORDER_BY_TIMESTAMP.DESC,
    });

    return tweets;
  }

  async getAllWithMediaByUserId(userId, loggedUserId) {
    const tweets = await prisma.tweet.findMany({
      where: {
        userId,
        imageLink: {
          not: null,
        },
      },
      include: getTweetsIncludeOptions(loggedUserId),
      orderBy: ORDER_BY_TIMESTAMP.DESC,
    });

    return tweets;
  }

  async getAllWithRepliesByUserId(userId, loggedUserId) {
    const tweets = await prisma.tweet.findMany({
      where: {
        comments: {
          some: {
            userId,
          },
        },
      },
      include: getTweetsIncludeOptions(loggedUserId),
      orderBy: ORDER_BY_TIMESTAMP.DESC,
    });

    return tweets;
  }

  async getAllFollowingTweets(userId) {
    const tweets = await prisma.tweet.findMany({
      where: {
        OR: [
          { userId },
          {
            User: {
              followers: {
                some: {
                  followerUserId: userId,
                },
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

export default new TweetService();
