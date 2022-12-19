import { useLocation } from "react-router-dom";
import { APIS, PATHS } from "../constants";
import { getTweetsPath } from "../helpers";
import useAppSelector from "../redux/hooks/useAppSelector";

const { HOME, PROFILE_TWEETS, PROFILE_TWEETS_WITH_REPLIES, PROFILE_TWEETS_WITH_MEDIA, PROFILE_TWEETS_WITH_LIKES } =
  PATHS;

const {
  FOLLOWING_TWEETS,
  GET_TWEETS_BY_USER_ID,
  GET_TWEETS_WITH_REPLIES_BY_USER_ID,
  GET_TWEETS_WITH_MEDIA_BY_USER_ID,
  GET_TWEETS_WITH_LIKES_BY_USER_ID,
} = APIS;

const useTweetsUrl = (userId?: number) => {
  const { id } = useAppSelector((state) => state.USER);
  const { pathname } = useLocation();
  const byUserId = userId ?? id ?? -1;

  switch (pathname) {
    case HOME:
      return FOLLOWING_TWEETS;
    case getTweetsPath(PROFILE_TWEETS, userId):
      return GET_TWEETS_BY_USER_ID(byUserId);
    case getTweetsPath(PROFILE_TWEETS_WITH_REPLIES, userId):
      return GET_TWEETS_WITH_REPLIES_BY_USER_ID(byUserId);
    case getTweetsPath(PROFILE_TWEETS_WITH_MEDIA, userId):
      return GET_TWEETS_WITH_MEDIA_BY_USER_ID(byUserId);
    case getTweetsPath(PROFILE_TWEETS_WITH_LIKES, userId):
      return GET_TWEETS_WITH_LIKES_BY_USER_ID(byUserId);
    default:
      return null;
  }
};

export default useTweetsUrl;
