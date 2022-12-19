import { Avatar, Button, Card, Col, message, Row, Typography } from "antd";
import { useEffect } from "react";
import { ERROR_MESSAGES } from "../../constants";
import useUserInfo from "../../hooks/useUserInfo";
import useAppSelector from "../../redux/hooks/useAppSelector";

type Props = {
  userId?: string;
};

const UserCard = ({ userId }: Props) => {
  const { id } = useAppSelector((state) => state.USER);
  const { data, isLoading, isError } = useUserInfo(userId);
  const isMyProfile = !userId || id === +userId;

  const { avatar, username, bio, followers, following } = data ?? {};

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  if (!data) {
    return null;
  }

  return (
    <Card
      style={{ width: "100%", maxWidth: "1080px" }}
      bodyStyle={{ display: "flex", width: "100%", gap: 15 }}
      loading={isLoading}
    >
      <Col style={{ display: "flex", width: "100%", gap: 15 }}>
        <Col>
          <Avatar src={avatar} size={156} shape="square" />
        </Col>
        <Col style={{ padding: "25px 0" }}>
          <Row style={{ display: "flex", alignItems: "baseline", columnGap: 25 }}>
            <Typography.Paragraph style={{ fontWeight: 700, fontSize: "24px", lineHeight: "29px" }}>
              {username}
            </Typography.Paragraph>
            <Button type="text">
              <span style={{ fontWeight: 700, fontSize: "18px", lineHeight: "22px", paddingRight: "5px" }}>
                {following ?? 0}
              </span>
              Following
            </Button>
            <Button type="text">
              <span style={{ fontWeight: 700, fontSize: "18px", lineHeight: "22px", paddingRight: "5px" }}>
                {followers ?? 0}
              </span>
              Followers
            </Button>
          </Row>
          <Row>
            <Typography.Paragraph>{bio}</Typography.Paragraph>
          </Row>
        </Col>
      </Col>
      {isMyProfile ? null : (
        <Col style={{ padding: "25px 0" }}>
          <Button type="primary">Follow</Button>
        </Col>
      )}
    </Card>
  );
};

export default UserCard;
