interface ISignUpData {
  username: string;
  email: string;
  password: string;
}

type ISignInData = Omit<ISignUpData, "username">;

interface IAuthData {
  email: string;
  password: string;
  username?: string;
}

interface IUser {
  id: number;
  email: string;
  username: string;
  isActivated: boolean;
  bio: string;
  avatar: string;
}

interface IAuthResponseData {
  user: IUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface ICommentLike {
  id: number;
  userId: number;
  commentId: number;
}

interface IRetweet {
  id: number;
  userId: number;
  tweetId: number;
}

interface ITweetLike {
  id: number;
  userId: number;
  tweetId: number;
}

interface IBookmark {
  id: number;
  userId: number;
  tweetId: number;
}

interface ICounters {
  retweets: number;
  tweetLikes: number;
  bookmarks: number;
  comments: number;
}

interface ICommentsResponseData {
  id: number;
  userId: number;
  tweetId: number;
  timestamp: string;
  text: string;
  imageLink: string | null;
  User: {
    avatar: string;
    username: string;
  };
  commentLikes: ICommentLike[];
  _count: {
    commentLikes: number;
  };
}

interface IComment {
  id: number;
  avatar: string | null;
  username: string;
  timestamp: string;
  text: string;
  imageLink: string | null;
  hasMyLike: boolean;
  likes: number;
  loading?: boolean;
}

interface IFollowingTweetResponseData {
  id: number;
  userId: number;
  timestamp: string;
  text: string;
  imageLink: string | null;
  isPublic: boolean;
  User: {
    avatar: string;
    username: string;
  };
  retweets: IRetweet[];
  tweetLikes: ITweetLike[];
  bookmarks: IBookmark[];
  _count: ICounters;
}

interface ITweet {
  id: number;
  avatar: string | null;
  username: string;
  timestamp: string;
  text: string;
  imageLink: string | null;
  hasMyRetweet: boolean;
  hasMyLike: boolean;
  hasMyBookmark: boolean;
  counters: ICounters;
  isPublic: boolean;
}

const enum ReactionButtonTypes {
  RETWEET,
  LIKE,
  SAVE,
}

export { ReactionButtonTypes };

export type {
  ISignUpData,
  ISignInData,
  IAuthData,
  IUser,
  IAuthResponseData,
  ICommentsResponseData,
  IComment,
  IFollowingTweetResponseData,
  ITweet,
  ICounters,
};
