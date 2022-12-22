import { Avatar, Button, Card, Col, message, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { ERROR_MESSAGES } from "../../constants";
import FollowButton from "../../elements/FollowButton/FollowButton";
import useUserInfo from "../../hooks/useUserInfo";
import useAppSelector from "../../redux/hooks/useAppSelector";
import { FollowModalTypes } from "../../types";
import FollowModal from "../FollowModal/FollowModal";

type Props = {
  userId?: string;
};

const ProfileCard = ({ userId }: Props) => {
  const { id } = useAppSelector((state) => state.USER);
  const { data, isLoading, isError } = useUserInfo(userId);
  const [modalType, setModalType] = useState<FollowModalTypes | null>(null);
  const { avatar, username, bio, followers, following, amIFollowing } = data ?? {};

  const handleFollowingClick = () => {
    setModalType(FollowModalTypes.FOLLOWING);
  };

  const handleFollowersClick = () => {
    setModalType(FollowModalTypes.FOLLOWERS);
  };

  const handleCancel = () => {
    setModalType(null);
  };

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  if (!data) {
    return null;
  }

  return (
    <>
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
              <Button type="text" onClick={handleFollowingClick}>
                <span style={{ fontWeight: 700, fontSize: "18px", lineHeight: "22px", paddingRight: "5px" }}>
                  {following ?? 0}
                </span>
                Following
              </Button>
              <Button type="text" onClick={handleFollowersClick}>
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
        <FollowButton userId={userId} amIFollowing={Boolean(amIFollowing)} containerStyle={{ padding: "25px 0" }} />
      </Card>
      {modalType ? <FollowModal userId={userId ?? id} type={modalType} handleCancel={handleCancel} /> : null}
    </>
  );
};

export default ProfileCard;
