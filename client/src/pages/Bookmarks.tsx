import { Layout, MenuProps } from "antd";
import { Link } from "react-router-dom";
import SubNav from "../components/SubNav/SubNav";
import Tweets from "../components/Tweets/Tweets";
import { PATHS } from "../constants";

const { BOOKMARKS_TWEETS, BOOKMARKS_TWEETS_WITH_REPLIES, BOOKMARKS_TWEETS_WITH_MEDIA, BOOKMARKS_TWEETS_WITH_LIKES } =
  PATHS;

const items: MenuProps["items"] = [
  {
    label: <Link to={BOOKMARKS_TWEETS}>Tweets</Link>,
    key: "Tweets",
  },
  {
    label: <Link to={BOOKMARKS_TWEETS_WITH_REPLIES}>Tweets & replies</Link>,
    key: "Tweets_and_replies",
  },
  {
    label: <Link to={BOOKMARKS_TWEETS_WITH_MEDIA}>Media</Link>,
    key: "media",
  },
  {
    label: <Link to={BOOKMARKS_TWEETS_WITH_LIKES}>Likes</Link>,
    key: "likes",
  },
];

const Bookmark = () => (
  <Layout
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
    }}
  >
    <SubNav items={items} />
    <Tweets />
  </Layout>
);

export default Bookmark;
