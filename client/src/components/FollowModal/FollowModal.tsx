import { Empty, message, Modal } from "antd";
import { useEffect } from "react";
import { BASE_API, ERROR_MESSAGES } from "../../constants";
import UserCard from "../../elements/UserCard/UserCard";
import useAppSelector from "../../redux/hooks/useAppSelector";
import { useGetFollowDataQuery } from "../../redux/store/api/apiSlice";
import { FollowModalTypes } from "../../types";

type Props = {
  userId: number | string | null;
  type: FollowModalTypes;
  handleCancel: () => void;
};

const FollowModal = ({ userId, type, handleCancel }: Props) => {
  const url = `${BASE_API}/${type}/${userId}`;
  const { data, isError } = useGetFollowDataQuery(url);
  const { id } = useAppSelector((state) => state.USER);
  const { username, data: followData } = data ?? {};
  const isItMe = userId === id;
  const endOfTitle = type === FollowModalTypes.FOLLOWERS ? "followed by" : "following";
  const title = isItMe ? `You're ${endOfTitle}` : `${username} is ${endOfTitle}`;

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  return (
    <Modal
      title={title}
      open={!!type}
      onCancel={handleCancel}
      footer={null}
      bodyStyle={{ maxWidth: "846px", width: "100%", display: "flex", flexDirection: "column", gap: 5 }}
      style={{ maxWidth: "846px", width: "100%" }}
    >
      {followData?.length ? (
        followData.map(({ username: followUsername, bio, id: followUserId, avatar, followers, amIFollowing }) => (
          <UserCard
            key={followUserId}
            userId={followUserId}
            avatar={avatar}
            username={followUsername}
            bio={bio}
            followers={followers}
            amIFollowing={amIFollowing}
            handleCancel={handleCancel}
          />
        ))
      ) : (
        <Empty />
      )}
    </Modal>
  );
};

export default FollowModal;
