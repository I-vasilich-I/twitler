import { Avatar, Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { PATHS } from "../../../constants";
import FollowButton from "../../../elements/FollowButton/FollowButton";
import { getTweetsPath } from "../../../helpers";
import useAppSelector from "../../../redux/hooks/useAppSelector";

type Props = {
  userId: number;
  avatar: string | null;
  username: string;
  bio: string | null;
  followers: number;
  amIFollowing: boolean;
  handleCancel: () => void;
};

const FollowUserCard = ({ userId, avatar, username, bio, followers, amIFollowing, handleCancel }: Props) => {
  const { id } = useAppSelector((state) => state.USER);
  const linkUserId = id === userId ? undefined : userId;

  return (
    <Card
      style={{ width: "100%" }}
      bodyStyle={{ width: "100%", padding: "10px", display: "flex", flexDirection: "column", gap: 5 }}
    >
      <Row style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <Col style={{ display: "flex", gap: 20 }}>
          <Link to={getTweetsPath(PATHS.PROFILE_TWEETS, linkUserId)} onClick={handleCancel}>
            <Col>
              <Avatar src={avatar} size={64} shape="square" />
            </Col>
          </Link>
          <Col>
            <Link to={getTweetsPath(PATHS.PROFILE_TWEETS, linkUserId)} onClick={handleCancel}>
              <Row style={{ display: "flex", alignItems: "baseline" }}>
                <Typography.Paragraph style={{ fontWeight: 700, fontSize: "22px", lineHeight: "26px", margin: 0 }}>
                  {username}
                </Typography.Paragraph>
              </Row>
            </Link>
            <Row style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Paragraph style={{ fontWeight: 700, fontSize: "18px", lineHeight: "22px", margin: 0 }}>
                {followers}
                <span style={{ fontWeight: 400, paddingLeft: "5px" }}>Followers</span>
              </Typography.Paragraph>
            </Row>
          </Col>
        </Col>
        <FollowButton userId={userId} amIFollowing={amIFollowing} />
      </Row>
      {bio ? (
        <Row>
          <Typography.Paragraph style={{ margin: 0 }}>{bio}</Typography.Paragraph>
        </Row>
      ) : null}
    </Card>
  );
};

export default FollowUserCard;
