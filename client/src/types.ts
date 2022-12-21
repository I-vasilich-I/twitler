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
  userId: number;
  timestamp: string;
  text: string;
  imageLink: string | null;
  hasMyLike: boolean;
  likes: number;
  loading?: boolean;
}

interface ITweetResponseData {
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

interface IUserResponseData extends IUser {
  _count: {
    followers: number;
    following: number;
  };
  amIFollowing: boolean;
}

interface ITweet {
  id: number;
  avatar: string | null;
  username: string;
  userId: number;
  timestamp: string;
  text: string;
  imageLink: string | null;
  hasMyRetweet: boolean;
  hasMyLike: boolean;
  hasMyBookmark: boolean;
  counters: ICounters;
  isPublic: boolean;
}

interface IFollowData {
  username: string;
  id: number;
  bio: string | null;
  avatar: string | null;
  followers: number;
  amIFollowing: boolean;
}

interface IFollowingResponseData {
  following: IFollowData[];
  username: string;
}

interface IFollowersResponseData {
  followers: IFollowData[];
  username: string;
}

interface IFollowResponseData {
  data: IFollowData[];
  username: string;
}

const enum ReactionButtonTypes {
  RETWEET,
  LIKE,
  SAVE,
}

const enum FollowTypes {
  FOLLOW = "follow",
  UNFOLLOW = "unfollow",
}

const enum FollowModalTypes {
  FOLLOWING = "following",
  FOLLOWERS = "followers",
}

export { ReactionButtonTypes, FollowTypes, FollowModalTypes };

export type {
  ISignUpData,
  ISignInData,
  IAuthData,
  IUser,
  IAuthResponseData,
  ICommentsResponseData,
  IComment,
  ITweetResponseData,
  ITweet,
  ICounters,
  IUserResponseData,
  IFollowingResponseData,
  IFollowersResponseData,
  IFollowResponseData,
};
