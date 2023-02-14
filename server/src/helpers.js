import { unlink } from 'fs/promises';
import { BASE_URL } from './constants.js';

const deleteFile = async (path) => {
  try {
    await unlink(path);
  } catch {
    //
  }
};

const getTweetsIncludeOptions = (userId) => ({
  retweets: {
    where: {
      userId,
    },
  },
  tweetLikes: {
    where: {
      userId,
    },
  },
  bookmarks: {
    where: {
      userId,
    },
  },
  User: {
    select: {
      avatar: true,
      username: true,
    },
  },
  _count: {
    select: {
      retweets: true,
      tweetLikes: true,
      bookmarks: true,
      comments: true,
    },
  },
});

const getFollowSelectOptions = (userId) => ({
  username: true,
  id: true,
  bio: true,
  avatar: true,
  _count: {
    select: {
      followers: true,
    },
  },
  followers: {
    where: {
      followerUserId: userId,
    },
  },
});

const getActivationLink = (code) => `${BASE_URL}/user/activate/${code}`;

export {
  deleteFile, getTweetsIncludeOptions, getFollowSelectOptions, getActivationLink,
};
