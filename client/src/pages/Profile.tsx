import { Layout, MenuProps } from "antd";
import { Link, useParams } from "react-router-dom";
import SubNav from "../components/SubNav/SubNav";
import Tweets from "../components/Tweets/Tweets";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import { PATHS } from "../constants";
import { getTweetsPath } from "../helpers";

const { PROFILE_TWEETS, PROFILE_TWEETS_WITH_REPLIES, PROFILE_TWEETS_WITH_MEDIA, PROFILE_TWEETS_WITH_LIKES } = PATHS;

const items = (userId?: string): MenuProps["items"] => [
  {
    label: <Link to={getTweetsPath(PROFILE_TWEETS, userId)}>Tweets</Link>,
    key: "Tweets",
  },
  {
    label: <Link to={getTweetsPath(PROFILE_TWEETS_WITH_REPLIES, userId)}>Tweets & replies</Link>,
    key: "Tweets_and_replies",
  },
  {
    label: <Link to={getTweetsPath(PROFILE_TWEETS_WITH_MEDIA, userId)}>Media</Link>,
    key: "media",
  },
  {
    label: <Link to={getTweetsPath(PROFILE_TWEETS_WITH_LIKES, userId)}>Likes</Link>,
    key: "likes",
  },
];

const Profile = () => {
  const { userId } = useParams();

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
      <ProfileCard userId={userId} />
      <SubNav items={items(userId)} />
      <Tweets />
    </Layout>
  );
};

export default Profile;
