import { BadRequestException } from "../exceptions/index.js";
import prisma from "../prisma/prisma.service.js";

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
    if (reaction) {
      await prisma.retweet.create({ data: { userId, tweetId } })
      return;
    }

    const retweet = await prisma.retweet.findFirst({ where: { userId, tweetId } })

    if (retweet) {
      await prisma.retweet.delete({ where: { id: retweet.id }});
    }
  }

  async handleLike(userId, tweetId, reaction) {
    if (reaction) {
      await prisma.tweetLike.create({ data: { userId, tweetId }});
      return;
    }

    const like = await prisma.tweetLike.findFirst({ where: { userId, tweetId }});

    if (like) {
      await prisma.tweetLike.delete({ where: { id: like.id }});
    }
  }

  async handleSave(userId, tweetId, reaction) {
    if (reaction) {
      await prisma.bookmark.create({ data: { userId, tweetId }})
      return;
    }

    const bookmark = await prisma.bookmark.findFirst({ where: { userId, tweetId }});
    
    if (bookmark) {
      await prisma.bookmark.delete({ where: { id: bookmark.id }});
    }
  }

  async getAllByUserId(userId) {
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
    orderBy: { 
      timestamp: 'desc'
    }
  })
    return tweets;
  }

  async getAllWithLikesByUserId(userId) {
    const tweets = await prisma.tweetLike.findMany({ 
      where: { 
        userId 
      }, 
      select: { 
        Tweet: true 
      }, 
      orderBy: { 
        Tweet: { 
          timestamp: 'desc' 
        } 
      } 
    })
    return tweets
  }

  async getAllWithMediaByUserId(userId) {
    const tweets = await prisma.tweet.findMany({ 
      where: { 
        userId, 
        imageLink: { 
          not: null 
        } 
      }, 
      orderBy: { 
        timestamp: 'desc'
      } 
    })
    return tweets;
  }
}

export default new TweetService();
