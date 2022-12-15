import { Avatar, Card } from "antd";
import { formatTimestamp } from "../../../helpers";

type Props = {
  avatar: string | null;
  username: string;
  timestamp: string;
};

const { Meta } = Card;

const TweetHeader = ({ avatar, username, timestamp }: Props) => {
  const date = formatTimestamp(timestamp);
  return (
    <Meta
      avatar={<Avatar shape="square" src={avatar} size={45} />}
      title={<span style={{ fontSize: "16px" }}>{username}</span>}
      description={
        <span style={{ fontWeight: 300, fontSize: "12px", lineHeight: "15px", color: "#000000" }}>{date}</span>
      }
      style={{ marginBottom: "10px" }}
      className="container"
    />
  );
};

export default TweetHeader;
