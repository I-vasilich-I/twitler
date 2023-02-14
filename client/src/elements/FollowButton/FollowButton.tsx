import { Button, Col, message } from "antd";
import { CSSProperties, useEffect } from "react";
import { ERROR_MESSAGES } from "../../constants";
import { getFollowUrl } from "../../helpers";
import useAppSelector from "../../redux/hooks/useAppSelector";
import { useFollowMutation } from "../../redux/store/api/apiSlice";

type Props = {
  amIFollowing: boolean;
  userId?: number | string;
  containerStyle?: CSSProperties;
};

const FollowButton = ({ userId, amIFollowing, containerStyle }: Props) => {
  const { id } = useAppSelector((state) => state.USER);
  const [handleFollow, { isError, isLoading }] = useFollowMutation();
  const followButtonTitle = amIFollowing ? "Unfollow" : "Follow";
  const isItMe = !userId || id === +userId;

  const handleFollowClick = () => {
    if (!userId) {
      return;
    }

    handleFollow(getFollowUrl(userId, amIFollowing));
  };

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  return isItMe ? null : (
    <Col style={containerStyle}>
      <Button type="primary" danger={amIFollowing} onClick={handleFollowClick} loading={isLoading}>
        {followButtonTitle}
      </Button>
    </Col>
  );
};

export default FollowButton;
