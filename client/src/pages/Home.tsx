import { Layout, Spin } from "antd";
import Tweet from "../components/Tweet/Tweet";
import TweetForm from "../components/TweetForm/TweetForm";
import { useGetFollowingTweetsQuery } from "../redux/store/api/apiSlice";

const Home = () => {
  const { data: tweets = [], isLoading } = useGetFollowingTweetsQuery(undefined);

  return (
    <Layout
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <TweetForm />
      <Spin spinning={isLoading} size="large">
        <Layout
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {tweets.map((tweetProps) => (
            <Tweet key={tweetProps.id} {...tweetProps} />
          ))}
        </Layout>
      </Spin>
    </Layout>
  );
};

export default Home;
