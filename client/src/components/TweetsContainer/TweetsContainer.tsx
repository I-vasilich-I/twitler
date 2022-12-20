import { Layout, Empty } from "antd";
import { ITweet } from "../../types";
import Tweet from "../Tweet/Tweet";

type Props = {
  tweets: ITweet[];
};

const TweetsContainer = ({ tweets }: Props) => (
  <Layout
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
    }}
  >
    {tweets.length ? tweets.map((tweetProps) => <Tweet key={tweetProps.id} {...tweetProps} />) : <Empty />}
  </Layout>
);

export default TweetsContainer;
