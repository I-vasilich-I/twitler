import { Row } from "antd";
import { ICounters } from "../../../types";

const TweetCounters = ({ comments, retweets, tweetLikes, bookmarks }: ICounters) => (
  <Row
    style={{
      alignSelf: "flex-end",
      gap: "16px",
      fontSize: "12px",
      lineHeight: "16px",
      fontWeight: 500,
      color: "#BDBDBD",
      paddingBlock: "12px 8px",
    }}
  >
    <span>{comments} Comments</span>
    <span>{retweets} Retweets</span>
    <span>{tweetLikes} Likes</span>
    <span>{bookmarks} Saved</span>
  </Row>
);

export default TweetCounters;
