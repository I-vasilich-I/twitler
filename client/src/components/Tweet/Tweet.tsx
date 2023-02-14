import { Card, Form } from "antd";
import { ITweet } from "../../types";
import TweetButtons from "./TweetButtons/TweetButtons";
import TweetCounters from "./TweetCounters/TweetCounters";
import TweetHeader from "./TweetHeader/TweetHeader";
import TweetComments from "./TweetComments/TweetComments";
import TweetMedia from "./TweetMedia/TweetMedia";
import TweetText from "./TweetText/TweetText";
import "./Tweet.scss";

const Tweet = ({
  id,
  avatar,
  username,
  userId,
  timestamp,
  text,
  imageLink,
  hasMyRetweet,
  hasMyLike,
  hasMyBookmark,
  counters,
}: ITweet) => {
  const [form] = Form.useForm();

  return (
    <Card
      style={{ maxWidth: "825px", width: "100%" }}
      bodyStyle={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      <TweetHeader avatar={avatar} username={username} timestamp={timestamp} userId={userId} />
      <TweetText text={text} />
      <TweetMedia src={imageLink} />
      <TweetCounters {...counters} />
      <TweetButtons
        hasMyRetweet={hasMyRetweet}
        hasMyLike={hasMyLike}
        hasMyBookmark={hasMyBookmark}
        form={form}
        tweetId={id}
      />
      <TweetComments form={form} tweetId={id} />
    </Card>
  );
};

export default Tweet;
