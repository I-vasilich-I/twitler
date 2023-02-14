import moment from "moment";
import { BASE_API, SERVER_URL } from "./constants";
import { FollowTypes } from "./types";

const formatTimestamp = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  const dateWrapper = moment(date);
  const result = `${dateWrapper.format("MMM D")} at ${dateWrapper.format("h:mm a")}`;
  return result;
};

const getTweetsPath = (path: string, userId?: string | number) => (userId ? `${path}/${userId}` : path);

const getImageUrl = (imageLink: string | null) => (imageLink ? `${SERVER_URL}/${imageLink}` : null);

const getFollowUrl = (userId: string | number, amIFollowing = false) =>
  `${BASE_API}/follow/${userId}?type=${amIFollowing ? FollowTypes.UNFOLLOW : FollowTypes.FOLLOW}`;

export { formatTimestamp, getTweetsPath, getFollowUrl, getImageUrl };
