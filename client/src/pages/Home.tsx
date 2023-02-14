import { Layout } from "antd";
import TweetForm from "../components/TweetForm/TweetForm";
import Tweets from "../components/Tweets/Tweets";

const Home = () => (
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
    <Tweets />
  </Layout>
);

export default Home;
