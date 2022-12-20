import { BadRequestException } from "../exceptions/index.js";
import prisma from "../prisma/prisma.service.js";
import { getTweetsIncludeOptions } from "../helpers.js";

class TweetService {
  async create({ text, isPublic }, userId, imageData) {
    if (text === undefined && !imageData) {
      throw new BadRequestException('No data was passed');
    }

    const data = { userId, isPublic: isPublic === 'true' };

    if (text !== undefined ) {
      data.text = text;
    }

    if (imageData?.path) {
      data.imageLink = imageData.path;
    }

    const tweet = await prisma.tweet.create({ data });
    return tweet;
  }

  async delete(userId, tweetId) {
    const tweet = await prisma.tweet.findUnique({ where: { id: tweetId }});
    if (!tweet) {
      throw new BadRequestException(`Tweet with id: ${tweetId} doesn't exist`)
    }

    if (tweet.userId !== userId) {
      throw new BadRequestException();
    }

    await prisma.tweet.delete({ where: { id: tweetId }});
  }

  async react(userId, tweetId, { retweet, like, save } = {}) {
    const tweet = await prisma.tweet.findUnique({ where: { id: tweetId }});
    if (!tweet) {
      throw new BadRequestException(`Tweet with id: ${tweetId} doesn't exist`)
    }

    const isRetweet = retweet === 'true' || retweet === 'false';
    const isLike = like === 'true' || like === 'false';
    const isSave = save === 'true' || save === 'false';

    if (!isRetweet && !isLike && !isSave) {
      throw new BadRequestException(`Wrong query`)
    }

    if (isRetweet) {
      await this.handleRetweet(userId, tweetId, retweet === 'true');
    }

    if (isLike) {
      await this.handleLike(userId, tweetId, like === 'true');
    }

    if (isSave) {
      await this.handleSave(userId, tweetId, save === 'true');
    }
  }

  async handleRetweet(userId, tweetId, reaction) {
    const retweetInDb = await prisma.retweet.findFirst({ where: { userId, tweetId } })

    if (reaction) {
      if (retweetInDb) {
        return;
      }

      await prisma.retweet.create({ data: { userId, tweetId } })
      return;
    }


    if (retweetInDb) {
      await prisma.retweet.delete({ where: { id: retweetInDb.id }});
    }
  }

  async handleLike(userId, tweetId, reaction) {
    const likeInDb = await prisma.tweetLike.findFirst({ where: { userId, tweetId }});
   
    if (reaction) {
      if (likeInDb) {
        return;
      }

      await prisma.tweetLike.create({ data: { userId, tweetId }});
      return;
    }


    if (likeInDb) {
      await prisma.tweetLike.delete({ where: { id: likeInDb.id }});
    }
  }

  async handleSave(userId, tweetId, reaction) {
    const bookmarkInDb = await prisma.bookmark.findFirst({ where: { userId, tweetId }});
    if (reaction) {
      if (bookmarkInDb) {
        return;
      }

      await prisma.bookmark.create({ data: { userId, tweetId }})
      return;
    }

    
    if (bookmarkInDb) {
      await prisma.bookmark.delete({ where: { id: bookmarkInDb.id }});
    }
  }

  async getAllByUserId(userId, loggedUserId) {
    const tweets = await prisma.tweet.findMany({ 
      where: { 
        OR: [
          { userId }, 
          { retweets: { 
            some: { 
              userId 
            }
          }
        }
      ]
    }, 
    include: getTweetsIncludeOptions(loggedUserId),
    orderBy: { 
      timestamp: 'desc'
    }
  })
    return tweets;
  }

  async getAllWithLikesByUserId(userId, loggedUserId) {
    const tweets = await prisma.tweet.findMany({ 
      where: { 
        tweetLikes: {
          some: {
            userId
          }
        } 
      }, 
      include:  getTweetsIncludeOptions(loggedUserId),
      orderBy: { 
        timestamp: 'desc'
      } 
    })
    return tweets
  }

  async getAllWithMediaByUserId(userId, loggedUserId) {
    const tweets = await prisma.tweet.findMany({ 
      where: { 
        userId, 
        imageLink: { 
          not: null 
        } 
      }, 
      include: getTweetsIncludeOptions(loggedUserId),
      orderBy: { 
        timestamp: 'desc'
      } 
    })
    return tweets;
  }

  async getAllWithRepliesByUserId(userId, loggedUserId) {
    const tweets = await prisma.tweet.findMany({
      where: {
        comments: {
          some: {
            userId
          }
        }
      },
      include:  getTweetsIncludeOptions(loggedUserId),
      orderBy: { 
        timestamp: 'desc'
      } 
    })

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
                  followerUserId: userId
                }
              }
            }
          }
        ],
      }, 
      include:  getTweetsIncludeOptions(userId),
      orderBy: {
        timestamp: 'desc'
      }
    })

    return tweets;
  }
}

export default new TweetService();
