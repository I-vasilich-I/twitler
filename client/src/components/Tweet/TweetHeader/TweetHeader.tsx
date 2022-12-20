import { Avatar, Card } from "antd";
import { Link } from "react-router-dom";
import { PATHS } from "../../../constants";
import { formatTimestamp, getTweetsPath } from "../../../helpers";
import useAppSelector from "../../../redux/hooks/useAppSelector";

type Props = {
  avatar: string | null;
  username: string;
  timestamp: string;
  userId: number;
};

const { Meta } = Card;

const TweetHeader = ({ avatar, username, timestamp, userId }: Props) => {
  const date = formatTimestamp(timestamp);
  const { id } = useAppSelector((state) => state.USER);
  const linkUserId = id === userId ? undefined : userId;

  return (
    <Link to={getTweetsPath(PATHS.PROFILE_TWEETS, linkUserId)}>
      <Meta
        avatar={<Avatar shape="square" src={avatar} size={45} />}
        title={<span style={{ fontSize: "16px" }}>{username}</span>}
        description={
          <span style={{ fontWeight: 300, fontSize: "12px", lineHeight: "15px", color: "#000000" }}>{date}</span>
        }
        style={{ marginBottom: "10px" }}
        className="container"
      />
    </Link>
  );
};

export default TweetHeader;
